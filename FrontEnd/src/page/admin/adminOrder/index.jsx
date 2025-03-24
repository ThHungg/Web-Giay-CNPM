import { memo } from "react";
import { useSelector } from "react-redux";
import * as orderServices from "../../../services/orderService";
import { useQuery } from "@tanstack/react-query";

const AdminOrder = () => {
  const user = useSelector((state) => state?.user);

  const getAllOrder = async () => {
    const res = await orderServices.getAllOrder(user?.access_token);
    console.log("res", res);
    return res.data;
  };

  const { data: orders } = useQuery({
    queryKey: ["order"],
    queryFn: getAllOrder,
    enabled: !!user?.access_token,
  });

  console.log("Dữ liệu đơn hàng:", orders);
  return (
    <>
      <div className="">
        <h1 className="text-2xl font-bold">Order</h1>
      </div>
      <div className="mx-20">
        <div className="px-4 h-20 py-4 bg-white w-full shadow rounded-lg">
          <input
            type="search"
            className="w-full h-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
            placeholder="Tìm kiếm sản phẩm"
            // value={searchTerm}
            // onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      <div className="bg-white mt-5 mr-2">
        <table className="w-full border-collapse">
          <thead className="bg-gray-200">
            <tr className="">
              <th className="border p-2">STT</th>
              <th className="border p-2">Khách hàng</th>
              <th className="border p-2">Địa chỉ</th>
              <th className="border p-2">Hình thức thanh toán</th>
              <th className="border p-2">Ngày đặt hàng</th>
              <th className="border p-2">Trạng thái</th>
              <th className="border p-2">Ghi chú</th>
              <th className="border p-2">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {orders?.map((order, index) => {
              return (
                <tr key={order.id} className="text-center">
                  <td className="border p-2">{index + 1}</td>
                  <td className="border p-2">
                    {order.customerInfo.nameReceiver}
                  </td>
                  <td className="border p-2">
                    {order.shippingAddress.street}, {order.shippingAddress.ward}
                    , {order.shippingAddress.district},
                    {order.shippingAddress.province}
                  </td>
                  <td className="border p-2">{order.paymentMethod}</td>
                  <td className="border p-2">
                    {new Date(order.createdAt).toLocaleString()}
                  </td>
                  <td className="border p-2">{order.status}</td>
                  <td className="border p-2">{order.note}</td>
                  <td className="border p-2">
                    <select name="" id="">
                        <option value="">Chờ xác nhận</option>
                        <option value="">Đã xác nhận</option>
                        <option value="">Đang giao</option>
                        <option value="">Đã giao</option>
                        <option value="">Đã hủy</option>
                    </select>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default memo(AdminOrder);
