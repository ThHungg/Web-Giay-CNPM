import { memo } from "react";

const Footer = () => {
  return (
    <>
      <footer className="bg-black w-full h-[280px] mt-3 text-white bottom-0">
        <div className="max-w-screen-xl w-full h-full grid grid-cols-4 gap-x-8 mx-auto px-4 pt-2">
          <div className="col-span-1">
            <h1>Hỗ trợ khách hàng</h1>
            <p>Hotline: 0348910968</p>
          </div>
          <div className="col-span-1">
            <h1>Hợp tác và liên kết</h1>
          </div>
          <div className="col-span-1">
            <h1>Phương thức thanh toán</h1>
          </div>
          <div className="col-span-1">
            <h1>Kết nối với chúng tôi</h1>
          </div>
        </div>
      </footer>
    </>
  );
};

export default memo(Footer);
