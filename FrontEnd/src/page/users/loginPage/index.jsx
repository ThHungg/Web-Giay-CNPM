import { memo, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ROUTERS } from "../../../utils/router";
import * as userServices from "../../../services/userServices";
import { useMutationHooks } from "../../../hooks/useMutation";
import Loading from "../../../component/Loading";
import * as message from "../../../component/message";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useDispatch } from "react-redux";
import { updateUser } from "../../../redux/slides/userSlide";
import { toast } from "react-toastify";
import ToastNotification from "../../../component/toastNotification";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const mutation = useMutationHooks((data) => userServices.loginUser(data));
  const { data, isLoading, isSuccess, isError } = mutation;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showForgotPassModal, setShowForgotPassModal] = useState(false);

  useEffect(() => {
    if (isSuccess) {
      localStorage.setItem("access_token", JSON.stringify(data?.access_token));
      // localStorage.setItem("access_token", data?.access_token);
      if (data?.access_token) {
        const decoded = jwtDecode(data?.access_token);
        if (decoded?.id) {
          handleGetDetailsUser(decoded?.id, data?.access_token);
        }
        navigate("/");
      }
    }
  }, [isSuccess]);

  const handleGetDetailsUser = async (id, token) => {
    const res = await userServices.getDetailsUser(id, token);
    dispatch(updateUser({ ...res?.data, access_token: token, id }));
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email.trim()) {
      newErrors.email = "Vui lòng nhập tên đăng nhập";
    }
    if (!formData.password.trim()) {
      newErrors.password = "Vui lòng nhập mật khẩu";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = () => {
    if (validateForm()) {
      setLoading(true);
      mutation.mutate({
        email: formData.email,
        password: formData.password,
      });
      console.log("Đăng nhập với:", formData);
    }
  };
  const handleCancel = () => {
    setShowForgotPassModal(false);
  };
  const ForgotPassModal = useMemo(
    () => (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
        <div className="w-1/4 bg-white p-8 shadow-lg rounded-xl flex flex-col">
          <h1 className="text-2xl font-bold text-center">Quên mật khẩu</h1>
          <input
            type="text"
            className="border w-full p-2 rounded-lg mt-3"
            name=""
            placeholder="Nhập email để lấy lại mật khẩu"
          />
          <div className="flex justify-end gap-2 mt-4">
            <button
              className="px-4 py-2 bg-white border font-bold w-1/4 rounded-lg"
              onClick={handleCancel}
            >
              Hủy
            </button>
            <button className="px-4 py-2 bg-black text-white border font-bold w-1/4 rounded-lg">
              Xác nhận
            </button>
          </div>
        </div>
      </div>
    ),
    []
  );

  return (
    <div className="max-w-screen-xl mx-auto flex justify-center my-5">
      <div className="w-2/4 p-2 bg-white rounded-md shadow-lg p-4">
        <h2 className="text-2xl font-semibold mb-4 text-center">Đăng nhập</h2>

        <div className="mt-3 space-y-2">
          <label>Email</label>
          <input
            type="text"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-2 border shadow border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {data?.status === "checkUser" && (
            <span className="text-red-500">{data?.message}</span>
          )}
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email}</p>
          )}
        </div>

        <div className="mt-3 space-y-2">
          <label>PassWord</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full p-2 border shadow border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {data?.status === "ERR" && (
            <span className="text-red-500 text-sm">{data?.message}</span>
          )}
          {errors.password && (
            <p className="text-red-500 text-sm">{errors.password}</p>
          )}
        </div>

        <div className="flex items-center mt-3 justify-between">
          <div className="flex items-center">
            <input
              type="checkbox"
              className="h-4 w-4 text-black focus:ring-black border-gray-300 rounded"
            />
            <label className="ml-2 text-sm text-gray-900">
              Lưu thông tin đăng nhập
            </label>
          </div>
          {/* <p onClick={() => setShowForgotPassModal(true)}>Quên mật khẩu ?</p> */}
          <Link to={ROUTERS.USER.FORGOTPASS}>Quên mật khẩu ?</Link>
        </div>

        <div className="mt-6">
          <button
            onClick={handleLogin}
            className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md text-xl font-bold text-white bg-black"
          >
            Đăng nhập
          </button>
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">
              Bạn chưa có tài khoản
            </span>
          </div>
        </div>

        <div className="mt-6">
          <Link
            to={ROUTERS.USER.REGISTER}
            className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-xl font-medium bg-white"
          >
            Đăng ký
          </Link>
        </div>
      </div>
      {showForgotPassModal && ForgotPassModal}
    </div>
  );
};

export default memo(LoginPage);
