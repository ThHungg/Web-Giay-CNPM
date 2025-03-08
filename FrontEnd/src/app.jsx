import { BrowserRouter } from "react-router-dom";
import RouterCustome from "./router";
import { useEffect } from "react";
import axios from "axios";
import { isJsonString } from "./utils/isJsonString";
import { jwtDecode } from "jwt-decode";
import * as userServices from "./services/userServices";
import { useDispatch } from "react-redux";
import { updateUser } from "./redux/slides/userSlide";

function App() {
  const dispatch = useDispatch();
  const axiosJWT = axios.create();
  // Hàm decode token từ localStorage
  const handleDecoded = () => {
    let storageData = localStorage.getItem("access_token");
    let decoded = {};
    if (storageData && isJsonString(storageData)) {
      storageData = JSON.parse(storageData);
      decoded = jwtDecode(storageData);
    }
    return { decoded, storageData };
  };

  // Hàm lấy thông tin user từ API
  const handleGetDetailsUser = async (id, token) => {
    const res = await userServices.getDetailsUser(id, token);
    if (!id || !token) return;
    dispatch(updateUser({ ...res?.data, access_token: token }));
  };
  // const handleGetDetailsUser = async (id, token) => {
  //   if (!id || !token) return; // Nếu không có id hoặc token, thoát luôn

  //   try {
  //     const res = await userServices.getDetailsUser(id, token);
  //     if (!res?.data) return; // Nếu API không trả về dữ liệu, thoát luôn

  //     dispatch(updateUser({ ...res.data, access_token: token }));
  //   } catch (error) {
  //     console.error("Lỗi lấy thông tin user:", error);
  //   }
  // };

  // Cấu hình interceptor cho axiosJWT
  userServices.axiosJWT.interceptors.request.use(
    async (config) => {
      const currentTime = new Date();
      const { decoded, storageData } = handleDecoded();
      if (decoded?.exp < currentTime.getTime() / 1000 && storageData) {
        const data = await userServices.refreshToken();
        config.headers["token"] = `Bearer ${data?.access_token}`;
      }
      return config;
    },
    (err) => {
      return Promise.reject(err);
    }
  );

  // useEffect để kiểm tra token khi App load
  useEffect(() => {
    const { storageData, decoded } = handleDecoded();
    console.log("Kiểm tra useEffect:", { storageData, decoded });

    if (decoded?.id && storageData) {
      handleGetDetailsUser(decoded.id, storageData);
    }
  }, []);

  return (
    <BrowserRouter>
      <RouterCustome />
    </BrowserRouter>
  );
}

export default App;
