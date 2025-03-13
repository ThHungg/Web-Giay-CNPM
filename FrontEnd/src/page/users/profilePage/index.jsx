import { memo, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as userService from "../../../services/userServices";
import { useMutationHooks } from "../../../hooks/useMutation";
import * as message from "../../../component/message";
import { jwtDecode } from "jwt-decode";
import { updateUser } from "../../../redux/slides/userSlide";
import { toast } from "react-toastify";
import ToastNotification from "../../../component/toastNotification";

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

  const profile = [
    {
      img: "https://www.pngmart.com/files/23/Profile-PNG-Photo.png",
      name: "Đặng Thành Hưng",
      phone: "0348910968",
      email: "dth052k4@gmail.com",
    },
  ];
  return (
    <>
      <ToastNotification />
      <div className="max-w-screen-xl grid grid-cols-5 mx-auto mt-5 space-x-2">
        <div className="col-span-2">
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
        </div>
      </div>
    </>
  );
};

export default memo(ProfilePage);
