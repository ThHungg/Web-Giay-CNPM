import { memo } from "react";
import { FaShoppingCart, FaUser } from "react-icons/fa";
import { ROUTERS } from "../../../../utils/router";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { useDispatch, useSelector } from "react-redux";
import { Popover } from "antd";
import * as userServices from "../../../../services/userServices";
import { resetUser } from "../../../../redux/slides/userSlide";
import logo from "../../../../assets/users/img/brands/logoo.png";
import { CiLogin } from "react-icons/ci";

const Header = ({ hasAddToBanner = true }) => {
  const user = useSelector((state) => state.user);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const hanldeLogout = async () => {
    localStorage.removeItem("access_token");
    await userServices.logoutUser();
    dispatch(resetUser());
  };

  const content = (
    <div className="flex flex-col gap-2 min-w-[180px] p-2">
      <p
        className="cursor-pointer hover:text-red-500 transition-colors"
        onClick={hanldeLogout}
      >
        Đăng xuất
      </p>

      {user?.isAdmin && (
        <p
          className="cursor-pointer hover:text-red-500 transition-colors"
          onClick={() => {
            navigate("/admin/products");
          }}
        >
          Trang Admin
        </p>
      )}

      <Link
        to={ROUTERS.USER.PROFILEPAGE}
        state={{ activeTab: "edit" }}
        className="hover:text-red-500 transition-colors"
      >
        Thông tin tài khoản
      </Link>

      <Link
        to={ROUTERS.USER.PROFILEPAGE}
        state={{ activeTab: "history" }}
        className="hover:text-red-500 transition-colors"
      >
        Lịch sử đặt hàng
      </Link>
    </div>
  );

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

  const location = useLocation();

  const menus = [
    {
      name: "Trang chủ",
      path: ROUTERS.USER.HOME,
    },
    {
      name: "Sản phẩm",
      path: ROUTERS.USER.PRODUCTS,
      // child: [
      //   {
      //     name: "Nam",
      //     path: "",
      //   },
      //   {
      //     name: "Nữ",
      //     path: "",
      //   },
      // ],
    },
    {
      name: "Liên hệ",
      path: ROUTERS.USER.CONTACT,
    },
    // {
    //   name: "Khuyến mãi",
    //   path: ROUTERS.USER.VOUCHER,
    // },
  ];

  return (
    <>
      <div>
        <div className="bg-white max-w-screen-xl min-h-[100px] mx-auto mt-2 flex justify-between rounded-xl">
          <Link to={ROUTERS.USER.HOME}>
            <div className="max-w-full p-4 flex justify-center items-center">
              <img
                // src="https://static.vecteezy.com/system/resources/previews/021/769/107/non_2x/sneaker-logo-free-vector.jpg"
                src={logo}
                alt="Logo"
                className="w-full max-w-[80px]"
              />
              <h1 className="text-5xl font-extrabold italic ml-5 drop-shadow-lg bg-gradient-to-r from-yellow-400 via-black to-gray-600 text-transparent bg-clip-text">
                SneakerMart
              </h1>

              {/* <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-green-500 ml-5 drop-shadow-lg">
                SneakerMart
              </h1> */}
            </div>
          </Link>
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
              {user?.name ? (
                <>
                  <Popover content={content} trigger="click">
                    <div>
                      <FaUser className="text-2xl" />
                    </div>
                  </Popover>
                </>
              ) : (
                <Link to={ROUTERS.USER.LOGINPAGE}>
                  <li className="mx-4 text-2xl cursor-pointer">
                    {/* <FaSearch /> */}
                    <CiLogin />
                  </li>
                </Link>
              )}
              {/* <FaSearch /> */}
              {/* <Link to={ROUTERS.ADMIN.LOGIN}>
              <li className="mx-4 text-xl cursor-pointer">
                Admin
              </li>
            </Link> */}
            </ul>
          </div>
        </div>
        {/* <div className="max-w-screen-xl mx-auto my-3">
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
      </div> */}
        {hasAddToBanner && (
          <div className="max-w-screen-xl mx-auto">
            <Carousel
              responsive={responsive}
              infinite={true}
              autoPlay={true}
              autoPlaySpeed={4000}
              removeArrowOnDeviceType={["tablet", "mobile"]}
            >
              <div className="mx-auto w-full max-w-screen-xl py-3 h-[520px] flex justify-center items-center">
                <img
                  src="https://lambanner.com/wp-content/uploads/2022/10/MNT-DESIGN-BANNER-GIAY-11.jpg"
                  alt=""
                  className="max-h-full w-full object-cover rounded-lg"
                />
              </div>
              <div className="mx-auto w-full max-w-screen-xl py-3 h-[520px] flex justify-center items-center">
                <img
                  src="https://thietke6d.com/wp-content/uploads/2021/05/banner-quang-cao-giay-4-768x426.png"
                  alt=""
                  className="max-h-full w-full object-cover rounded-lg"
                />
              </div>
            </Carousel>
          </div>
        )}
      </div>
    </>
  );
};

export default memo(Header);
