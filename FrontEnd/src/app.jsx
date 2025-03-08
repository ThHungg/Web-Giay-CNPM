import { BrowserRouter } from "react-router-dom";
import RouterCustome from "./router";
import { useEffect } from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { isJsonString } from "./utils/isJsonString";
import { jwtDecode } from "jwt-decode";
import * as userServices from "./services/userServices";
import { useDispatch } from "react-redux";
import { updateUser } from "./redux/slides/userSlide";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    let storageData = localStorage.getItem("access_token");
    if (storageData && isJsonString(storageData)) {
      storageData = JSON.parse(storageData);
      const decoded = jwtDecode(storageData);
      if (decoded?.id) {
        handleGetDetailsUser(decoded?.id, storageData);
      }
    }
  }, []);

  axios.interceptors.request.use(
    function (config) {
      return config;
    },
    function (error) {
      return Promise.reject(error);
    }
  );

  const handleGetDetailsUser = async (id, token) => {
    const res = await userServices.getDetailsUser(id, token);
    dispatch(updateUser({ ...res?.data, access_token: token }));
  };

  // const fetchApi = async () => {
  //   const res = await axios.get(
  //     `${process.env.REACT_APP_API_URL}/product/get-all`
  //   );
  //   return res.data;
  // };
  // const query = useQuery({ queryKey: ["todos"], queryFn: fetchApi });
  // console.log("query", query);
  // useEffect(() => {
  //   fetchApi();
  // }, []);
  return (
    <BrowserRouter>
      <RouterCustome />
    </BrowserRouter>
  );
}

export default App;
