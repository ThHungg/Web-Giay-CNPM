import { memo, useState, useEffect, useMemo } from "react";
import * as supportService from "../../../services/supportService"; // Import supportService
import { toast } from "react-toastify";
import ToastNotification from "../../../component/toastNotification";

const AdminContact = () => {
  const [requests, setRequests] = useState([]); // Danh sách yêu cầu hỗ trợ
  const [loading, setLoading] = useState(false); // Trạng thái loading
  const [selectedStatus, setSelectedStatus] = useState(""); // Trạng thái lọc
  const [searchTerm, setSearchTerm] = useState(""); // Tìm kiếm theo tên
  const [responseMessage, setResponseMessage] = useState(""); // Phản hồi
  const [selectedRequestId, setSelectedRequestId] = useState(""); // ID yêu cầu được chọn
  const [showModal, setShowModal] = useState(false); // Điều khiển việc hiển thị modal

  // Hàm lấy tất cả yêu cầu hỗ trợ
  const fetchSupportRequests = async () => {
    setLoading(true);
    try {
      const response = await supportService.getAllSupport();
      setRequests(response.data || []); // Cập nhật danh sách yêu cầu hỗ trợ
    } catch (error) {
      toast.error("Lỗi khi tải dữ liệu yêu cầu hỗ trợ.");
    } finally {
      setLoading(false);
    }
  };

  // Lọc yêu cầu theo trạng thái và tìm kiếm
  const filteredRequests = requests
    .filter((request) =>
      request.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((request) =>
      selectedStatus ? request.status === selectedStatus : true
    );

  // Cập nhật trạng thái yêu cầu
  const handleStatusChange = async (id, newStatus) => {
    try {
      const response = await supportService.updateRequestSupport(id, newStatus);
      if (response.status === "OK") {
        toast.success("Cập nhật trạng thái yêu cầu thành công.");
        fetchSupportRequests();
      }
    } catch (error) {
      toast.error("Lỗi khi cập nhật trạng thái.");
    }
  };

  // Xóa yêu cầu hỗ trợ
  const handleDeleteSupport = async (id) => {
    try {
      const response = await supportService.deleteSupport(id);
      if (response.status === "OK") {
        toast.success("Yêu cầu đã được xóa.");
        fetchSupportRequests();
      }
    } catch (error) {
      toast.error("Lỗi khi xóa yêu cầu.");
    }
  };

  // Gửi phản hồi
  const handleSendResponse = async () => {
    if (!responseMessage.trim()) {
      toast.error("Vui lòng nhập phản hồi.");
      return;
    }

    try {
      const response = await supportService.sendResponseEmail(
        selectedRequestId,
        responseMessage
      );
      if (response.status === "OK") {
        toast.success("Phản hồi đã được gửi thành công.");
        setResponseMessage("");
        setShowModal(false); // Đóng modal sau khi gửi phản hồi
        fetchSupportRequests();
      } else {
        toast.error("Lỗi khi gửi phản hồi.");
      }
    } catch (error) {
      toast.error("Đã có lỗi xảy ra khi gửi phản hồi.");
    }
  };

  useEffect(() => {
    fetchSupportRequests(); // Lấy yêu cầu hỗ trợ khi component mount
  }, []);

  // Modal nhập phản hồi
  const CreateModal = useMemo(
    () => (
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center ${
          !showModal && "hidden"
        }`}
      >
        <div className="bg-white p-6 rounded-lg w-[400px]">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Phản hồi yêu cầu
          </h2>
          <textarea
            className="p-3 border shadow-sm border-gray-300 rounded-lg w-full"
            placeholder="Nhập phản hồi"
            value={responseMessage}
            onChange={(e) => setResponseMessage(e.target.value)}
            rows="4"
          />
          <div className="mt-4 flex justify-end gap-3">
            <button
              onClick={() => setShowModal(false)}
              className="px-4 py-2 bg-gray-300 text-white rounded-lg"
            >
              Đóng
            </button>
            <button
              onClick={handleSendResponse}
              className="px-4 py-2 bg-black text-white rounded-lg"
            >
              Gửi phản hồi
            </button>
          </div>
        </div>
      </div>
    ),
    [responseMessage, showModal, selectedRequestId]
  );

  return (
    <>
      <div className="flex justify-between items-center mt-3">
        <div className="flex gap-3 mt-5">
          <div className="w-[200px]">
            <select
              className="border w-full p-2 rounded-lg"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="">Lọc theo trạng thái</option>
              <option value="Pending">Đang chờ</option>
              <option value="Resolved">Đã giải quyết</option>
            </select>
          </div>
        </div>

        <div className="flex gap-5">
          <div className="px-2 py-2 bg-white w-[400px] shadow-sm rounded-lg flex items-center">
            <input
              type="search"
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
              placeholder="Tìm kiếm theo tên"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="bg-white mt-5 mr-2">
        <table className="w-full border-collapse">
          <thead className="bg-gray-200">
            <tr>
              <th className="border p-2">STT</th>
              <th className="border p-2">Tên</th>
              <th className="border p-2">Email</th>
              <th className="border p-2">Số điện thoại</th>
              <th className="border p-2">Nội dung</th>
              <th className="border p-2">Trạng thái</th>
              <th className="border p-2">Phản hồi</th>
            </tr>
          </thead>
          <tbody className="text-center bg-white">
            {filteredRequests.length > 0 ? (
              filteredRequests.map((request, index) => (
                <tr key={request._id}>
                  <td className="border p-2">{index + 1}</td>
                  <td className="border p-2">{request.name}</td>
                  <td className="border p-2">{request.email}</td>
                  <td className="border p-2">{request.phone}</td>
                  <td className="border p-2">{request.message}</td>
                  <td className="border p-2">
                    <select
                      className="border px-2 py-1 rounded"
                      value={request.status}
                      onChange={(e) =>
                        handleStatusChange(request._id, e.target.value)
                      }
                    >
                      <option value="Pending">Đang chờ</option>
                      <option value="Resolved">Đã giải quyết</option>
                    </select>
                  </td>
                  <td className="border p-2">
                    <div className="flex justify-center items-center gap-3">
                      {request.status !== "Resolved" ? (
                        <button
                          className="px-3 py-1 bg-red-500 text-white rounded transition"
                          onClick={() => {
                            setSelectedRequestId(request._id);
                            setShowModal(true);
                          }}
                        >
                          Phản hồi
                        </button>
                      ) : (
                        <button
                          className="px-3 py-1 bg-gray-500 text-white rounded transition cursor-not-allowed"
                          disabled
                        >
                          Đã giải quyết
                        </button>
                      )}

                      <button
                        className="px-3 py-1 bg-black text-white rounded transition"
                        onClick={() => handleDeleteSupport(request._id)}
                      >
                        Xóa
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="8"
                  className="border p-2 text-center text-gray-500"
                >
                  Không có yêu cầu hỗ trợ nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {CreateModal}
      <ToastNotification />
    </>
  );
};

export default memo(AdminContact);
