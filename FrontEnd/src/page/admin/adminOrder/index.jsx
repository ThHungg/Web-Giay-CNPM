import { memo, useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import * as orderServices from "../../../services/orderService";
import { useQuery } from "@tanstack/react-query";
import { useMutationHooks } from "../../../hooks/useMutation";
import { Spin } from "antd";
import formatter from "../../../utils/formatter";

const AdminOrder = () => {
  const user = useSelector((state) => state?.user);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [rowSelected, setRowSelected] = useState();
  const [orderDetails, setOrderDetails] = useState();
  
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

  const fetchGetDetailsOrder = async (rowSelected) => {
    const res = await orderServices.getOrdersByUserId(rowSelected);
    setOrderDetails(res);
    return res;
  };

  useEffect(() => {
    if (rowSelected) {
      fetchGetDetailsOrder(rowSelected);
    }
  }, [rowSelected]);

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

  const handleCancel = () => {
    setShowDetailModal(false);
  };

  const [loadingDetail, setLoadingDetail] = useState(true);

  useEffect(() => {
    if (orderDetails) {
      setLoadingDetail(false);
    } else {
      setLoadingDetail(true);
    }
  }, [orderDetails]);

  const DetailModal = useMemo(
    () => (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
        <div className="w-1/2 bg-white p-8 shadow-lg rounded-xl flex flex-col">
          <h1 className="text-2xl font-bold text-center">Thông tin đơn hàng</h1>
          <div className="">
            <p className="font-bold">
              Mã đơn hàng:{" "}
              <span className="font-normal">
                {orderDetails?.data.orderCode}
              </span>
            </p>

            <p className="font-bold">
              Người đặt hàng:{" "}
              <span className="font-normal">
                {orderDetails?.data.customerInfo?.nameReceiver}
              </span>
            </p>

            <p className="font-bold">
              Số điện thoại:{" "}
              <span className="font-normal">
                {orderDetails?.data.customerInfo?.phoneReceiver}
              </span>
            </p>

            <p className="font-bold">
              Phương thức thanh toán:{" "}
              <span className="font-normal">
                {orderDetails?.data.paymentMethod}
              </span>
            </p>

            <p className="font-bold">
              Trạng thái thanh toán:{" "}
              <span className="font-normal">{orderDetails?.data.status}</span>
            </p>

            <p className="font-bold">
              Địa chỉ nhận hàng:{" "}
              <span className="font-normal">
                {orderDetails?.data?.shippingAddress.street + " , "}
                {orderDetails?.data?.shippingAddress.ward + " , "}
                {orderDetails?.data?.shippingAddress.district + " , "}
                {orderDetails?.data?.shippingAddress.province}
              </span>
            </p>

            <p className="font-bold">
              Tổng tiền:{" "}
              <span className="font-normal">
                {formatter(orderDetails?.data?.total)}
              </span>
            </p>
            <div className="">
              <p className="font-bold ">Danh sách sản phẩm</p>
              <div className="grid grid-cols-2 gap-2 max-h-[200px] overflow-y-auto">
                {orderDetails?.data?.items?.map((order, key) => (
                  <div
                    key={key}
                    className="flex gap-2 mt-3 border p-2 rounded-lg"
                  >
                    <div className="">
                      <img
                        src={order.productId.image}
                        alt={order.productId.name}
                        className="w-[120px] h-[80px] object-cover"
                      />
                    </div>
                    <div className="flex flex-col">
                      <p className="font-bold">{order.productId.name}</p>
                      <p>Size: {order.size}</p>
                      <p>SL: {order.quantity}</p>
                      <p>Giá: {order.price.toLocaleString()} đ</p>
                    </div>
                  </div>
                ))}
              </div>
              {/* <table className="">
                  <thead>
                    <tr>
                      <th>Tên sản phẩm</th>
                      <th>Số lượng</th>
                    </tr>
                  </thead>
              </table> */}
            </div>
            {/* <p className="font-bold">
              Mã đơn hàng: <span className="font-normal">ABC123</span>
            </p> */}
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <button
              className="px-4 py-2 bg-white border font-bold w-1/4 rounded-lg"
              onClick={handleCancel}
            >
              Hủy
            </button>
          </div>
        </div>
      </div>
    ),
    [orderDetails]
  );

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
              <option value="Đã hủy">Đã hủy</option>
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
                <tr
                  key={order.id}
                  className="text-center"
                  onClick={() => setRowSelected(order._id)}
                >
                  <td className="border p-2">{order.orderCode}</td>
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
                  <td
                    className="border p-2 truncate max-w-[250px] whitespace-nowrap overflow-hidden"
                    title={order.note}
                  >
                    {order.note}
                  </td>

                  <td className="border p-2">
                    <div className="flex flex-col gap-2">
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
                      <button
                        className="px-4 py-2 bg-black rounded-lg text-white font-bold"
                        onClick={() => setShowDetailModal(true)}
                      >
                        Chi tiết
                      </button>
                    </div>
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
      {showDetailModal &&
        (loadingDetail ? (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <Spin size="large" />
          </div>
        ) : (
          DetailModal
        ))}
    </>
  );
};

export default memo(AdminOrder);
