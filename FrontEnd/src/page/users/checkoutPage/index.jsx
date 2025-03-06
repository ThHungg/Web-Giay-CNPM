import { memo } from "react";
import formatter from "../../../utils/formatter";
import { useState, useEffect } from "react";
import axios from "axios";

const CheckoutPage = () => {
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");

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
    setSelectedProvince(provinceCode);
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
    setSelectedDistrict(districtCode);

    axios
      .get(`https://provinces.open-api.vn/api/d/${districtCode}?depth=2`)
      .then((res) => {
        setWards(res.data.wards);
      });
  };

  return (
    <div className="max-w-screen-xl flex mx-auto gap-5">
      {/* Phần thông tin đặt hàng */}
      <div className="w-2/3 mt-5">
        <h1 className="text-3xl font-bold">Thông tin đặt hàng:</h1>

        <div className="flex flex-col">
          <label className="text-xl m-1">
            Họ và tên: <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            className="pl-2 py-1 border shadow border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Nhập họ và tên"
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
            rows={5}
            placeholder="Nhập ghi chú"
            className="resize-y max-h-40 pl-2 py-1 border shadow border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          ></textarea>
        </div>
      </div>

      {/* Phần đơn hàng */}
      <div className="w-1/3 bg-white p-4 rounded-xl shadow-lg self-start mt-2">
        <h1 className="text-2xl font-bold">Đơn hàng:</h1>
        <ul className="space-y-4 mt-3">
          <li className="flex justify-between text-xl">
            <span>Sản phẩm 1: </span>
            <b>{formatter(1230000)} (1)</b>
          </li>
          <li className="flex justify-between text-xl">
            <span>Sản phẩm 2: </span>
            <b>{formatter(1230000)} (3)</b>
          </li>
          <li className="flex justify-between text-xl">
            <span>Sản phẩm 3: </span>
            <b>{formatter(1230000)} (1)</b>
          </li>
          <li className="flex justify-between text-xl">
            <span>Sản phẩm 4: </span>
            <b>{formatter(1230000)} (1)</b>
          </li>
          <li className="flex justify-between text-xl">
            <span>Sản phẩm 4: </span>
            <b>{formatter(1230000)} (1)</b>
          </li>
          <li className="flex justify-between text-xl">
            <span>Sản phẩm 4: </span>
            <b>{formatter(1230000)} (1)</b>
          </li>
          <li className="border-t pt-2"></li>
          <li className="flex justify-between text-xl font-bold">
            <span>Voucher: </span>
            <b>{formatter(4000000)}</b>
          </li>
          <li className="flex justify-between text-xl font-bold">
            <span>Tổng đơn hàng: </span>
            <b>{formatter(4000000)}</b>
            <b></b>
          </li>
        </ul>
        <button className="px-4 py-2 w-full bg-red-500 text-white rounded-2xl text-2xl font-bold mt-5">
          Đặt hàng
        </button>
      </div>
    </div>
  );
};

export default memo(CheckoutPage);
