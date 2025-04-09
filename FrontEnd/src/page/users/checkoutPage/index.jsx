import { memo, useMemo } from "react";
import formatter from "../../../utils/formatter";
import { useState, useEffect } from "react";
import * as cartService from "../../../services/cartService.js";
import * as orderService from "../../../services/orderService.js";
import * as paymentService from "../../../services/paymentService.js";
import * as voucherService from "../../../services/voucherService.js";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import ToastNotification from "../../../component/toastNotification/index.js";
import { useLocation } from "react-router-dom";

const CheckoutPage = () => {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("COD");
  const [note, setNote] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [size, setSize] = useState("");
  const [showCofirmModal, setShowCofirmModal] = useState(false);
  const [selectedVoucher, setSelectedVoucher] = useState(null);
  const location = useLocation();
  const token = localStorage.getItem("access_token");
  let userId;
  if (token) {
    const decoded = jwtDecode(token);
    userId = decoded.id;
  }

  const { productId, product, quantity, selectedSize } = location.state || {};
  const isBuyNow = quantity;

  const { data: voucherData } = useQuery({
    queryKey: ["voucher"],
    queryFn: () => voucherService.getActiveVoucher(),
  });

  const { data: cartData, refetch } = useQuery({
    queryKey: ["cart", userId],
    queryFn: () => cartService.getCart(userId),
    enabled: !!userId && isBuyNow === 0, // Chặn khi isBuyNow là true
  });

  const handlePayment = async () => {
    if (!selectedPaymentMethod || !name || !phone || !email) {
      toast.error("Vui lòng nhập đầy đủ thông tin.");
      return;
    }

    const orderItems = isBuyNow
      ? [
          {
            productId,
            quantity,
            price: product.price,
            size: selectedSize,
          },
        ]
      : cartData.cart.data.products.map((item) => ({
          productId: item.productId._id,
          quantity: item.quantity,
          price: item.price,
          size: item.size,
        }));

    const orderData = {
      userId,
      items: orderItems,
      shippingAddress: {
        street,
        province: selectedProvince,
        district: selectedDistrict,
        ward: selectedWard,
      },
      paymentMethod: selectedPaymentMethod,
      note,
      total: finalAmount, // Áp dụng giảm giá nếu có
      customerInfo: {
        nameReceiver: name,
        phoneReceiver: phone,
        emailReceiver: email,
      },
    };

    if (orderItems.length === 0) {
      toast.error("Giỏ hàng của bạn đang trống.");
      return;
    }

    try {
      const createOrder = await orderService.createOrder(
        orderData.userId,
        orderData.items,
        orderData.shippingAddress,
        orderData.paymentMethod,
        orderData.note,
        orderData.total,
        orderData.customerInfo
      );

      if (createOrder && createOrder.success) {
        toast.success("Đặt hàng thành công!");

        await cartService.clearCart(orderData.userId);

        // Nếu là COD thì redirect về trang cảm ơn hoặc lịch sử đơn hàng
        if (selectedPaymentMethod === "COD") {
          // window.location.href = ""; 
          return;
        }

        // Nếu Banking thì xử lý VNPay
        const orderId = createOrder.order._id;
        const paymentVNPay = await paymentService.createVNPayPayment(
          orderId,
          finalAmount
        );
        window.location.href = paymentVNPay.paymentUrl;
      } else {
        toast.error("Đặt hàng thất bại.");
      }

      refetch();
    } catch (error) {
      console.error("Lỗi đặt hàng:", error);
      toast.error("Có lỗi xảy ra khi đặt hàng.");
    }
  };

  const handleNameChange = (e) => {
    setName(e.target.value);
  };
  const handlePhoneChange = (e) => {
    setPhone(e.target.value);
  };
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };
  const handleNoteChange = (e) => {
    setNote(e.target.value);
  };
  const handlePaymentMethodChange = (e) => {
    setSelectedPaymentMethod(e.target.value);
  };

  //Địa chỉ
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedWard, setSelectedWard] = useState("");
  const [street, setStreet] = useState("");
  const handleStreetChange = (e) => {
    setStreet(e.target.value);
  };

  useEffect(() => {
    axios
      .get("https://provinces.open-api.vn/api/p/")
      .then((res) => {
        setProvinces(res.data);
      })
      .catch((error) => {
        console.error("Lỗi khi lấy danh sách tỉnh/thành: ", error);
      });
  }, []);

  const handleProvinceChange = (e) => {
    const provinceCode = e.target.value;
    const selectedProvince = provinces.find(
      (province) => province.code === parseInt(provinceCode)
    );

    setSelectedProvince(selectedProvince ? selectedProvince.name : "");
    setSelectedDistrict("");
    setWards([]);

    axios
      .get(`https://provinces.open-api.vn/api/p/${provinceCode}?depth=2`)
      .then((res) => {
        setDistricts(res.data.districts);
      });
  };

  const handleDistrictChange = (e) => {
    const districtCode = e.target.value;
    const selectedDistrict = districts.find(
      (district) => district.code === parseInt(districtCode)
    );

    setSelectedDistrict(selectedDistrict ? selectedDistrict.name : "");

    axios
      .get(`https://provinces.open-api.vn/api/d/${districtCode}?depth=2`)
      .then((res) => {
        setWards(res.data.wards);
      });
  };

  const handleWardChange = (e) => {
    const wardCode = e.target.value;
    const selectedWard = wards.find((ward) => ward.code === parseInt(wardCode));

    setSelectedWard(selectedWard ? selectedWard.name : "");
  };

  const totalAmount = isBuyNow
    ? product.price * quantity
    : cartData?.cart?.data?.products?.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );
  const voucher = voucherData?.data;
  console.log("voucher", voucher);

  const cartItems = cartData?.cart?.data?.products || [];
  const applyVoucher = (voucher, cartItems, isBuyNow, product, quantity) => {
    const totalAmount = isBuyNow
      ? product.price * quantity
      : cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    if (!voucher)
      return { discountAmount: 0, finalAmount: totalAmount, isValid: false };

    let applicableItems = [];

    if (isBuyNow) {
      if (voucher.type === "total_order") {
        applicableItems = [{ price: product.price, quantity }];
      } else if (voucher.type === "brand" && product.brand === voucher.brand) {
        applicableItems = [{ price: product.price, quantity }];
      } else {
        toast.error("❌ Voucher không áp dụng cho sản phẩm này");
        return { discountAmount: 0, finalAmount: totalAmount, isValid: false };
      }
    } else {
      if (voucher.type === "total_order") {
        applicableItems = cartItems;
      } else if (voucher.type === "brand") {
        applicableItems = cartItems.filter(
          (item) => item.productId.brand === voucher.brand
        );
        if (applicableItems.length === 0) {
          toast.error(
            "❌ Không có sản phẩm phù hợp với thương hiệu của voucher"
          );
          return {
            discountAmount: 0,
            finalAmount: totalAmount,
            isValid: false,
          };
        }
      }
    }

    const applicableTotal = applicableItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    if (applicableTotal < voucher.minOrder) {
      toast.error("❌ Đơn hàng chưa đạt giá trị tối thiểu để dùng voucher");
      return { discountAmount: 0, finalAmount: totalAmount, isValid: false };
    }

    let discountAmount = 0;
    if (voucher.discountType === "percent") {
      discountAmount = (applicableTotal * voucher.discount) / 100;
      if (voucher.maxDiscount && discountAmount > voucher.maxDiscount) {
        discountAmount = voucher.maxDiscount;
      }
    } else if (voucher.discountType === "fixed") {
      discountAmount = voucher.discount;
    }

    return {
      discountAmount,
      finalAmount: Math.max(totalAmount - discountAmount, 0),
      isValid: true,
    };
  };

  const { discountAmount, finalAmount, isValid } = applyVoucher(
    selectedVoucher,
    cartItems,
    isBuyNow,
    product,
    quantity
  );

  return (
    <div className="max-w-screen-xl flex mx-auto gap-5">
      {/* Phần thông tin đặt hàng */}
      <div className="w-2/3 h-[700px] mt-5 bg-white p-4 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold">Thông tin đặt hàng:</h1>

        <div className="flex flex-col">
          <label className="text-xl m-1">
            Họ và tên: <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            className="pl-2 py-1 border shadow border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Nhập họ và tên"
            onChange={handleNameChange}
          />
        </div>

        <div className="flex gap-5 mt-3">
          <div className="flex-1 flex flex-col">
            <label className="text-xl m-1">
              Điện thoại: <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              className="pl-2 py-1 border shadow border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Nhập số điện thoại"
              onChange={handlePhoneChange}
            />
          </div>
          <div className="flex-1 flex flex-col">
            <label className="text-xl m-1">
              Email: <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              className="pl-2 py-1 border shadow border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Nhập email"
              onChange={handleEmailChange}
            />
          </div>
        </div>

        <div className="flex flex-col mt-3">
          <label className="text-xl m-1">
            Địa chỉ: <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            className="pl-2 py-1 border shadow border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Nhập địa chỉ"
            onChange={handleStreetChange}
          />
        </div>

        <div className="flex gap-2">
          <div className="flex flex-col mt-3 w-1/3">
            <label className="text-xl m-1">
              Tỉnh thành: <span className="text-red-500">*</span>
            </label>
            <select
              className="pl-2 py-1 border shadow border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={handleProvinceChange}
            >
              <option value="">Chọn tỉnh thành</option>
              {provinces.map((items) => (
                <option key={items.code} value={items.code}>
                  {items.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col mt-3 w-1/3">
            <label className="text-xl m-1">
              Quận/Huyện: <span className="text-red-500">*</span>
            </label>
            <select
              className="pl-2 py-1 border shadow border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={handleDistrictChange}
              disabled={!selectedProvince}
            >
              <option value="">Chọn Quận/Huyện</option>
              {districts.map((items) => (
                <option key={items.code} value={items.code}>
                  {items.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col mt-3 w-1/3">
            <label className="text-xl m-1">
              Phường/Xã: <span className="text-red-500">*</span>
            </label>
            <select
              className="pl-2 py-1 border shadow border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={handleWardChange}
              disabled={!selectedDistrict}
            >
              <option value="">Chọn phường/xã</option>
              {wards.map((w) => (
                <option key={w.code} value={w.code}>
                  {w.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex flex-col mt-3">
          <label className="text-xl m-1">Ghi chú:</label>
          <textarea
            value={note} // Đặt giá trị của textarea là state note
            onChange={handleNoteChange} // Lắng nghe sự thay đổi để cập nhật state
            className="border p-2 mt-2"
            rows="4" // Đặt số dòng hiển thị
            placeholder="Nhập ghi chú của bạn ở đây..."
          />
        </div>

        <div className="flex flex-col mt-3">
          <label className="text-xl m-1">Phương thức thanh toán:</label>
          <div className="flex gap-4 mt-2 flex-col">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="payment"
                value="COD"
                checked={selectedPaymentMethod === "COD"} // Kiểm tra phương thức đã chọn
                onChange={handlePaymentMethodChange}
                className="w-4 h-4"
              />
              Thanh toán khi nhận hàng (COD)
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="payment"
                value="Banking"
                checked={selectedPaymentMethod === "Banking"} // Kiểm tra phương thức đã chọn
                onChange={handlePaymentMethodChange}
                className="w-4 h-4"
              />
              Chuyển khoản ngân hàng
            </label>
          </div>
        </div>
      </div>
      {/* Voucher */}
      {/* Phần đơn hàng */}
      <div className="w-1/3">
        <div className="bg-white p-5 rounded-xl shadow-lg self-start mt-2 space-y-4">
          <h1 className="text-2xl font-bold mb-2">Đơn hàng</h1>

          {isBuyNow ? (
            <div className="flex gap-3 items-start border-b pb-3">
              <img
                src={product.image}
                alt=""
                className="h-[60px] w-[80px] object-cover rounded"
              />
              <div className="flex flex-col text-sm text-black">
                <p className="font-semibold">{product.name}</p>
                <div className="flex gap-2 text-gray-600">
                  <p>Size: {selectedSize}</p>
                  <span>|</span>
                  <p>SL: {quantity}</p>
                </div>
                <p className="mt-1 font-medium">{formatter(product.price)}</p>
              </div>
            </div>
          ) : (
            cartData?.cart?.data?.products?.map((item) => (
              <div
                className="flex gap-3 items-start border-b pb-3"
                key={item.productId._id}
              >
                <img
                  src={item.productId.image}
                  alt=""
                  className="h-[60px] w-[80px] object-cover rounded"
                />
                <div className="flex flex-col text-sm text-black">
                  <p className="font-semibold">{item.productId.name}</p>
                  <div className="flex gap-2 text-gray-600">
                    <p>Size: {item.size}</p>
                    <span>|</span>
                    <p>SL: {item.quantity}</p>
                  </div>
                  <p className="mt-1 font-medium">{formatter(item.price)}</p>
                </div>
              </div>
            ))
          )}

          <div className="pt-2 border-t border-gray-200">
            {selectedVoucher && isValid && (
              <div className="flex justify-between items-center font-medium text-black mb-2">
                <span>
                  Mã áp dụng: <strong>{selectedVoucher.code}</strong>
                </span>
                <span>-{formatter(discountAmount)}</span>
              </div>
            )}

            <div className="flex justify-between items-center text-base font-semibold">
              <span>Tổng cộng:</span>
              <span
                className={`text-lg ${
                  selectedVoucher && isValid
                    ? "line-through text-gray-400"
                    : "text-black font-bold"
                }`}
              >
                {formatter(totalAmount)}
              </span>
            </div>

            {selectedVoucher && isValid && (
              <div className="flex justify-between items-center text-lg font-bold text-black mt-1">
                <span>Thành tiền:</span>
                <span>{formatter(finalAmount)}</span>
              </div>
            )}
          </div>

          <button
            className="w-full bg-black hover:bg-gray-800 transition duration-200 text-white text-lg font-bold py-3 rounded-xl mt-4"
            onClick={() => setShowCofirmModal(true)}
          >
            Đặt hàng
          </button>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-lg self-start mt-2">
          <h1 className="text-2xl font-bold">Voucher:</h1>
          <div className="max-h-[300px] overflow-y-auto pr-1">
            {voucherData?.data?.length > 0 ? (
              voucherData.data.map((voucher, index) => (
                <div className="border border-gray-300 rounded-lg p-3 flex justify-between items-center hover:shadow-md transition duration-200 cursor-pointer mt-2">
                  <div>
                    <p className="text-lg font-bold text-gray-600">
                      {voucher.code}
                    </p>
                    <p className="text-sm text-gray-700">
                      {voucher.description}
                    </p>

                    <p className="text-sm text-gray-600 mt-1">
                      Đơn tối thiểu:{" "}
                      <span className="font-medium">
                        {formatter(voucher.minOrder)}
                      </span>{" "}
                      {voucher.maxDiscount > 0 && (
                        <>
                          <br />
                          Giảm tối đa:{" "}
                          <span className="font-medium">
                            {formatter(voucher.maxDiscount)}
                          </span>
                        </>
                      )}
                    </p>

                    <p className="text-xs text-gray-500 mt-2">
                      HSD:{" "}
                      {new Date(voucher.expiryDate).toLocaleDateString("vi-VN")}
                    </p>
                  </div>

                  <button
                    onClick={() => setSelectedVoucher(voucher)}
                    className="text-sm px-4 py-1 bg-black text-white rounded-md hover:bg-gray-800 transition"
                  >
                    Chọn
                  </button>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">
                Không có voucher khả dụng.
              </p>
            )}
          </div>
        </div>
      </div>
      {showCofirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white w-1/4 h-1/5 rounded-lg flex flex-col justify-center items-center">
            <div>
              <h1 className="font-bold text-3xl text-center p-2">
                Xác nhận thanh toán
              </h1>
            </div>
            <div className="flex gap-3 p-3">
              <button
                className="px-4 py-2 bg-white border font-bold w-[60px] rounded-lg"
                onClick={() => setShowCofirmModal(false)} // Hủy modal
              >
                Hủy
              </button>
              <button
                className="px-4 py-2 bg-black text-white font-bold w-3/4 rounded-lg"
                onClick={handlePayment} // Gọi handlePayment khi xác nhận
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}
      <ToastNotification />
    </div>
  );
};

export default memo(CheckoutPage);
