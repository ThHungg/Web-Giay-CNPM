import { memo, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as userService from "../../../services/userServices";
import * as orderServices from "../../../services/orderService";
import { useMutationHooks } from "../../../hooks/useMutation";
import { jwtDecode } from "jwt-decode";
import { updateUser } from "../../../redux/slides/userSlide";
import ToastNotification from "../../../component/toastNotification";
import formatter from "../../../utils/formatter";
import { toast } from "react-toastify";

const ProfilePage = () => {
  const user = useSelector((state) => state.user);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState("edit");
  const [orderDetails, setOrderDetails] = useState([]);
  const [status, setStatus] = useState(orderDetails);

  const handleCancelOrder = async (orderId) => {
    const orderToCancel = orderDetails.find((order) => order._id === orderId);
    if (!orderToCancel) {
      return;
    }
    if (
      orderToCancel.status === "Đang giao" ||
      orderToCancel.status === "Đã giao"
    ) {
      toast("Không hủy được");
      return;
    }
    const response = await orderServices.cancelOrder(orderId);
    if (response.status === "OK") {
      const updatedStatus = orderDetails.map((order) =>
        order._id === orderId ? { ...order, status: "Đã hủy" } : order
      );
      setOrderDetails(updatedStatus);
      toast("Hủy thành công");
    }
  };

  const token = localStorage.getItem("access_token");
  let userId;
  if (token) {
    const decoded = jwtDecode(token);
    userId = decoded.id;
  }

  const getUserIdFromToken = (user) => {
    const decoded = jwtDecode(user.access_token);
    return decoded?.id;
  };

  const mutation = useMutationHooks(async (data) => {
    const { id, ...rests } = data;
    const res = await userService.updateUser(id, rests);
    return res;
  });

  const { isSuccess } = mutation;

  useEffect(() => {
    setEmail(user?.email);
    setName(user?.name);
    setPhone(user?.phone);
  }, [user]);

  useEffect(() => {
    if (isSuccess) {
      const userId = getUserIdFromToken(user);
      handleGetDetailsUser(userId, user?.access_token);
    }
  }, [isSuccess]);

  const handleGetDetailsUser = async (id, token) => {
    const res = await userService.getDetailsUser(id, token);
    dispatch(updateUser({ ...res?.data, access_token: token, id }));
  };

  // Các hàm thay đổi giá trị input
  const handleOnchangeEmail = (e) => setEmail(e.target.value);
  const handleOnchangeName = (e) => setName(e.target.value);
  const handleOnchangePhone = (e) => setPhone(e.target.value);

  const handleUpdate = () => {
    const userId = getUserIdFromToken(user);
    mutation.mutate({ id: userId, email, name, phone });
  };

  const fetchGetHistoryOrder = async (userId) => {
    const res = await orderServices.getHistoryOrder(userId);
    setOrderDetails(res.data);
    return res;
  };

  useEffect(() => {
    if (userId) {
      fetchGetHistoryOrder(userId);
    }
  }, [userId]);

  console.log(orderDetails);
  if (!Array.isArray(orderDetails)) {
    return <div>Dữ liệu không hợp lệ</div>;
  }

  return (
    <>
      <ToastNotification />
      <div className="max-w-screen-xl mx-auto mt-5 flex gap-5">
        {/* Phần thông tin người dùng */}
        <div className="w-[200px] flex flex-col items-center bg-white p-5 rounded-lg shadow">
          <img
            src="https://www.pngmart.com/files/23/Profile-PNG-Photo.png"
            alt="User Avatar"
            className="w-[150px] h-[150px] object-cover rounded-full"
          />
          <div className="mt-4 text-center">
            <p className="text-lg font-semibold">Tên người dùng: {user.name}</p>
            <p>Số điện thoại: {user.phone}</p>
            <p>Email: {user.email}</p>
          </div>

          {/* Tabs Menu */}
          <div className="w-full mt-5">
            <button
              className={`w-full text-left px-4 py-2 rounded-lg ${
                activeTab === "edit" ? "bg-blue-500 text-white" : "bg-white"
              }`}
              onClick={() => setActiveTab("edit")}
            >
              Chỉnh sửa thông tin
            </button>
            <button
              className={`w-full text-left px-4 py-2 rounded-lg mt-2 ${
                activeTab === "history" ? "bg-blue-500 text-white" : "bg-white"
              }`}
              onClick={() => setActiveTab("history")}
            >
              Lịch sử đặt hàng
            </button>
            <button
              className={`w-full text-left px-4 py-2 rounded-lg mt-2 ${
                activeTab === "other" ? "bg-blue-500 text-white" : "bg-white"
              }`}
              onClick={() => setActiveTab("other")}
            >
              Thông tin khác
            </button>
          </div>
        </div>

        {/* Nội dung Tab */}
        <div className="flex-1 p-5 bg-white rounded-lg shadow">
          {activeTab === "edit" && (
            <div className="flex flex-col gap-4">
              <div>
                <label className="text-lg font-medium">Họ và tên:</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Nhập họ và tên"
                    onChange={handleOnchangeName}
                  />
                  <button
                    className="px-4 bg-black text-white rounded-lg"
                    onClick={handleUpdate}
                  >
                    Cập nhật
                  </button>
                </div>
              </div>

              <div>
                <label className="text-lg font-medium">Email:</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Nhập email"
                    value={email}
                    onChange={handleOnchangeEmail}
                  />
                  <button
                    className="px-4 bg-black text-white rounded-lg"
                    onClick={handleUpdate}
                  >
                    Cập nhật
                  </button>
                </div>
              </div>

              <div>
                <label className="text-lg font-medium">Số điện thoại:</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Nhập số điện thoại"
                    onChange={handleOnchangePhone}
                  />
                  <button
                    className="px-4 bg-black text-white rounded-lg"
                    onClick={handleUpdate}
                  >
                    Cập nhật
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "history" && (
            <div>
              <table className="w-full border-collapse">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="border p-2">STT</th>
                    <th className="border p-2">Sản phẩm</th>
                    <th className="border p-2">Ngày đặt</th>
                    <th className="border p-2">Trạng thái</th>
                    <th className="border p-2">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {orderDetails.map((order, index) => (
                    <tr key={order._id}>
                      <td className="border p-2 text-center">{index + 1}</td>
                      <td className="border p-2 text-center">
                        <div className="flex gap-3">
                          <img
                            src={order.items[0].productId.image}
                            alt="Product"
                            className="h-[90px] w-[100px] object-cover"
                          />
                          <div>
                            <h1>{order.items[0].productId.name}</h1>
                            <h1>
                              Size: {order.items[0].size} | SL:{" "}
                              {order.items[0].quantity}
                            </h1>
                            <h1>Giá: {formatter(order.items[0].price)}</h1>
                          </div>
                        </div>
                      </td>
                      <td className="border p-2 text-center">
                        {new Date(order.createdAt).toLocaleString()}
                      </td>
                      <td className="border p-2 text-center">{order.status}</td>
                      <td className="border p-2 text-center">
                        {order.status !== "Đã hủy" && (
                          <button
                            className="px-4 py-2 text-white bg-red-500 rounded-lg"
                            onClick={() => handleCancelOrder(order._id)}
                          >
                            Hủy đơn
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        <ToastNotification />
      </div>
    </>
  );
};

export default memo(ProfilePage);
