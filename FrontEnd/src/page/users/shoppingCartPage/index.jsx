import { memo, useState } from "react";
import formatter from "../../../utils/formatter";
import Quantity from "../../../component/Quantity/index.jsx";
import { MdDeleteOutline } from "react-icons/md";
import shoesData from "../../../data.json";
import { useNavigate, useParams } from "react-router-dom";
import { ROUTERS } from "../../../utils/router.jsx";

const ShoppingCartPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const product = shoesData.shoes.find((item) => item.id === Number(id));
  const [quantity, setQuantity] = useState(1);
  console.log(quantity);
  return (
    <>
      <div className="max-w-screen-xl mx-auto p-4">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b text-left bg-gray-100">
              <th className="px-4 py-2 w-1/3 text-2xl text-center">Tên</th>
              <th className="px-4 py-2 w-1/6 text-center text-2xl">Giá</th>
              <th className="px-4 py-2 w-1/6 text-center text-2xl">Số lượng</th>
              <th className="px-4 py-2 w-1/6 text-center text-2xl">
                Thành tiền
              </th>
              <th className="px-4 py-2 w-1/12 text-2xl"></th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="px-4 py-2 flex items-center space-x-4">
                <img
                  src="https://images.stockx.com/images/Nike-Air-Force-1-Shadow-Triple-White-W-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&auto=format,compress&q=90&dpr=2&trim=color&updated_at=1607656583"
                  alt=""
                  className="h-16 w-16 object-cointain"
                />
                <span className="text-xl">Sản phẩm số 1</span>
              </td>
              <td className="px-4 py-2 text-center text-xl">
                {formatter(2400000)}
              </td>
              <td className="px-4 py-2 text-center text-xl">
                <div className="flex justify-center">
                  <Quantity
                    hasAddToCart={false}
                    onQuantityChange={setQuantity}
                  />
                </div>
              </td>
              <td className="px-4 py-2 text-center text-xl">
                {formatter(4800000 * quantity)}
              </td>
              <td className="px-4 py-2 text-center text-2xl font-bold">
                <MdDeleteOutline />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="max-w-screen-xl mx-auto mt-5 ">
        <div className="grid grid-cols-2">
          <div className="space-x-2">
            <h3 className="font-bold text-2xl mb-2 mx-2">Mã giảm giá:</h3>
            <input
              type="text"
              placeholder="Nhập mã giảm giá"
              className="px-4 py-2 w-3/4"
            />
            <button className="bg-red-500 px-6 py-2 mr-2 rounded-2xl text-xl font-bold text-white">
              Áp dụng
            </button>
          </div>
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
