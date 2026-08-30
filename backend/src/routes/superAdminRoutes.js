const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');
const superAdminController = require('../controllers/superAdminController');

router.get('/companies', auth, roleCheck('super_admin'), superAdminController.getCompanies);
router.get('/companies/:id', auth, roleCheck('super_admin'), superAdminController.getCompanyDetails);
router.get('/companies/:companyId/sessions', auth, roleCheck('super_admin'), superAdminController.getCompanySessions);
router.post('/sessions/:sessionId/block', auth, roleCheck('super_admin'), superAdminController.blockDevice);

module.exports = router;
