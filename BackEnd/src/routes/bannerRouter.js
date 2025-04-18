const express = require('express');
const router = express.Router();
const bannerController = require('../controllers/bannerController');
const { authMiddleware } = require('../middleware/authMiddleware');

router.post('/createBanner', bannerController.createBanner);
router.get('/getAllBanner', bannerController.getAllBanners);
router.get('/getActiveBanner', bannerController.getActiveBanners);
router.put('/updateStatusBanner/:id', bannerController.updateBannerStatus);
router.delete('/delete/:id', bannerController.deleteBanner);

module.exports = router;