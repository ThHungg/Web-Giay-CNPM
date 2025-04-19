import { memo, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Switch } from "antd";
import { toast } from "react-toastify";
import { FaTrash } from "react-icons/fa";
import * as brandService from "../../../services/brandService";
import ToastNotification from "../../../component/toastNotification";

const AdminBrand = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formData, setFormData] = useState({ brand: "", image: "" });
  const [deleteBrandId, setDeleteBrandId] = useState(null);

  const { data: brands = [], refetch } = useQuery({
    queryKey: ["brand"],
    queryFn: async () => {
      const res = await brandService.getAllBrand();
      return res.data;
    },
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleCancel = () => {
    setShowCreateModal(false);
    setFormData({ brand: "", image: "" });
  };

  const onFinish = async () => {
    try {
      await brandService.createBrand(formData);
      toast.success("Tạo thương hiệu thành công");
      setShowCreateModal(false);
      setFormData({ brand: "", image: "" });
      refetch();
    } catch (err) {
      toast.error("Tạo thương hiệu thất bại");
    }
  };

  const handleToggleStatus = async (id, newStatus) => {
    try {
      await brandService.updateStatusBrand(id, newStatus);
      toast.success(
        `Đã cập nhật: ${newStatus === "active" ? "Hiển thị" : "Ẩn"}`
      );
      refetch();
    } catch (err) {
      toast.error("Cập nhật trạng thái thất bại");
    }
  };

  const openDeleteModal = (id) => setDeleteBrandId(id);
  const closeDeleteModal = () => setDeleteBrandId(null);

  const confirmDelete = async () => {
    try {
      await brandService.deleteBrand(deleteBrandId);
      toast.success("Xóa thương hiệu thành công");
      closeDeleteModal();
      refetch();
    } catch (err) {
      toast.error("Xóa thương hiệu thất bại");
    }
  };

  const CreateModal = useMemo(
    () =>
      showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 w-[500px] max-w-md rounded-xl shadow-lg">
            <h1 className="text-xl font-bold text-center mb-4">
              Tạo mới Thương hiệu
            </h1>

            <div className="mb-4">
              <label className="text-sm font-medium">Tên thương hiệu:</label>
              <input
                type="text"
                name="brand"
                placeholder="Nhập tên thương hiệu"
                value={formData.brand}
                onChange={handleChange}
                className="w-full p-2 border rounded mt-1"
              />
            </div>

            <div className="mb-4">
              <label className="text-sm font-medium">URL hình ảnh:</label>
              <input
                type="text"
                name="image"
                placeholder="Nhập link ảnh thương hiệu"
                value={formData.image}
                onChange={handleChange}
                className="w-full p-2 border rounded mt-1"
              />
            </div>

            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 bg-white border font-bold rounded-lg"
                onClick={handleCancel}
              >
                Hủy
              </button>
              <button
                className="px-4 py-2 bg-black text-white font-bold rounded-lg"
                onClick={onFinish}
              >
                Tạo
              </button>
            </div>
          </div>
        </div>
      ),
    [showCreateModal, formData]
  );

  const DeleteModal = useMemo(
    () =>
      deleteBrandId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 w-[400px] max-w-sm rounded-xl shadow-lg text-center">
            <h1 className="text-lg font-bold mb-4 text-red-600">
              Xác nhận xóa thương hiệu
            </h1>
            <p className="text-sm text-gray-600 mb-6">
              Bạn có chắc chắn muốn xóa thương hiệu này?
            </p>
            <div className="flex justify-center gap-4">
              <button
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg font-semibold"
                onClick={closeDeleteModal}
              >
                Hủy
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded-lg font-semibold"
                onClick={confirmDelete}
              >
                Xóa
              </button>
            </div>
          </div>
        </div>
      ),
    [deleteBrandId]
  );

  return (
    <>
      <div className="flex justify-end items-center mt-3">
        <button
          className="px-4 py-2 bg-black text-white rounded-lg"
          onClick={() => setShowCreateModal(true)}
        >
          Tạo mới
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
        {brands.map((brand, index) => (
          <div
            key={index}
            className="border rounded-lg overflow-hidden shadow hover:shadow-md transition duration-300 relative"
          >
            <img
              src={brand.image}
              alt={`brand-${index}`}
              className="w-full h-[180px] object-contain"
            />
            <div className="p-3">
              <h3 className="text-lg font-semibold mb-2">{brand.brand}</h3>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-700">Trạng thái:</span>
                <Switch
                  checked={brand.status === "active"}
                  checkedChildren="Hiển thị"
                  unCheckedChildren="Ẩn"
                  onChange={(checked) =>
                    handleToggleStatus(
                      brand._id,
                      checked ? "active" : "inactive"
                    )
                  }
                />
              </div>
            </div>

            <button
              className="absolute top-3 right-3 p-2 bg-red-600 hover:bg-red-700 text-white rounded-full transition"
              title="Xóa thương hiệu"
              onClick={() => openDeleteModal(brand._id)}
            >
              <FaTrash size={14} />
            </button>
          </div>
        ))}
      </div>

      <ToastNotification />
      {CreateModal}
      {DeleteModal}
    </>
  );
};

export default memo(AdminBrand);
