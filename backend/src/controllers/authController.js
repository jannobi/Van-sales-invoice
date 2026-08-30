const User = require('../models/User');
const Company = require('../models/Company');
const Session = require('../models/Session');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

exports.register = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password, firstName, lastName, companyName, businessType, accessCode } = req.body;

    // Check if access code is valid for company admin
    if (accessCode !== process.env.COMPANY_ADMIN_ACCESS_CODE) {
      return res.status(401).json({ message: 'Invalid access code' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create company
    const company = await Company.create({
      name: companyName,
      businessType,
      isTrial: true
    });

    // Create user
    const user = await User.create({
      email,
      password,
      firstName,
      lastName,
      role: 'company_admin',
      companyId: company.id
    });

    // Generate JWT
    const token = jwt.sign(
      { id: user.id, role: user.role, companyId: company.id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRY }
    );

    // Create session
    await Session.create({
      userId: user.id,
      token,
      deviceInfo: req.headers['user-agent'],
      ipAddress: req.ip,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    });

    res.status(201).json({
      message: 'Registration successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        companyId: company.id
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password, accessCode } = req.body;

    let user = await User.findOne({ where: { email } });

    // Check if super admin login
    if (!user && accessCode === process.env.SUPER_ADMIN_ACCESS_CODE) {
      user = await User.findOne({
        where: {
          role: 'super_admin',
          email: 'superadmin@system.com'
        }
      });
      
      if (!user) {
        // Create super admin if doesn't exist
        user = await User.create({
          email: 'superadmin@system.com',
          password: Math.random().toString(36).slice(-12),
          firstName: 'Super',
          lastName: 'Admin',
          role: 'super_admin'
        });
      }
    }

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Validate password
    const isValid = await user.validatePassword(password);
    if (!isValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (!user.isActive) {
      return res.status(403).json({ message: 'Account is deactivated' });
    }

    // Update last login
    await user.update({ lastLogin: new Date() });

    // Generate JWT
    const token = jwt.sign(
      { id: user.id, role: user.role, companyId: user.companyId },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRY }
    );

    // Create session
    await Session.create({
      userId: user.id,
      token,
      deviceInfo: req.headers['user-agent'],
      ipAddress: req.ip,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    });

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        companyId: user.companyId
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.logout = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (token) {
      await Session.update(
        { isActive: false },
        { where: { token } }
      );
    }
    res.json({ message: 'Logout successful' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] }
    });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
