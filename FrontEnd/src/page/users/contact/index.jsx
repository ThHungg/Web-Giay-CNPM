import { memo, useState, useEffect } from "react";
import * as supportService from "../../../services/supportService"; // Import supportService
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";
import ToastNotification from "../../../component/toastNotification";

const Contact = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [requestHistory, setRequestHistory] = useState([]); // Lịch sử yêu cầu
  const token = localStorage.getItem("access_token");
  let userId;

  // Lấy userId từ token
  if (token) {
    const decoded = jwtDecode(token);
    userId = decoded.id;
  }

  // Hàm gọi API lấy lịch sử yêu cầu hỗ trợ
  const fetchHistorySupport = async () => {
    try {
      const response = await supportService.getHistorySupport(userId);
      setRequestHistory(response.data || []); // Cập nhật lịch sử yêu cầu
    } catch (error) {
      toast.error("Lỗi khi tải dữ liệu lịch sử yêu cầu.");
    }
  };

  useEffect(() => {
    if (userId) {
      fetchHistorySupport();
    }
  }, [userId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email || !phone || !message) {
      toast.error("Vui lòng điền đầy đủ thông tin!");
      return;
    }

    const requestData = {
      name,
      email,
      phone,
      message,
      userId,
    };

    try {
      const response = await supportService.createSupport(requestData);
      if (response.status === "OK") {
        toast.success("Yêu cầu hỗ trợ đã được gửi thành công!");
        setName("");
        setEmail("");
        setPhone("");
        setMessage("");
        fetchHistorySupport(); // Cập nhật lại lịch sử yêu cầu
      } else {
        toast.error("Lỗi gửi yêu cầu hỗ trợ. Vui lòng thử lại.");
      }
    } catch (error) {
      toast.error("Đã có lỗi xảy ra. Vui lòng thử lại.");
    }
  };

  // Hàm xóa yêu cầu hỗ trợ
  const handleDeleteSupport = async (id) => {
    try {
      const response = await supportService.deleteSupport(id);
      if (response.status === "OK") {
        toast.success("Yêu cầu đã được xóa.");
        fetchHistorySupport(); // Cập nhật lại lịch sử yêu cầu
      } else {
        toast.error("Lỗi khi xóa yêu cầu.");
      }
    } catch (error) {
      toast.error("Lỗi khi xóa yêu cầu.");
    }
  };

  const convertStatusToVietnamese = (status) => {
    switch (status) {
      case "Pending":
        return "Đang chờ";
      case "Resolved":
        return "Đã giải quyết";
      default:
        return status;
    }
  };

  return (
    <div className="max-w-screen-xl mx-auto bg-white p-6 rounded-lg shadow-lg mt-5">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-semibold text-gray-800">Liên hệ hỗ trợ</h1>
        <p className="text-lg text-gray-600">
          Để được hỗ trợ, vui lòng nhập thông tin bên dưới và ấn Gửi. Chúng tôi
          sẽ trả lời bạn qua mail trong vòng 24h.
        </p>
      </div>

      {/* Contact Form */}
      <div className="space-y-6">
        {/* Tên */}
        <div className="flex flex-col">
          <label className="text-xl text-gray-700 mb-2">
            Tên: <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="p-3 border shadow-sm border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            placeholder="Nhập tên"
          />
        </div>

        {/* Email */}
        <div className="flex flex-col">
          <label className="text-xl text-gray-700 mb-2">
            Email: <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="p-3 border shadow-sm border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            placeholder="Nhập email"
          />
        </div>

        {/* Số điện thoại */}
        <div className="flex flex-col">
          <label className="text-xl text-gray-700 mb-2">
            Số điện thoại: <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="p-3 border shadow-sm border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            placeholder="Nhập số điện thoại"
          />
        </div>

        {/* Nội dung */}
        <div className="flex flex-col">
          <label className="text-xl text-gray-700 mb-2">
            Nội dung: <span className="text-red-500">*</span>
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="p-3 border shadow-sm border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            placeholder="Nhập nội dung (Yêu cầu viết rõ vấn đề gặp phải)"
            rows="4"
          />
        </div>

        {/* Button */}
        <div className="text-center">
          <button
            onClick={handleSubmit}
            className="px-6 py-3 bg-black text-white font-bold text-lg rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black"
          >
            Gửi
          </button>
        </div>
      </div>

      {/* Lịch sử yêu cầu hỗ trợ */}
      <div className="mt-12">
        <h2 className="text-2xl font-semibold text-gray-800">
          Lịch sử yêu cầu hỗ trợ
        </h2>

        {requestHistory.length > 0 ? (
          <div className="mt-4 max-h-[300px] overflow-y-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100 text-left text-gray-700">
                  <th className="border p-3 text-sm text-center">STT</th>
                  <th className="border p-3 text-sm text-center">Ngày gửi</th>
                  <th className="border p-3 text-sm text-center">Nội dung</th>
                  <th className="border p-3 text-sm text-center">Trạng thái</th>
                  <th className="border p-3 text-sm text-center">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-300">
                {requestHistory.map((item, index) => (
                  <tr key={index}>
                    <td className="border p-3 text-center">{index + 1}</td>
                    <td className="border p-3 text-center">
                      {new Date(item.createdAt).toLocaleString()}
                    </td>
                    <td className="border p-3">{item.message}</td>
                    <td className="border p-3 text-center">
                      {convertStatusToVietnamese(item.status)}
                    </td>
                    <td className="border p-3 text-center">
                      <button
                        className="text-red-500"
                        onClick={() => handleDeleteSupport(item._id)}
                      >
                        Xóa
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center text-gray-500 mt-4">
            Bạn chưa có yêu cầu hỗ trợ nào.
          </p>
        )}
      </div>
      <ToastNotification />
    </div>
  );
};

export default Contact;
