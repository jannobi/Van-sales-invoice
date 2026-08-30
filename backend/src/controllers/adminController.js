const Salesman = require('../models/Salesman');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

exports.getSalesmen = async (req, res) => {
  try {
    const companyId = req.user.companyId;
    const salesmen = await Salesman.findAll({
      where: { companyId },
      include: [{ model: User, attributes: ['email', 'firstName', 'lastName'] }]
    });
    res.json(salesmen);
  } catch (error) {
    console.error('Get salesmen error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.addSalesman = async (req, res) => {
  try {
    const companyId = req.user.companyId;
    const { email, password, firstName, lastName, phone, employeeId, address, vanNumber } = req.body;

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      role: 'salesman',
      companyId,
      isActive: true
    });

    const salesman = await Salesman.create({
      userId: user.id,
      companyId,
      employeeId,
      phone,
      address,
      vanNumber,
      isActive: true
    });

    res.status(201).json({
      message: 'Salesman added successfully',
      salesman,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName
      }
    });
  } catch (error) {
    console.error('Add salesman error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateSalesman = async (req, res) => {
  try {
    const { id } = req.params;
    const { phone, address, vanNumber, isActive, dailyTarget } = req.body;

    const salesman = await Salesman.findByPk(id);
    if (!salesman) {
      return res.status(404).json({ message: 'Salesman not found' });
    }

    await salesman.update({
      phone: phone || salesman.phone,
      address: address || salesman.address,
      vanNumber: vanNumber || salesman.vanNumber,
      isActive: isActive !== undefined ? isActive : salesman.isActive,
      dailyTarget: dailyTarget || salesman.dailyTarget
    });

    res.json({
      message: 'Salesman updated successfully',
      salesman
    });
  } catch (error) {
    console.error('Update salesman error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteSalesman = async (req, res) => {
  try {
    const { id } = req.params;

    const salesman = await Salesman.findByPk(id);
    if (!salesman) {
      return res.status(404).json({ message: 'Salesman not found' });
    }

    await salesman.destroy();
    res.json({ message: 'Salesman deleted successfully' });
  } catch (error) {
    console.error('Delete salesman error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
