const express = require('express');
const router = express.Router();
const brandController = require('../controllers/brandController');

router.post('/createBrand', brandController.createBrand);
router.get('/getAllBrand', brandController.getAllBrand);
router.get('/getActiveBrand', brandController.getActiveBrand);
router.patch('/updateStatusBrand/:id', brandController.updateBrandStatus);
router.delete('/delete/:id', brandController.deleteBrand);

module.exports = router;