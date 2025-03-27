const generateProductCode = () => {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0'); // Lấy giờ, đảm bảo 2 chữ số
    const minutes = String(now.getMinutes()).padStart(2, '0'); // Lấy phút, đảm bảo 2 chữ số
    const seconds = String(now.getSeconds()).padStart(2, '0'); // Lấy giây, đảm bảo 2 chữ số
    return `SP${hours}${minutes}${seconds}`;
};

module.exports = {
    generateProductCode
}