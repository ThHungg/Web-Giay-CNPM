import { memo } from "react";

const Footer = () => {
  return (
    <>
      <footer className="bg-black w-full h-[280px] mt-3 text-white bottom-0">
        <div className="max-w-screen-xl w-full h-full grid grid-cols-4 gap-x-8 mx-auto px-4 pt-2">
          <div className="col-span-1">
            <h1>Hỗ trợ khách hàng</h1>
            <p>Hotline: 0348910968</p>
            <p>Địa chỉ: Hoàng Mai, Hà Nội</p>
            <p>Email: ...@gmail.com</p>
          </div>
          <div className="col-span-1">
            <h1>Hợp tác và liên kết</h1>
            <ul>
              <li>
                <a href="#">Liên kết 1</a>
              </li>
              <li>
                <a href="#">Liên kết 2</a>
              </li>
              <li>
                <a href="#">Liên kết 3</a>
              </li>
            </ul>
          </div>
          <div className="col-span-1">
            <h1>Phương thức thanh toán</h1>
            <ul>
              <li>
                <p>Visa, MasterCard, PayPal</p>
              </li>
              <li>
                <p>Chuyển khoản ngân hàng</p>
              </li>
              <li>
                <p>Thanh toán qua Momo</p>
              </li>
            </ul>
          </div>
          <div className="col-span-1">
            <h1>Kết nối với chúng tôi</h1>
            <ul>
              <li>
                <a href="#" className="text-blue-400">
                  Facebook
                </a>
              </li>
              <li>
                <a href="#" className="text-blue-400">
                  Instagram
                </a>
              </li>
              <li>
                <a href="#" className="text-blue-400">
                  Twitter
                </a>
              </li>
              <li>
                <a href="#" className="text-blue-400">
                  LinkedIn
                </a>
              </li>
            </ul>
          </div>
        </div>
      </footer>
    </>
  );
};

export default memo(Footer);
