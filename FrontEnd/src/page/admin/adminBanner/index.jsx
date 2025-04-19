import { memo, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Switch } from "antd";
import { toast } from "react-toastify";
import { FaTrash } from "react-icons/fa";
import * as bannerService from "../../../services/bannerService";
import ToastNotification from "../../../component/toastNotification";

const AdminBanner = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formData, setFormData] = useState({ image: "" });
  const [deleteBannerId, setDeleteBannerId] = useState(null); // dùng cho modal xác nhận xóa

  const {
    data: banners = [],
    refetch,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["banner"],
    queryFn: async () => {
      const res = await bannerService.getAllBanner();
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
    setFormData({ image: "" });
  };

  const onFinish = async () => {
    try {
      await bannerService.createBanner(formData);
      toast.success("Tạo banner thành công");
      setShowCreateModal(false);
      setFormData({ image: "" });
      refetch();
    } catch (err) {
      console.error("Lỗi tạo banner:", err);
      toast.error("Tạo banner thất bại");
    }
  };

  const handleToggleStatus = async (id, newStatus) => {
    try {
      await bannerService.updateStatusBanner(id, newStatus);
      toast.success(
        `Đã cập nhật trạng thái: ${newStatus === "active" ? "Hiển thị" : "Ẩn"}`
      );
      refetch();
    } catch (err) {
      console.error("Lỗi cập nhật trạng thái:", err);
      toast.error("Cập nhật trạng thái thất bại");
    }
  };

  const openDeleteModal = (id) => setDeleteBannerId(id);
  const closeDeleteModal = () => setDeleteBannerId(null);

  const confirmDelete = async () => {
    try {
      await bannerService.deleteBanner(deleteBannerId);
      toast.success("Xóa banner thành công");
      closeDeleteModal();
      refetch();
    } catch (err) {
      console.error("Lỗi khi xóa banner:", err);
      toast.error("Xóa banner thất bại");
    }
  };

  const CreateModal = useMemo(
    () =>
      showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 w-[500px] max-w-md rounded-xl shadow-lg">
            <h1 className="text-xl font-bold text-center mb-4">
              Tạo mới Banner
            </h1>

            <div className="mb-4">
              <label className="text-sm font-medium">URL hình ảnh:</label>
              <input
                type="text"
                name="image"
                placeholder="Nhập đường dẫn ảnh"
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
                className="px-4 py-2 bg-black text-white rounded-lg text-xl"
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
      deleteBannerId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 w-[400px] max-w-sm rounded-xl shadow-lg text-center">
            <h1 className="text-xl font-bold text-center mb-4">
              Xác nhận xóa banner
            </h1>
            <p className="text-sm text-gray-600 mb-6">
              Bạn có chắc chắn muốn xóa banner này?
            </p>
            <div className="flex justify-center gap-4">
              <button
                className="px-4 py-2 bg-white border font-bold rounded-lg"
                onClick={closeDeleteModal}
              >
                Hủy
              </button>
              <button
                className="px-4 py-2 bg-black text-white rounded-lg font-semibold"
                onClick={confirmDelete}
              >
                Xóa
              </button>
            </div>
          </div>
        </div>
      ),
    [deleteBannerId]
  );

  return (
    <>
      <div className="flex justify-end items-center mt-3">
        <button
          className="px-4 py-2 bg-black text-white rounded-lg text-xl"
          onClick={() => setShowCreateModal(true)}
        >
          Create
        </button>
      </div>

      {/* Danh sách banner */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
        {banners.map((banner, index) => (
          <div
            key={index}
            className="border rounded-lg overflow-hidden shadow hover:shadow-md transition duration-300 relative"
          >
            <img
              src={banner.image}
              alt={`banner-${index}`}
              className="w-full h-[200px] object-cover"
            />
            <div className="flex items-center justify-between p-3">
              <span className="text-sm font-medium text-gray-700">
                Trạng thái:
              </span>
              <Switch
                checked={banner.status === "active"}
                checkedChildren="Hiển thị"
                unCheckedChildren="Ẩn"
                onChange={(checked) =>
                  handleToggleStatus(
                    banner._id,
                    checked ? "active" : "inactive"
                  )
                }
              />
            </div>

            {/* Nút xóa */}
            <button
              className="absolute top-3 right-3 p-2 bg-red-600 hover:bg-red-700 text-white rounded-full transition"
              title="Xóa banner"
              onClick={() => openDeleteModal(banner._id)}
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

export default memo(AdminBanner);
