import { memo, useState } from "react";
import formatter from "../../../utils/formatter";
import Quantity from "../../../component/Quantity/index.jsx";
import { MdDeleteOutline } from "react-icons/md";
import shoesData from "../../../data.json";
import { useNavigate, useParams } from "react-router-dom";
import { ROUTERS } from "../../../utils/router.jsx";
import * as cartService from "../../../services/cartService.js";
import { jwtDecode } from "jwt-decode";
import { useQuery } from "@tanstack/react-query";

const ShoppingCartPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [quantity, setQuantity] = useState({});
  const handleQuantityChange = (id, newQuantity) => {
    setQuantity((prev) => ({
      ...prev,
      [id]: newQuantity,
    }));
  };
  console.log(quantity);

  const token = localStorage.getItem("access_token");
  let userId;
  if (token) {
    const decoded = jwtDecode(token);
    userId = decoded.id;
  }

  const { data: cartData, refetch } = useQuery({
    queryKey: ["cart", userId],
    queryFn: () => cartService.getCart(userId),
    enabled: !!userId,
  });

  console.log("Cart Data:", cartData);

  return (
    <>
      <div className="max-w-screen-xl mx-auto p-4">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b text-left bg-gray-100">
              <th className="px-4 py-2 w-1/3 text-2xl text-center">Sản phẩm</th>
              <th className="px-4 py-2 w-1/6 text-center text-2xl">Giá</th>
              <th className="px-4 py-2 w-1/6 text-center text-2xl">Số lượng</th>
              <th className="px-4 py-2 w-1/6 text-center text-2xl">
                Thành tiền
              </th>
              <th className="px-4 py-2 w-1/12 text-2xl"></th>
            </tr>
          </thead>
          <tbody>
            {cartData?.cart?.data?.products?.map((item) => (
              <tr key={item.id} className="border-b">
                <td className="px-4 py-2 flex items-center space-x-4">
                  <div className="bg-white w-full rounded-2xl">
                    <div className="flex p-2">
                      <img
                        src={item.productId.image}
                        // alt={item.name}
                        className="w-[160px] h-[100px] object-contain"
                      />
                      <div className="ml-4 mx-auto my-auto">
                        <p className="font-bold">
                          {item.productId.name}
                          {item.productId.discount > 0 && (
                            <span className="text-red-500">
                              {" "}
                              -{item.productId.discount}%
                            </span>
                          )}
                        </p>
                        {/* <p>Màu: {item.color}</p> */}
                        <p>Size: {item.size}</p>
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-2 text-center text-xl">
                  {formatter(item.price)}
                </td>
                <td className="px-4 py-2 text-center text-xl">
                  <div className="flex justify-center">
                    <Quantity
                      quantity={quantity[item.id] || item.quantity}
                      onQuantityChange={(newQty) =>
                        handleQuantityChange(item.id, newQty)
                      }
                    />
                  </div>
                </td>
                <td className="px-4 py-2 text-center text-xl">
                  {formatter(item.price * (quantity[item.id] || item.quantity))}
                </td>
                <td className="px-4 py-2 text-center text-2xl font-bold">
                  <MdDeleteOutline />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="max-w-screen-xl mx-auto mt-5 ">
        <div className="grid grid-cols-2">
          {/* <div className="space-x-2">
            <h3 className="font-bold text-2xl mb-2 mx-2">Mã giảm giá:</h3>
            <input
              type="text"
              placeholder="Nhập mã giảm giá"
              className="px-4 py-2 w-3/4"
            />
            <button className="bg-red-500 px-6 py-2 mr-2 rounded-2xl text-xl font-bold text-white">
              Áp dụng
            </button>
          </div> */}
          <div className="bg-white w-full p-4 rounded-2xl">
            <h3 className="font-bold text-2xl mb-2 mx-2">Tổng đơn:</h3>
            <ul>
              <li className="flex justify-between text-xl">
                Số lượng: <span className="">2</span>
              </li>
              <li className="flex justify-between text-xl">
                Thành tiền: <span className="">{formatter(4800000)}</span>
              </li>
            </ul>
            <div className="w-full text-center mt-3">
              <button
                className="bg-red-500 w-3/4 py-2 rounded-2xl text-white font-bold text-xl"
                onClick={() => navigate(ROUTERS.USER.CHECKOUT)}
              >
                Thanh toán
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default memo(ShoppingCartPage);
