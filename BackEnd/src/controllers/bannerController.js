// controllers/bannerController.js
const bannerService = require('../services/bannerService');

const createBanner = async (req, res) => {
    try {
        const result = await bannerService.createBanner(req.body);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json(error);
    }
};

const getAllBanners = async (req, res) => {
    try {
        const result = await bannerService.getAllBanners();
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json(error);
    }
};

const getActiveBanners = async (req, res) => {
    try {
        const result = await bannerService.getActiveBanners();
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json(error);
    }
};

const updateBannerStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    try {
        const result = await bannerService.updateBannerStatus(id, status);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json(error);
    }
};

const deleteBanner = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await bannerService.deleteBanner(id);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json(error);
    }
};

module.exports = {
    createBanner,
    getAllBanners,
    getActiveBanners,
    updateBannerStatus,
    deleteBanner
};
