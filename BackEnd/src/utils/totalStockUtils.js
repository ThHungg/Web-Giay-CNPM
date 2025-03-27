// utils/stockUtils.js

const updateTotalStock = (sizeStock) => {
    return sizeStock ? sizeStock.reduce((total, item) => total + Number(item.stock), 0) : 0;
};

module.exports = {
    updateTotalStock
};
