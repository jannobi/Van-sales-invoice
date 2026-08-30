const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Session = require('../models/Session');

const auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.id);
    
    if (!user || !user.isActive) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    const session = await Session.findOne({
      where: { token, isActive: true }
    });

    if (!session) {
      return res.status(401).json({ message: 'Session expired' });
    }

    req.user = user;
    req.session = session;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Authentication failed' });
  }
};

module.exports = auth;
