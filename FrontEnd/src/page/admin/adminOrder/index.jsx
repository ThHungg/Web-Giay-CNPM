import { memo, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import * as orderServices from "../../../services/orderService";
import { useQuery } from "@tanstack/react-query";
import { useMutationHooks } from "../../../hooks/useMutation";

const AdminOrder = () => {
  const user = useSelector((state) => state?.user);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedStatus, setSelectedStatus] = useState("");
  const mutation = useMutationHooks(async (data) => {
    const { orderId, token, ...rests } = data;
    return await orderServices.updateOrder(orderId, token, rests);
  });

  const getAllOrder = async () => {
    const res = await orderServices.getAllOrder(user?.access_token);
    return res.data;
  };

  const { data: orders, refetch } = useQuery({
    queryKey: ["order"],
    queryFn: getAllOrder,
    enabled: !!user?.access_token,
  });

  const handleStatusChange = async (orderId, newStatus) => {
    await mutation.mutate({
      orderId,
      token: user?.access_token,
      status: newStatus,
    });
    refetch();
  };

  useEffect(() => {
    if (mutation.isSuccess) {
      refetch();
    }
  }, [mutation.isSuccess, refetch]);

  const filteredOrders = orders?.filter((order) => {
    return selectedStatus === "" || order.status === selectedStatus;
  });

  useEffect(() => {
    const updateItemsPerPage = () => {
      const itemHeight = 45;
      const availableHeight = window.innerHeight - 200;
      const items = Math.floor(availableHeight / itemHeight);
      setItemsPerPage(items > 0 ? items : 1);
    };

    updateItemsPerPage();
    window.addEventListener("resize", updateItemsPerPage);

    return () => window.removeEventListener("resize", updateItemsPerPage);
  }, []);

  const totalPages = filteredOrders?.length
    ? Math.ceil(filteredOrders.length / itemsPerPage)
    : 0;

  const currentOrders =
    filteredOrders?.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    ) || [];
  return (
    <>
      <div className="flex justify-between items-center mt-3">
        <div className="flex gap-3 mt-5">
          <div className="w-[200px]">
            <select
              className="border w-full p-2 rounded-lg"
              name=""
              value={selectedStatus}
              onChange={(e) => {
                setSelectedStatus(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="">Trạng thái</option>
              <option value="Chờ xác nhận">Chờ xác nhận</option>
              <option value="Đã xác nhận">Đã xác nhận</option>
              <option value="Đang giao">Đang giao</option>
              <option value="Đã giao">Đã giao</option>
              <option value="Đã hủy">
                Đã hủy
              </option>
            </select>
          </div>
        </div>
        {/* search */}
        <div className="flex gap-5">
          <div className="px-2 py-2 bg-white w-[400px] shadow-sm rounded-lg flex items-center">
            <input
              type="search"
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
              placeholder="Tìm kiếm sản phẩm"
              // value={searchTerm}
              // onChange={(e) => setSearchTerm(e.target.value.toLowerCase())}
            />
          </div>
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
            {currentOrders.map((order, index) => {
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
                  <td
                    className={`border p-2 font-bold ${
                      order.status === "Đã hủy" ? "text-red-500 font-bold" : ""
                    }`}
                  >
                    {order.status}
                  </td>

                  <td className="border p-2">{order.note}</td>
                  <td className="border p-2">
                    <select
                      className="border p-1 rounded"
                      value={order.status}
                      onChange={(e) =>
                        handleStatusChange(order._id, e.target.value)
                      }
                    >
                      <option value="Chờ xác nhận">Chờ xác nhận</option>
                      <option value="Đã xác nhận">Đã xác nhận</option>
                      <option value="Đang giao">Đang giao</option>
                      <option value="Đã giao">Đã giao</option>
                      <option value="Đã hủy" className="text-red-500">
                        Hủy đơn
                      </option>
                    </select>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="mt-5 flex justify-end">
        <button
          className="px-4 py-2 mx-2 bg-gray-200 rounded disabled:opacity-50"
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Trước
        </button>
        <span className="px-4 py-2">
          {currentPage}/{totalPages}
        </span>
        <button
          className="px-4 py-2 mx-2 bg-gray-200 rounded disabled:opacity-50"
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Sau
        </button>
      </div>
    </>
  );
};

export default memo(AdminOrder);
