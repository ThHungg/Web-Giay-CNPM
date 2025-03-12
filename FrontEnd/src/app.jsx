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

  useEffect(() => {
    const { storageData, decoded } = handleDecoded();
    if (decoded?.id) {
      handleGetDetailsUser(decoded?.id, storageData);
    }
  }, []);

  const handleDecoded = () => {
    let storageData = localStorage.getItem("access_token");
    let decoded = {};
    if (storageData && isJsonString(storageData)) {
      storageData = JSON.parse(storageData);
      decoded = jwtDecode(storageData);
    }
    return { decoded, storageData };
  };

  userServices.axiosJWT.interceptors.request.use(
    async (config) => {
      const currentTime = new Date();
      const { decoded } = handleDecoded();
      if (decoded?.exp < currentTime.getTime() / 1000) {
        const data = await userServices.refreshToken();
        config.headers["token"] = `Bearer ${data?.access_token}`;
      }
      return config;
    },
    (err) => {
      return Promise.reject(err);
    }
  );

  const handleGetDetailsUser = async (id, token) => {
    const res = await userServices.getDetailsUser(id, token);
    dispatch(updateUser({ ...res?.data, access_token: token }));
  };
  return (
    <BrowserRouter>
      <RouterCustome />
    </BrowserRouter>
  );
}

export default App;
