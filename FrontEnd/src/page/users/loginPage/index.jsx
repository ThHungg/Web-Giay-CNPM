import { memo } from "react";

const LoginPage = () => {
  return (
    <div className="max-w-screen-xl mx-auto flex justify-center items-center min-h-screen">
      <div className="w-2/3 p-2 bg-white rounded-2xl shadow-lg text-center">
        <h2 className="text-2xl font-semibold mb-4">Đăng nhập</h2>
        <label htmlFor="">Tài khoản</label>
        <input
          type="text"
          placeholder="Nhập tài khoản"
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <label htmlFor="">Mật khẩu</label>
        <input
          type="text"
          placeholder="Nhập mật khẩu"
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button className="px-4 py-2 bg-red-500 rounded-2xl mt-3">Đăng nhập</button>
      </div>
    </div>
  );
};

export default memo(LoginPage);
