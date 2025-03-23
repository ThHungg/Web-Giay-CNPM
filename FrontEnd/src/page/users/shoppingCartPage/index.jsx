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
import { AiOutlineLoading3Quarters } from "react-icons/ai"; // Icon loading
import ToastNotification from "../../../component/toastNotification/index.js";
import { toast } from "react-toastify";

const ShoppingCartPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [quantity, setQuantity] = useState({});
  const [cart, setCart] = useState([]);
  const [isRemoving, setIsRemoving] = useState(null);

  const handleQuantityChange = async (productId, newQuantity) => {
    setQuantity((prev) => ({
      ...prev,
      [productId]: newQuantity,
    }));

    await cartService.updateCart(userId, productId, newQuantity);
    await refetch();
  };

  const token = localStorage.getItem("access_token");
  let userId;
  if (token) {
    const decoded = jwtDecode(token);
    userId = decoded.id;
  }

  const handleRemove = async (productId) => {
    setIsRemoving(productId);
    const updatedCart = await cartService.removeFromCart(userId, productId);
    if (updatedCart) {
      toast.success("Xóa thành công");
      await refetch();
    }
    setIsRemoving(null);
  };

  const { data: cartData, refetch } = useQuery({
    queryKey: ["cart", userId],
    queryFn: () => cartService.getCart(userId),
    enabled: !!userId,
  });

  const totalAmount = cartData?.cart?.data?.products.reduce(
    (sum, item) => sum + item.price * (quantity[item.id] || item.quantity),
    0
  );

  return (
    <>
      <div className="grid grid-cols-4 max-w-screen-xl mx-auto mt-5">
        {!cartData?.cart?.data?.products ||
        cartData?.cart?.data?.products.length === 0 ? (
          <div className="text-center col-span-4 text-2xl font-bold text-gray-500">
            Giỏ hàng trống 🛒
          </div>
        ) : (
          <div className="col-span-3">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b text-left bg-gray-100">
                  <th className="px-4 py-2 w-1/3 text-2xl text-center">
                    Sản phẩm
                  </th>
                  <th className="px-4 py-2 w-1/6 text-center text-2xl">Giá</th>
                  <th className="px-4 py-2 w-1/6 text-center text-2xl">
                    Số lượng
                  </th>
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
                          quantity={quantity[item.productId] || item.quantity}
                          setQuantity={(newQty) =>
                            handleQuantityChange(item.productId, newQty)
                          }
                        />
                      </div>
                    </td>
                    <td className="px-4 py-2 text-center text-xl">
                      {formatter(
                        item.price * (quantity[item.id] || item.quantity)
                      )}
                    </td>
                    <td className="px-4 py-2 text-center text-2xl font-bold">
                      {isRemoving === item.productId ? (
                        <AiOutlineLoading3Quarters className="animate-spin text-red-500" />
                      ) : (
                        <MdDeleteOutline
                          className="cursor-pointer"
                          onClick={() => handleRemove(item.productId)}
                        />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {cartData?.cart?.data?.products?.length > 0 && (
          <div className="col-span-1 w-full ">
            <div className="bg-white flex flex-col justify-center items-center p-4 rounded-lg">
              <h1 className="text-3xl font-bold ">Tổng đơn hàng</h1>
              <div className="flex justify-end mt-4">
                <p className="text-2xl font-bold">
                  Tổng đơn: {formatter(totalAmount)}
                </p>
              </div>
              <div className="w-full text-center mt-3">
                <button
                  className="bg-black w-3/4 py-2 rounded-2xl text-white font-bold text-xl"
                  onClick={() => navigate(ROUTERS.USER.CHECKOUT)}
                >
                  Thanh toán
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <ToastNotification />
    </>
  );
};

export default memo(ShoppingCartPage);
