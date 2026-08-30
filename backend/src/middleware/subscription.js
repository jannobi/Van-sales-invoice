const Company = require('../models/Company');

const checkSubscription = async (req, res, next) => {
  try {
    const companyId = req.user.companyId || req.body.companyId;
    
    if (!companyId) {
      return res.status(400).json({ message: 'Company ID required' });
    }

    const company = await Company.findByPk(companyId);
    
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }

    if (company.isTrial && new Date() > company.trialEnd) {
      company.isTrial = false;
      company.isActive = false;
      await company.save();
      return res.status(403).json({ 
        message: 'Trial expired. Please subscribe to continue.',
        requiresPayment: true
      });
    }

    if (!company.isActive) {
      return res.status(403).json({ 
        message: 'Subscription inactive. Please renew.',
        requiresPayment: true
      });
    }

    req.company = company;
    next();
  } catch (error) {
    console.error('Subscription check error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = checkSubscription;
