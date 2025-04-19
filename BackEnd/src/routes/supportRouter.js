const express = require('express');
const router = express.Router();
const supportController = require('../controllers/supportController');

router.post('/createSupport', supportController.createSupportRequest);
router.get('/getSupport', supportController.getAllSupportRequests);
router.patch('/updateRequestSupport/:id', supportController.updateRequestStatus);
router.delete('/deleteSupport/:requestId', supportController.deleteSupportRequest);
router.get("/historySupport/:userId", supportController.getSupportHistory);

module.exports = router;
