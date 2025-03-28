import { memo } from "react";
import formatter from "../../../utils/formatter";
import { useState, useEffect } from "react";
import * as cartService from "../../../services/cartService.js";
import * as orderService from "../../../services/orderService.js";
import * as paymentService from "../../../services/paymentService.js";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import ToastNotification from "../../../component/toastNotification/index.js";

const CheckoutPage = () => {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("COD");
  const [note, setNote] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [size, setSize] = useState("");
  const token = localStorage.getItem("access_token");
  let userId;
  if (token) {
    const decoded = jwtDecode(token);
    userId = decoded.id;
  }

  const { data: cartData, refetch } = useQuery({
    queryKey: ["cart", userId],
    queryFn: () => cartService.getCart(userId),
    enabled: !!userId,
  });

  const totalAmount = cartData?.cart?.data?.products?.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  console.log(totalAmount);
  console.log("Payment", selectedPaymentMethod);

  // const handleOrder = async () => {
  //   if (
  //     !userId ||
  //     !cartData ||
  //     !selectedPaymentMethod ||
  //     !name ||
  //     !phone ||
  //     !email
  //   ) {
  //     toast.error("Vui lòng nhập đầy đủ thông tin.");
  //     return;
  //   }
  //   const orderData = {
  //     userId: userId,
  //     items: cartData.cart.data.products.map((item) => ({
  //       productId: item.productId._id,
  //       quantity: item.quantity,
  //       price: item.price,
  //       size: item.size,
  //     })),
  //     shippingAddress: {
  //       street: street,
  //       province: selectedProvince,
  //       district: selectedDistrict,
  //       ward: selectedWard,
  //     },
  //     paymentMethod: selectedPaymentMethod,
  //     note: note,
  //     total: totalAmount,
  //     customerInfo: {
  //       nameReceiver: name,
  //       phoneReceiver: phone,
  //       emailReceiver: email,
  //     },
  //   };

  //   if (orderData.items.length === 0) {
  //     toast.error("Giỏ hàng của bạn đang trống.");
  //     return;
  //   }

  //   const createOrder = await orderService.createOrder(
  //     orderData.userId,
  //     orderData.items,
  //     orderData.shippingAddress,
  //     orderData.paymentMethod,
  //     orderData.note,
  //     orderData.total,
  //     orderData.customerInfo
  //   );

  //   if (createOrder && createOrder.success) {
  //     toast.success("Đặt hàng thành công");
  //     await cartService.clearCart(orderData.userId);
  //   } else {
  //     toast.error("Đặt hàng thất bại");
  //   }
  //   refetch();
  // };

  const handlePayment = async () => {
    // totalAmount
    if (selectedPaymentMethod && selectedPaymentMethod === "Banking") {
      try {
        const data = await paymentService.createVNPayPayment(totalAmount);
        console.log("data", data);
        window.location.href = data.paymentUrl;
      } catch (e) {}
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

  // const validateForm = () => {
  //   let errors = {};

  //   // Kiểm tra họ tên
  //   if (!name) {
  //     errors.name = "Họ và tên là bắt buộc!";
  //   }

  //   // Kiểm tra số điện thoại
  //   if (!phone) {
  //     errors.phone = "Số điện thoại là bắt buộc!";
  //   } else if (!/^[0-9]{10}$/.test(phone)) {
  //     errors.phone = "Số điện thoại không hợp lệ!";
  //   }
  //   if (!email) {
  //     errors.email = "Email là bắt buộc!";
  //   }
  //   // else if (!/\S+@\S+\.\S+/.test(email)) {
  //   //   errors.email = "Email không hợp lệ!";
  //   // }

  //   // if (!street) {
  //   //   errors.street = "Địa chỉ cụ thể là bắt buộc!";
  //   // }

  //   // if (!selectedProvince) {
  //   //   errors.province = "Tỉnh/Thành phố là bắt buộc!";
  //   // }
  //   // if (!selectedDistrict) {
  //   //   errors.district = "Quận/Huyện là bắt buộc!";
  //   // }
  //   // if (!selectedWard) {
  //   //   errors.ward = "Phường/Xã là bắt buộc!";
  //   // }

  //   return errors;
  // };

  return (
    <div className="max-w-screen-xl flex mx-auto gap-5">
      {/* Phần thông tin đặt hàng */}
      <div className="w-2/3 mt-5 bg-white p-4 rounded-lg">
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

      {/* Phần đơn hàng */}
      <div className="w-1/3 bg-white p-4 rounded-xl shadow-lg self-start mt-2">
        <h1 className="text-2xl font-bold">Đơn hàng:</h1>
        {cartData?.cart?.data?.products?.map((item) => (
          <div className="flex gap-3">
            <img
              src={item.productId.image}
              alt=""
              className="h-[60px] w-[80px] object-cover"
            />
            <div>
              <p className="font-bold">{item.productId.name}</p>
              <div className="flex">
                <p>Size: {item.size}</p>
                <p className="mx-2">|</p>
                <p>SL: {item.quantity}</p>
              </div>
              <p>Giá: {formatter(item.price)}</p>
            </div>
          </div>
        ))}
        <hr />
        <h1 className="text-xl font-bold mt-2">
          Tổng cộng: {formatter(totalAmount)}
        </h1>
        <button
          className="px-4 py-2 w-full bg-black text-white rounded-2xl text-2xl font-bold mt-5"
          onClick={handlePayment}
        >
          Đặt hàng
        </button>
      </div>
      <ToastNotification />
    </div>
  );
};

export default memo(CheckoutPage);
