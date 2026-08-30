const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

router.get('/dashboard', auth, roleCheck('salesman'), (req, res) => {
  res.json({ message: 'Salesman dashboard' });
});

module.exports = router;
