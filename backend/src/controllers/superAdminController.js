const Company = require('../models/Company');
const User = require('../models/User');
const Session = require('../models/Session');
const Subscription = require('../models/Subscription');

exports.getCompanies = async (req, res) => {
  try {
    const companies = await Company.findAll({
      include: [
        { model: User, where: { role: 'company_admin' } },
        { model: Subscription }
      ]
    });
    res.json(companies);
  } catch (error) {
    console.error('Get companies error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getCompanyDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const company = await Company.findByPk(id, {
      include: [
        { model: User, where: { role: 'company_admin' } },
        { model: Subscription }
      ]
    });
    
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }
    
    res.json(company);
  } catch (error) {
    console.error('Get company details error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.blockDevice = async (req, res) => {
  try {
    const { sessionId } = req.params;
    
    const session = await Session.findByPk(sessionId);
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    await session.update({
      isBlocked: true,
      isActive: false
    });

    res.json({
      message: 'Device blocked successfully',
      session
    });
  } catch (error) {
    console.error('Block device error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getCompanySessions = async (req, res) => {
  try {
    const { companyId } = req.params;
    
    const sessions = await Session.findAll({
      include: [{
        model: User,
        where: { companyId },
        attributes: ['email', 'firstName', 'lastName']
      }],
      where: { isActive: true }
    });
    
    res.json(sessions);
  } catch (error) {
    console.error('Get company sessions error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
