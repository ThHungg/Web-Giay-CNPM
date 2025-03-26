import { memo, useState } from "react";
import * as userService from "../../../services/userServices";
import ToastNotification from "../../../component/toastNotification";
import { toast } from "react-toastify";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  const handleSendOtp = async () => {
    const res = await userService.sendOtp(email);
    if (res.status === "OK") {
      setOtpSent(true);
      toast.success(res.message);
    } else {
      toast.error(res.message);
    }
    return res;
  };

  const handleResetPassword = async () => {
    const res = await userService.resetPass(email, otp, newPassword);
    return res;
  };

  return (
    <div className="max-w-screen-xl h-full mx-auto flex items-center justify-center my-[60px]">
      <div className="w-2/4 p-2 bg-white rounded-md shadow-lg p-4">
        <h2 className="text-2xl font-semibold mb-4 text-center">
          Quên mật khẩu
        </h2>
        <div className="mt-3 space-y-2">
          <label>Nhập email</label>
          <div className="flex gap-2">
            <input
              type="text"
              name="email"
              className="w-5/6 p-2 border shadow border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button
              className="bg-red-500 px-3 font-bold text-white rounded-lg text-1xl"
              onClick={handleSendOtp}
            >
              Gửi OTP
            </button>
          </div>
        </div>

        <div className="mt-3 space-y-2">
          <label>Nhập mã OTP</label>
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="w-full p-2 border shadow border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mt-3 space-y-2">
          <label>Nhập mật khẩu mới</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full p-2 border shadow border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mt-3 space-y-2">
          <label>Xác nhận mật khẩu mới</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full p-2 border shadow border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mt-6">
          <button
            onClick={handleResetPassword}
            className="w-full py-2 px-4 border border-gray-300 rounded-md text-xl font-bold text-white bg-black"
          >
            Đặt lại mật khẩu
          </button>
        </div>
      </div>
      <ToastNotification />
    </div>
  );
};

export default memo(ForgotPassword);
