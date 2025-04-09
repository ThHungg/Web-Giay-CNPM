import { memo, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import * as voucherService from "../../../services/voucherService";
import { useQuery } from "@tanstack/react-query";
import formatter from "../../../utils/formatter";
import { useMutationHooks } from "../../../hooks/useMutation";
import { toast } from "react-toastify";
import ToastNotification from "../../../component/toastNotification";
import { FaSpinner } from "react-icons/fa";

const AdminVoucher = () => {
  const user = useSelector((state) => state?.user);
  const [showCreateModal, setShowCreateModel] = useState(false);
  const brands = ["Adidas", "Nike", "Vans", "Air Jordan", "MLB", "Converse"];
  const [formData, setFormData] = useState({
    code: "",
    discount: "",
    discountType: "percent",
    type: "total_order",
    brand: "",
    startDate: "",
    expiryDate: "",
    minOrder: "",
    maxDiscount: "",
    totalQuantity: "",
    description: "",
  });

  const getAllVoucher = async () => {
    const res = await voucherService.getAllVoucher(user?.access_token);
    return res.data;
  };

  const {
    data: vouchers,
    refetch,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["voucher"],
    queryFn: getAllVoucher,
    enabled: !!user?.access_token,
  });

  const handleUpdateStatus = async (id, newStatus) => {
    const token = user?.access_token;
    const res = await voucherService.updateVoucherStatus(id, newStatus, token);
    console.log(res);
    if (res?.status === "OK") {
      toast.success(res.message || "Cập nhật trạng thái thành công");
      refetch();
    } else {
      toast.error(res.message || "Cập nhật trạng thái thất bại");
    }
  };

  const mutation = useMutationHooks(async (data) => {
    const {
      code,
      discount,
      discountType,
      type,
      brand,
      startDate,
      expiryDate,
      maxDiscount,
      minOrder,
      totalQuantity,
      description,
    } = data;

    if (!code.trim()) return toast.error("Vui lòng nhập mã voucher");
    // if (!discount || isNaN(discount) || discount <= 0 || discount > 100)
    //   return toast.error("Giá trị giảm giá không hợp lệ");
    if (type === "brand" && !brand)
      return toast.error("Vui lòng chọn thương hiệu");
    if (!startDate) return toast.error("Vui lòng chọn ngày bắt đầu");
    if (!expiryDate) return toast.error("Vui lòng chọn ngày hết hạn");
    const start = new Date(startDate);
    const end = new Date(expiryDate);
    if (start >= end) return toast.error("Ngày hết hạn phải sau ngày bắt đầu");
    if (!totalQuantity || isNaN(totalQuantity) || totalQuantity <= 0)
      return toast.error("Số lượng voucher phải lớn hơn 0");
    toast.success("Tạo voucher thành công");
    setFormData({
      code: "",
      discount: "",
      discountType: "percent",
      type: "total_order",
      brand: "",
      startDate: "",
      expiryDate: "",
      maxDiscount: "",
      minOrder: "",
      totalQuantity: "",
      description: "",
    });

    const res = await voucherService.createVoucher(data);
    refetch();
    setShowCreateModel(false);
  });

  const onFinish = (e) => {
    e.preventDefault();
    mutation.mutate(formData);
    refetch();
  };

  const statusMapping = {
    active: "Đang hoạt động",
    inactive: "Ngưng hoạt động",
    expired: "Hết hạn",
  };

  const typeMapping = {
    total_order: "Tổng đơn",
    brand: "Theo thương hiệu",
  };

  const handleCancel = () => {
    setShowCreateModel(false);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  console.log(formData);

  const CreateModal = useMemo(
    () => (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white p-6 w-[700px] max-w-3xl rounded-xl shadow-lg">
          <h1 className="text-xl font-bold text-center mb-4">
            Tạo mới Voucher
          </h1>

          <div className="grid grid-cols-2 gap-4">
            {/* Cột trái */}
            <div className="flex flex-col gap-3">
              <div>
                <label className="text-sm font-medium">Mã voucher:</label>
                <input
                  type="text"
                  name="code"
                  placeholder="Nhập mã code"
                  value={formData.code}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Giảm giá:</label>
                <div className="flex gap-2 mt-1">
                  <input
                    type="number"
                    name="discount"
                    placeholder="Nhập số"
                    value={formData.discount}
                    onChange={handleChange}
                    className="w-2/3 p-2 border rounded"
                  />
                  <select
                    name="discountType"
                    value={formData.discountType}
                    onChange={handleChange}
                    className="w-1/3 p-2 border rounded"
                  >
                    <option value="percent">%</option>
                    <option value="fixed">đ</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Loại áp dụng:</label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                >
                  <option value="total_order">Toàn bộ đơn hàng</option>
                  <option value="brand">Theo thương hiệu</option>
                </select>
              </div>

              {formData.type === "brand" && (
                <div>
                  <label htmlFor="brand" className="text-sm font-medium">
                    Tên thương hiệu:
                  </label>
                  <select
                    id="brand"
                    name="brand"
                    className="border w-full p-2 rounded-lg mt-1"
                    value={formData.brand || ""}
                    onChange={handleChange}
                  >
                    <option value="">Chọn thương hiệu</option>
                    {brands.length > 0 ? (
                      brands.map((item, index) => (
                        <option key={index} value={item}>
                          {item}
                        </option>
                      ))
                    ) : (
                      <option disabled>Không có thương hiệu</option>
                    )}
                  </select>
                </div>
              )}
            </div>

            {/* Cột phải */}
            <div className="flex flex-col gap-3">
              <div className="flex gap-3">
                <div>
                  <label className="text-sm font-medium">Ngày bắt đầu:</label>
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Ngày hết hạn:</label>
                  <input
                    type="date"
                    name="expiryDate"
                    value={formData.expiryDate}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">
                  Giá trị đơn hàng tối thiểu:
                </label>
                <input
                  type="number"
                  name="minOrder"
                  placeholder="Giá trị tối thiếu"
                  value={formData.minOrder}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                />
              </div>

              {formData.discountType === "percent" && (
                <div>
                  <label className="text-sm font-medium">
                    Giá trị giảm tối đa:
                  </label>
                  <input
                    type="number"
                    name="maxDiscount"
                    placeholder="Giá trị tối đa"
                    value={formData.maxDiscount}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                  />
                </div>
              )}

              <div>
                <label className="text-sm font-medium">Số lượng:</label>
                <input
                  type="number"
                  name="totalQuantity"
                  placeholder="Nhập số lượng"
                  value={formData.totalQuantity}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                />
              </div>
            </div>
          </div>

          {/* Mô tả */}
          <div className="mt-4">
            <label className="text-sm font-medium">Mô tả:</label>
            <textarea
              name="description"
              placeholder="Mô tả ngắn gọn về voucher"
              value={formData.description}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>

          {/* Nút hành động */}
          <div className="flex justify-end gap-2 mt-4">
            <button
              className="px-4 py-2 bg-white border font-bold w-1/4 rounded-lg"
              onClick={handleCancel}
            >
              Hủy
            </button>
            <button
              className="px-4 py-2 bg-black text-white font-bold w-1/4 rounded-lg"
              onClick={onFinish}
            >
              Tạo
            </button>
          </div>
        </div>
      </div>
    ),
    [formData, handleCancel, onFinish]
  );

  if (!Array.isArray(vouchers)) {
    return (
      <div className="flex justify-center items-center mt-10">
        <FaSpinner className="w-6 h-6 text-gray-500 animate-spin" />
      </div>
    );
  }

  return (
    <>
      <div className="flex justify-between items-center mt-3">
        <div className="flex gap-3 mt-5">
          {/* (Có thể đổi thành filter theo loại hoặc trạng thái nếu cần) */}
          <div className="w-[200px]">
            <select className="border w-full p-2 rounded-lg">
              <option value="">Lọc theo trạng thái</option>
              <option value="active">Đang hoạt động</option>
              <option value="inactive">Không hoạt động</option>
              <option value="expired">Hết hạn</option>
            </select>
          </div>
        </div>

        {/* Search + Create */}
        <div className="flex gap-5">
          <div className="px-2 py-2 bg-white w-[400px] shadow-sm rounded-lg flex items-center">
            <input
              type="search"
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
              placeholder="Tìm kiếm mã voucher"
            />
          </div>
          <button
            className="px-4 py-2 bg-black text-white rounded-lg text-xl"
            onClick={() => setShowCreateModel(true)}
          >
            Create
          </button>
        </div>
      </div>

      <div className="bg-white mt-5 mr-2">
        <table className="w-full border-collapse">
          <thead className="bg-gray-200">
            <tr>
              <th className="border p-2">Code</th>
              <th className="border p-2">Discount</th>
              {/* <th className="border p-2">Thông tin</th> */}
              <th className="border p-2">Ngày bắt đầu / Hết hạn</th>
              <th className="border p-2">Loại</th>
              <th className="border p-2">Min / Max</th>
              <th className="border p-2">Trạng thái</th>
              <th className="border p-2">Hành động</th>
            </tr>
          </thead>
          <tbody className="text-center bg-white">
            {vouchers?.map((voucher) => (
              <tr key={voucher._id}>
                <td className="border p-2">{voucher.code}</td>
                {/* <td className="border p-2">
                  {voucher.discountType === "fixed"
                    ? formatter(voucher.discount)
                    : `${voucher.discount}%`}
                </td> */}
                <td className="border p-2">{voucher.description}</td>
                <td className="border p-2">
                  {new Date(voucher.startDate).toLocaleDateString()} -{" "}
                  {new Date(voucher.expiryDate).toLocaleDateString()}
                </td>
                <td className="border p-2">
                  {typeMapping[voucher.type] || voucher.type}
                  {voucher.type === "brand" && voucher.brand
                    ? ` (${voucher.brand})`
                    : ""}
                </td>

                <td className="border p-2">
                  {formatter(voucher.minOrder)} /{" "}
                  {formatter(voucher.maxDiscount)}
                </td>
                <td className="border p-2">
                  <select
                    className="border px-2 py-1 rounded"
                    value={voucher.status}
                    onChange={(e) =>
                      handleUpdateStatus(voucher._id, e.target.value)
                    }
                  >
                    <option value="active">Đang hoạt động</option>
                    <option value="inactive">Ngưng hoạt động</option>
                    <option value="expired">Hết hạn</option>
                  </select>
                </td>
                <td className="border p-2">
                  <button className="px-2 py-1 bg-red-500 text-white rounded">
                    Sửa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showCreateModal && CreateModal}
      <ToastNotification />
    </>
  );
};

export default memo(AdminVoucher);
