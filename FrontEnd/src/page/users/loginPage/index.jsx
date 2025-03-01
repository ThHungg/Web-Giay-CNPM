import { memo } from "react";

const LoginPage = () => {
  return (
    <div className="max-w-screen-xl mx-auto flex justify-center items-center min-h-screen py-12">
      <div className="w-2/4 p-2 bg-white rounded-2xl shadow-lg">
        <h2 className="text-2xl font-semibold mb-4 text-center">Đăng nhập</h2>
        <div className="mt-3">
          <label htmlFor="">UserName</label>
          <input
            type="text"
            placeholder=""
            className="w-full p-2 border shadow border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mt-3">
          <label htmlFor="">PassWord</label>
          <input
            type="text"
            placeholder=""
            className="w-full p-2 border shadow border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex items-center mt-3">
          <input
            type="checkbox"
            className="h-4 w-4 text-black focus:ring-black border-gray-300 rounded"
          />
          <label className="ml-2  text-sm text-gray-900">
            Lưu thông tin đăng nhập
          </label>
        </div>
        <div className="text-center">
          <button className="px-4 py-2 bg-red-500 rounded-2xl mt-3">
            Đăng nhập
          </button>
        </div>
      </div>
    </div>
  );
};

export default memo(LoginPage);
