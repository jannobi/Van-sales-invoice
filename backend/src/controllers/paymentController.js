const Company = require('../models/Company');
const Subscription = require('../models/Subscription');

exports.subscribe = async (req, res) => {
  try {
    const { tier, paymentMethod, paymentDetails } = req.body;
    const companyId = req.user.companyId;

    const company = await Company.findByPk(companyId);
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }

    const paymentResult = {
      success: true,
      transactionId: 'TXN_' + Date.now()
    };

    if (!paymentResult.success) {
      return res.status(400).json({ message: 'Payment failed' });
    }

    const startDate = new Date();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + 1);

    const [subscription, created] = await Subscription.findOrCreate({
      where: { companyId },
      defaults: {
        tier,
        price: paymentDetails.amount || 49,
        startDate,
        endDate,
        isActive: true,
        autoRenew: paymentDetails.autoRenew || false,
        paymentMethod,
        paymentToken: paymentResult.transactionId,
        lastPaymentDate: startDate,
        nextPaymentDate: endDate,
        status: 'active'
      }
    });

    if (!created) {
      await subscription.update({
        tier,
        price: paymentDetails.amount || 49,
        startDate,
        endDate,
        isActive: true,
        paymentToken: paymentResult.transactionId,
        lastPaymentDate: startDate,
        nextPaymentDate: endDate,
        status: 'active'
      });
    }

    await company.update({
      subscriptionTier: tier,
      subscriptionStart: startDate,
      subscriptionEnd: endDate,
      isTrial: false,
      isActive: true
    });

    res.json({
      message: 'Subscription successful',
      subscription,
      company
    });
  } catch (error) {
    console.error('Subscription error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.verifyPayment = async (req, res) => {
  try {
    res.json({ message: 'Payment verified' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.webhook = async (req, res) => {
  try {
    res.json({ received: true });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
