import { memo, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as userService from "../../../services/userServices";
import { useMutationHooks } from "../../../hooks/useMutation";
import * as message from "../../../component/message";
import { jwtDecode } from "jwt-decode";
import { updateUser } from "../../../redux/slides/userSlide";
import { toast } from "react-toastify";
import ToastNotification from "../../../component/toastNotification";
import { Tabs } from "antd";

const ProfilePage = () => {
  const user = useSelector((state) => state.user);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const dispatch = useDispatch();

  const getUserIdFromToken = (user) => {
    const decoded = jwtDecode(user.access_token);
    return decoded?.id;
  };

  const mutation = useMutationHooks(async (data) => {
    const { id, ...rests } = data;
    const res = await userService.updateUser(id, rests);
    return res;
  });

  const { data, isLoading, isSuccess, isError } = mutation;

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
  }, [isSuccess]);;

  const handleGetDetailsUser = async (id, token) => {
    const res = await userService.getDetailsUser(id, token);
    console.log("Dữ liệu trả về từ API:", res?.data); // Kiểm tra dữ liệu
    dispatch(updateUser({ ...res?.data, access_token: token, id }));
};


  // Email
  const handleOnchangeEmail = (e) => {
    setEmail(e.target.value);
  };

  // Name
  const handleOnchangeName = (e) => {
    setName(e.target.value);
  };
  // Phone
  const handleOnchangePhone = (e) => {
    setPhone(e.target.value);
  };

  const handleUpdate = () => {
    const userId = getUserIdFromToken(user);
    mutation.mutate({ id: userId, email, name, phone });
  };
  

  const [activeTab, setActiveTab] = useState("edit");
  return (
    <>
      <ToastNotification />
      <div className="max-w-screen-xl mx-auto mt-5 flex gap-5">
        {/* Phần thông tin người dùng */}
        {/* <div className="bg-white p-5 w-1/3 rounded-lg shadow">
          <div className="flex flex-col items-center">
            <img
              src="https://www.pngmart.com/files/23/Profile-PNG-Photo.png"
              alt="User Avatar"
              className="w-[150px] h-[150px] object-cover rounded-full"
            />
            <div className="mt-4 text-center">
              <p className="text-lg font-semibold">UserName: {user.name}</p>
              <p>Phone: {user.phone}</p>
              <p>Email: {user.email}</p>
            </div>
          </div>
        </div> */}

        {/* Tabs */}
        <div className="flex gap-5 w-full mt-5">
          {/* Profile + Tabs */}
          <div className="w-1/3 flex flex-col items-center bg-white p-5 rounded-lg shadow">
            {/* Avatar + Thông tin */}
            <img
              src="https://www.pngmart.com/files/23/Profile-PNG-Photo.png"
              alt="User Avatar"
              className="w-[150px] h-[150px] object-cover rounded-full"
            />
            <div className="mt-4 text-center">
              <p className="text-lg font-semibold">UserName: {user.name}</p>
              <p>Phone: {user.phone}</p>
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
                  activeTab === "history"
                    ? "bg-blue-500 text-white"
                    : "bg-white"
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
                {/* Họ và tên */}
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

                {/* Email */}
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

                {/* Số điện thoại */}
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
                    <tr>
                      <td className="border p-2">1</td>
                      <td className="border p-2">
                        <div className="flex gap-3">
                          <img
                            src="https://supersports.com.vn/cdn/shop/files/FJ7765-101-1.jpg?v=1721988921"
                            alt=""
                            className="h-[60px] w-[80px]"
                          />
                          <div>
                            <h1>Nike Air Force 1 Shadow</h1>
                            <h1>Size: 34 | SL: 1</h1>
                            <h1>Giá: 4.000.000 đ</h1>
                          </div>
                        </div>
                      </td>
                      <td className="border p-2">23/24/2025, 12:23:07 AM</td>
                      <td className="border p-2">Đang giao hàng</td>
                      <td className="border p-2">
                        <button className="px-4 py-2 bg-red-500 rounded-lg text-white">
                          Hủy
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === "other" && <p>Nội dung tab 3...</p>}
          </div>
        </div>
      </div>

      {/* <div className="col-span-2">
          <div className="bg-white w-full mr-5">
            <div className="flex gap-5">
              <div>
                <img
                  src="https://www.pngmart.com/files/23/Profile-PNG-Photo.png"
                  alt=""
                  className="w-[200px] h-[200px] object-cover"
                />
              </div>
              <div className="flex flex-col gap-5 justify-center">
                <p>UserName: {user.name}</p>
                <p>Phone: {user.phone}</p>
                <p>Email: {user.email}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="col-span-3">
          <div className="bg-white w-full p-5">
            <div className="flex flex-col">
              <label className="text-xl m-1">
                Họ và tên: <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  className="pl-2 w-5/6 py-1 border shadow border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Nhập họ và tên"
                  onChange={handleOnchangeName}
                />
                <button
                  className="px-4 bg-black text-white rounded-2xl"
                  onClick={handleUpdate}
                >
                  Cập nhật
                </button>
              </div>
            </div>
            <div className="flex flex-col">
              <label className="text-xl m-1">
                Email: <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  className="pl-2 w-5/6 py-1 border shadow border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Nhập họ và tên"
                  value={email}
                  onChange={handleOnchangeEmail}
                />
                <button
                  className="px-4 bg-black text-white rounded-2xl"
                  onClick={handleUpdate}
                >
                  Cập nhật
                </button>
              </div>
            </div>

            <div className="flex flex-col">
              <label className="text-xl m-1">
                Số điện thoại: <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  className="pl-2 w-5/6 py-1 border shadow border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Nhập họ và tên"
                  onChange={handleOnchangePhone}
                />
                <button
                  className="px-4 bg-black text-white rounded-2xl"
                  onClick={handleUpdate}
                >
                  Cập nhật
                </button>
              </div>
            </div>
          </div>
        </div> */}
    </>
  );
};

export default memo(ProfilePage);
