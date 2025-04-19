// controllers/bannerController.js
const brandService = require('../services/brandService');

const createBrand = async (req, res) => {
    try {
        const result = await brandService.createBrand(req.body);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json(error);
    }
};

const getAllBrand = async (req, res) => {
    try {
        const result = await brandService.getAllBrand();
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json(error);
    }
};

const getActiveBrand = async (req, res) => {
    try {
        const result = await brandService.getActiveBrand();
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json(error);
    }
};

const updateBrandStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    try {
        const result = await brandService.updateBrandStatus(id, status);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json(error);
    }
};

const deleteBrand = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await brandService.deleteBrand(id);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json(error);
    }
};

module.exports = {
    createBrand,
    getAllBrand,
    getActiveBrand,
    updateBrandStatus,
    deleteBrand
};
