const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');
const adminController = require('../controllers/adminController');

router.get('/salesmen', auth, roleCheck('company_admin'), adminController.getSalesmen);
router.post('/salesmen', auth, roleCheck('company_admin'), adminController.addSalesman);
router.put('/salesmen/:id', auth, roleCheck('company_admin'), adminController.updateSalesman);
router.delete('/salesmen/:id', auth, roleCheck('company_admin'), adminController.deleteSalesman);

module.exports = router;
