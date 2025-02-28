import { memo } from "react";
import { FaSearch, FaShoppingCart, FaUser } from "react-icons/fa";
import { ROUTERS } from "../../../../utils/router";
import { Link, useLocation } from "react-router-dom";
import profilePage from "../../profilePage";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
const Header = ({hasAddToBanner = true}) => {
  const responsive = {
    superLargeDesktop: {
      breakpoint: { max: 4000, min: 3000 },
      items: 5,
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 1,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 2,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
    },
  };

  const location = useLocation(); // Lấy đường dẫn hiện tại

  const menus = [
    {
      name: "Trang chủ",
      path: ROUTERS.USER.HOME,
    },
    {
      name: "Sản phẩm",
      path: ROUTERS.USER.PRODUCTS,
      child: [
        {
          name: "Nam",
          path: "",
        },
        {
          name: "Nữ",
          path: "",
        },
      ],
    },
    {
      name: "Liên hệ",
      path: ROUTERS.USER.CONTACT,
    },
    {
      name: "Khuyến mãi",
      path: ROUTERS.USER.VOUCHER,
    },
  ];

  return (
    <>
      <div
        id="mainHeader"
        className="bg-white max-w-screen-xl min-h-[100px] mx-auto mt-8 flex justify-between rounded-xl"
      >
        <div className="max-w-full p-4">
          <Link to={ROUTERS.USER.HOME}>
            <img
              src="/img/Logo.jpg"
              alt="Logo"
              className="w-full max-w-[80px]"
            />
          </Link>
        </div>
        <div className="flex items-center pr-8">
          <nav className="me-6">
            <ul className="flex space-x-4">
              {menus.map((menu, menuKey) => (
                <li
                  key={menuKey}
                  className={`${
                    (menu.path === "" && location.pathname === "/") ||
                    location.pathname === menu.path
                      ? "text-red-500 font-bold"
                      : ""
                  } hover:text-red-500 relative group`}
                >
                  <Link to={menu.path}>{menu.name}</Link>
                  {menu.child && (
                    <ul className="space-y-2 absolute rounded-2xl w-[180px] opacity-0 group-hover:transition-all duration-300 group-hover:bg-[#F4F4F4] group-hover:opacity-100 group-hover:visible z-50">
                      {menu.child.map((childrenItem, childKey) => (
                        <li
                          key={`${menuKey}-${childKey}`}
                          className="text-black m-2 py-2 hover:text-red-500"
                        >
                          <Link to={childrenItem.path}>
                            {childrenItem.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </nav>
          <ul className="flex">
            <li className="mx-4 text-2xl">
              <Link to={ROUTERS.USER.SHOPPINGCARTPAGE}>
                <FaShoppingCart />
              </Link>
            </li>
            <li className="mx-4 text-2xl">
              <Link to={ROUTERS.USER.PROFILEPAGE}>
                <FaUser />
              </Link>
            </li>
            <Link to={ROUTERS.USER.LOGINPAGE}>
              <li className="mx-4 text-xl cursor-pointer">
                {/* <FaSearch /> */}
                Đăng Nhập
              </li>
            </Link>
          </ul>
        </div>
      </div>
      <div className="max-w-screen-xl mx-auto my-3">
        <div className="w-3/4 mx-auto">
          <form action="">
            <input
              type="text"
              placeholder="Bạn đang tìm gì ?"
              className="h-[48px] border pl-5 w-3/4 rounded-xl focus:outline-none focus:border-black"
            />
            <button
              type="submit"
              className="bg-black h-[48px] rounded-xl text-white px-4 ml-2"
            >
              Tìm kiếm
            </button>
          </form>
        </div>
      </div>
      {hasAddToBanner && (
              <div className="max-w-screen-xl mx-auto">
        <Carousel responsive={responsive}>
          <div className="relative mx-auto w-full max-w-screen-xl py-3 h-[416px] ">
            <img
              src="img/banner/Banner.jpg"
              alt="Banner"
              className="w-full h-full rounded-xl"
            />
            <div className="absolute inset-y-0 w-full flex justify-between items-center px-4">
              {/* <i className="fa-solid fa-angle-left text-5xl text-white cursor-pointer"></i>
          <i className="fa-solid fa-angle-right text-5xl text-white cursor-pointer"></i> */}
            </div>
            <div className="absolute top-1/2 left-[120px] transform -translate-y-1/2 flex justify-between items-center">
              <img src="img/banner/BannerGiay.svg" alt="" />
              <div className="space-y-4 pl-12">
                <h1 className="text-4xl font-bold text-white">
                  Khuyễn Mãi Có Hạn
                </h1>
                <h2 className="text-2xl text-white">Lên đến 50%</h2>
                <p className="text-white">
                  Nâng tầm phong cách cở bản với một chút quyến rũ
                </p>
                <button className="bg-red-500 p-3 rounded-xl font-bold text-white">
                  Mua ngay
                </button>
              </div>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-screen-xl py-3 h-[416px] ">
            <img
              src="img/banner/Banner.jpg"
              alt="Banner"
              className="w-full h-full rounded-xl"
            />
            <div className="absolute inset-y-0 w-full flex justify-between items-center px-4">
              {/* <i className="fa-solid fa-angle-left text-5xl text-white cursor-pointer"></i>
          <i className="fa-solid fa-angle-right text-5xl text-white cursor-pointer"></i> */}
            </div>
            <div className="absolute top-1/2 left-[120px] transform -translate-y-1/2 flex justify-between items-center">
              <img src="img/banner/BannerGiay.svg" alt="" />
              <div className="space-y-4 pl-12">
                <h1 className="text-4xl font-bold text-white">
                  Khuyễn Mãi Có Hạn
                </h1>
                <h2 className="text-2xl text-white">Lên đến 50%</h2>
                <p className="text-white">
                  Nâng tầm phong cách cở bản với một chút quyến rũ
                </p>
                <button className="bg-red-500 p-3 rounded-xl font-bold text-white">
                  Mua ngay
                </button>
              </div>
            </div>
          </div>
        </Carousel>
      </div>
      )}
    </>
  );
};

export default memo(Header);
