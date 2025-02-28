const formatter = (amount) => {
    return new Intl.NumberFormat("vi-VN").format(amount) + " đ";
};
export default formatter;