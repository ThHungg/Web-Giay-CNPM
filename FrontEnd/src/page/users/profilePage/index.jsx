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
import "./index.css";

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

  const mutation = useMutationHooks((data) => {
    const { id, ...rests } = data;
    return userService.updateUser(id, rests);
  });

  const { data, isLoading, isSuccess, isError } = mutation;

  useEffect(() => {
    setEmail(user?.email);
    setName(user?.name);
    setPhone(user?.phone);
  }, [user]);

  useEffect(() => {
    if (isSuccess) {
      toast.success("Cập nhật thông tin thành công!");
      const userId = getUserIdFromToken(user);
      handleGetDetailsUser(userId, user?.access_token);
    } else if (isError) {
      toast.error("Cập nhật thất bại!");
    }
  }, [isError, isSuccess]);

  const handleGetDetailsUser = async (id, token) => {
    const res = await userService.getDetailsUser(id, token);
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
  return (
    <>
      <ToastNotification />
      <div className="max-w-screen-xl mx-auto mt-5 flex gap-5">
        {/* Phần thông tin người dùng */}
        <div className="bg-white p-5 w-1/3 rounded-lg shadow">
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
        </div>

        {/* Tabs */}
        <div className="flex-1 bg-white p-5 rounded-lg shadow">
          <Tabs tabPosition="left" className="custom-tabs">
            <Tabs.TabPane tab="Chỉnh sửa thông tin" key="item-1">
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
            </Tabs.TabPane>

            <Tabs.TabPane tab="Lịch sử đặt hàng" key="item-2">
              <p>Lịch sử đặt hàng hiển thị tại đây...</p>
            </Tabs.TabPane>

            <Tabs.TabPane tab="Thông tin khác" key="item-3">
              <p>Nội dung tab 3...</p>
            </Tabs.TabPane>
          </Tabs>
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
