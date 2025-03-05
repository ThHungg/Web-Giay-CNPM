import { BrowserRouter } from "react-router-dom";
import RouterCustome from "./router";
import { useEffect } from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";

function App() {
  const fetchApi = async () => {
    const res = await axios.get(
      `${process.env.REACT_APP_API_URL}/product/get-all`
    );
    return res.data;
  };
  const query = useQuery({ queryKey: ["todos"], queryFn: fetchApi });
  console.log('query', query)
  useEffect(() => {
    fetchApi();
  }, []);
  return (
    <BrowserRouter>
      <RouterCustome />
    </BrowserRouter>
  );
}

export default App;
