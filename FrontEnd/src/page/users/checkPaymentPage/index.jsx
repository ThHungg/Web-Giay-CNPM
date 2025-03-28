import { memo, useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import * as paymentService from "../../../services/paymentService.js";
import { Button, Result } from "antd";
import React from "react";
import { ROUTERS } from "../../../utils/router.jsx";

const CheckPayment = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState("");
  const [title, setTitle] = useState("");

  useEffect(() => {
    (async () => {
      try {
        console.log(searchParams);

        const { data } = await paymentService.getVNPayPaymentResult(
          Object.fromEntries(searchParams.entries())
        );
        console.log(data);
        console.log(status);
        console.log(data.vnp_ResponseCode);
        // Kiểm tra mã phản hồi và thiết lập status phù hợp
        if (data.vnp_ResponseCode == "00") {
          setStatus("success");
          setTitle("Thanh toán thành công");
        } else if (data.vnp_ResponseCode == "24") {
          setStatus("error");
          setTitle("Hủy thanh toán thành công");
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
