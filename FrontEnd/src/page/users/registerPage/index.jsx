import { memo, useState } from "react";
import { Link } from "react-router-dom";
import { ROUTERS } from "../../../utils/router";
import * as userServices from "../../services/userServices";
import { useMutationHooks } from "../../../hooks/useMutation";
import Loading from "../../../component/Loading";

const RegisterPage = () => {
  const mutation = useMutationHooks((data) => userServices.registerUser(data));
  const { data, isLoading } = mutation;
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validateForm = () => {
    const newErr = {};

    // Username
    if (!formData.username) {
      newErr.username = "Vui lòng nhập tên đăng nhập";
    }

    // Name
    if (!formData.name) {
      newErr.name = "Vui lòng nhập họ và tên";
    }

    // Email
    const email = formData.email?.trim();
    if (!email) {
      newErr.email = "Vui lòng điền email";
    } else if (!/^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(email)) {
      newErr.email = "Vui lòng nhập đúng định dạng email";
    }

    // Phone
    if (!formData.phone) {
      newErr.phone = "Vui lòng nhập số điện thoại";
    } else if (!/^\d{10,11}$/.test(formData.phone)) {
      newErr.phone = "Số điện thoại không hợp lệ";
    }

    // Password
    if (!formData.password) {
      newErr.password = "Vui lòng nhập mật khẩu";
    } else if (formData.password.length < 6) {
      newErr.password = "Mật khẩu phải có ít nhất 6 ký tự";
    }

    // Confirm Password
    if (!formData.confirmPassword) {
      newErr.confirmPassword = "Vui lòng nhập lại mật khẩu";
    } else if (formData.confirmPassword !== formData.password) {
      newErr.confirmPassword = "Mật khẩu nhập lại không khớp";
    }

    if (Object.keys(newErr).length > 0) {
      setErrors(newErr);
      console.log("Err", newErr);
      return false;
    }

    return true;
  };

  const handleRegister = (e) => {
    e.preventDefault();
    if (validateForm()) {
      setLoading(true);
      mutation.mutate({
        username: formData.username,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      });
    }
  };

  return (
    <div className="max-w-screen-xl mx-auto flex justify-center my-5">
      <div className="w-2/4 p-4 bg-white rounded-md shadow-lg">
        <h2 className="text-2xl font-semibold mb-4 text-center">Đăng ký</h2>
        <form onSubmit={handleRegister}>
          <div className="space-y-3">
            <div>
              <label htmlFor="username">Tên đăng nhập</label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200"
              />
              {errors.username && (
                <p className="text-red-500 text-sm mt-1">{errors.username}</p>
              )}
            </div>

            <div>
              <label htmlFor="name">Họ và Tên</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200"
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name}</p>
              )}
            </div>

            <div>
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200"
              />
              {data?.status === "checkemail" && (
                <span className="text-red-500">{data?.message}</span>
              )}
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <label htmlFor="phone">Số điện thoại</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200"
              />
              {errors.phone && (
                <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
              )}
            </div>

            <div>
              <label htmlFor="password">Mật khẩu</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200"
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
            </div>

            <div>
              <label htmlFor="confirmPassword">Nhập lại mật khẩu</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200"
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.confirmPassword}
                </p>
              )}
            </div>
          </div>
          <Loading isLoading={loading}>
            <div className="mt-6">
              <button
                type="submit"
                className="w-full py-2 px-4 rounded-md font-bold text-white bg-black"
              >
                Đăng ký
              </button>
            </div>
          </Loading>
        </form>

        <div className="relative mt-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">
              Bạn đã có tài khoản?
            </span>
          </div>
        </div>

        <Loading isLoading={loading}>
          <div className="mt-6">
            <Link
              to={ROUTERS.USER.LOGINPAGE} delay={2000}
              className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md font-medium bg-white"
            >
              Đăng nhập
            </Link>
          </div>
        </Loading>
      </div>
    </div>
  );
};

export default memo(RegisterPage);
