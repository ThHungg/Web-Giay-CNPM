import { memo } from "react";
import Header from "./Header";
import Footer from "./Footer";
import { ROUTERS } from "../../../utils/router";
import { Link, useLocation } from "react-router-dom";
import { FaRegUser } from "react-icons/fa";
import { CiShoppingCart } from "react-icons/ci";
import { AiOutlineProduct } from "react-icons/ai";
import { MdDiscount } from "react-icons/md";
import { GoReport } from "react-icons/go";
import { CiLogout } from "react-icons/ci";

const MasterLayout = ({ children, ...props }) => {
  const menuItems = [
    {
      icon: <FaRegUser />,
      title: "User",
      path: ROUTERS.ADMIN.USER,
    },
    {
      icon: <AiOutlineProduct />,
      title: "Product",
      path: ROUTERS.ADMIN.PRODUCT,
    },
    {
      icon: <CiShoppingCart />,
      title: "Order",
      path: ROUTERS.ADMIN.ORDER,
    },
    {
      icon: <MdDiscount />,
      title: "Voucher",
      // path: ROUTERS.ADMIN.PRODUCT,
    },
    {
      icon: <GoReport />,
      title: "Report",
      // path: ROUTERS.ADMIN.PRODUCT,
    },
  ];

  const location = useLocation();

  const currentPage = menuItems.find((item) => item.path === location.pathname);
  const pageTitle = currentPage ? currentPage.title : "Dashboard";

  return (
    <div {...props}>
      <>
        {/* <div className="grid grid-cols-12">
            <div className="col-span-2 bg-white p-2 min-h-screen">
              <h1 className="text-2xl font-bold">Admin DashBoard</h1>
              <hr className="border-t border-gray-300 my-2" />
              <ul className="m-5 text-xl">
                {menuItems.map((item, key) => (
                  <li className="hover:text-red-500 " key={key}>
                    <Link
                      className={`block w-full p-2 ${
                        location.pathname === item.path
                          ? "bg-gray-100 rounded-2xl"
                          : "hover:text-red-500"
                      }`}
                      to={item.path}
                    >
                      <div className="flex flex-justify-center items-center gap-3">
                        <div className="">{item.icon}</div>
                        <div className="">{item.title}</div>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="col-span-10 bg-white h-[40px]">
              <div className="mt-[50px] ml-[10px] ">{children}</div>
            </div>
          </div> */}
        <div className="flex min-h-screen bg-gray-100">
          {/* Sidebar */}
          <div className="w-1/6 min-h-screen bg-white shadow-lg p-4">
            <h1 className="text-2xl font-bold text-gray-800">
              Admin Dashboard
            </h1>
            <hr className="border-t border-gray-300 my-4" />

            <ul className="space-y-3">
              {menuItems.map((item, key) => (
                <li key={key}>
                  <Link
                    to={item.path || "#"}
                    className={`flex items-center gap-3 p-3 rounded-lg transition ${
                      location.pathname === item.path
                        ? "bg-gray-200 font-semibold"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    <span className="text-xl">{item.icon}</span>
                    <span>{item.title}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Content */}
          <div className="flex-1 bg-grey p-6 shadow-inner">
            <div className="flex justify-between">
              <h1 className="text-2xl font-bold text-gray-800">{pageTitle}</h1>
              <Link to={ROUTERS.USER.HOME}>
                <CiLogout className="text-3xl font-bold" />
              </Link>
            </div>
            {children}
          </div>
        </div>
      </>
    </div>
  );
};

export default memo(MasterLayout);
