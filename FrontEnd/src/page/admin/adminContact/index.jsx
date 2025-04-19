import { memo, useState, useEffect } from "react";
import * as supportService from "../../../services/supportService";
import { toast } from "react-toastify";
import ToastNotification from "../../../component/toastNotification";

const AdminContact = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const fetchSupportRequests = async () => {
    setLoading(true);
    try {
      const response = await supportService.getAllSupport();
      setRequests(response.data || []);
    } catch (error) {
      toast.error("Lỗi khi tải dữ liệu yêu cầu hỗ trợ.");
    } finally {
      setLoading(false);
    }
  };

  const filteredRequests = requests
    .filter((request) =>
      request.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((request) =>
      selectedStatus ? request.status === selectedStatus : true
    );

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

  useEffect(() => {
    fetchSupportRequests();
  }, []);

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
              <th className="border p-2">Hành động</th>
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
                    <button
                      className="px-2 py-1 bg-red-500 text-white rounded"
                      onClick={() => handleDeleteSupport(request._id)}
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="7"
                  className="border p-2 text-center text-gray-500"
                >
                  Không có yêu cầu hỗ trợ nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <ToastNotification />
    </>
  );
};

export default memo(AdminContact);
