import { memo, useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import * as paymentService from "../../../services/paymentService.js";
import { Button, Result } from "antd";
import React from "react";
import { ROUTERS } from "../../../utils/router.jsx";
import * as cartService from "../../../services/cartService.js";
import * as orderService from "../../../services/orderService.js";
import * as productService from "../../../services/productService.js";
import { useQuery } from "@tanstack/react-query";
import { jwtDecode } from "jwt-decode";
import { useMutationHooks } from "../../../hooks/useMutation.js";

const CheckPayment = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState("");
  const [title, setTitle] = useState("");
  const [order, setOrder] = useState([]);
  const orderId = searchParams.get("vnp_TxnRef");

  const fetchGetHistoryOrder = async (orderId) => {
    const res = await orderService.getDetailOrder(orderId);
    setOrder(res.data);
    return res;
  };

  useEffect(() => {
    if (orderId) {
      fetchGetHistoryOrder(orderId);
    }
  }, [orderId]);

  const token = localStorage.getItem("access_token");
  let userId;
  if (token) {
    const decoded = jwtDecode(token);
    userId = decoded.id;
  }

  const mutation = useMutationHooks(async (data) => {
    const { orderId, ...rests } = data;
    return await orderService.updateOrderStatus(orderId, rests);
  });
  console.log(order.items);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await paymentService.getVNPayPaymentResult(
          Object.fromEntries(searchParams.entries())
        );
        // Kiểm tra mã phản hồi và thiết lập status phù hợp
        if (data.vnp_ResponseCode == "00") {
          const orderRes = await fetchGetHistoryOrder(orderId);
          if (orderRes?.data?.items?.length) {
            const productsToUpdate = orderRes.data.items.map((item) => ({
              productId: item.productId,
              size: item.size,
              quantity: item.quantity,
            }));

            console.log(
              "🚀 Dữ liệu gửi đến updateMultipleSold:",
              productsToUpdate
            );
            await productService.updateMultipleSold(productsToUpdate);
          }

          setStatus("success");
          setTitle("Thanh toán thành công");
          await cartService.clearCart(userId);
          await mutation.mutateAsync({
            orderId,
            status: "Thanh toán thành công",
          });
        } else if (data.vnp_ResponseCode == "24") {
          setStatus("error");
          setTitle("Hủy thanh toán thành công");
          await cartService.clearCart(userId);
          await mutation.mutateAsync({
            orderId,
            status: "Đã hủy",
          });
        }
      } catch (error) {}
    })();
  }, [searchParams]);

  return (
    <>
      <div>
        <Result
          status={status || "info"} // Đảm bảo giá trị hợp lệ cho status
          title={
            status === "success"
              ? "Thanh toán thành công"
              : "Hủy thanh toán thành công"
          }
          subTitle={
            status === "success"
              ? "Order number: 2017182818828182881. Cloud server configuration takes 1-5 minutes, please wait."
              : "There was an issue with your payment. Please try again."
          }
          extra={[
            status === "success" ? (
              <Link to={ROUTERS.USER.HOME}>
                <Button type="primary" key="console">
                  Quay lại trang chủ
                </Button>
              </Link>
            ) : (
              <Link to={ROUTERS.USER.HOME}>
                <Button key="retry">Quay lại trang chủ</Button>
              </Link>
            ),
          ]}
        />
      </div>
    </>
  );
};

export default memo(CheckPayment);
