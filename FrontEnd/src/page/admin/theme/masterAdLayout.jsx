import { memo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaRegUser } from "react-icons/fa";
import { CiShoppingCart } from "react-icons/ci";
import { AiOutlineProduct } from "react-icons/ai";
import { MdDiscount } from "react-icons/md";
import { GoReport } from "react-icons/go";
import { CiLogout } from "react-icons/ci";
import { BiSolidDiscount } from "react-icons/bi";
import { IoStatsChart } from "react-icons/io5";
import { FiMenu, FiX } from "react-icons/fi";
import { jwtDecode } from "jwt-decode";
import { ROUTERS } from "../../../utils/router";

const MasterLayout = ({ children, ...props }) => {
  const token = localStorage.getItem("access_token");
  let isBoss = false;

  if (token) {
    try {
      const decoded = jwtDecode(token);
      isBoss = decoded?.isBoss;
    } catch (error) {
      console.error("Invalid token");
    }
  }

  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();

  const menuItems = [
    isBoss && {
      icon: <IoStatsChart />,
      title: "Statistical",
      path: ROUTERS.ADMIN.STATISTICAL,
    },
    isBoss && {
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
      icon: <BiSolidDiscount />,
      title: "Voucher",
      path: ROUTERS.ADMIN.VOUCHER,
    },
    {
      icon: <MdDiscount />,
      title: "Quản lý giao diện",
    },
    {
      icon: <GoReport />,
      title: "Report",
    },
  ].filter(Boolean);

  const currentPage = menuItems.find((item) => item.path === location.pathname);
  const pageTitle = currentPage ? currentPage.title : "Dashboard";

  return (
    <div {...props}>
      <div className="flex min-h-screen bg-gray-100">
        {/* Sidebar */}
        <div
          className={`${
            isCollapsed ? "w-20" : "w-80"
          } min-h-screen bg-white shadow-lg p-4 transition-all duration-300 fixed top-0 left-0 z-10 flex flex-col`}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            {!isCollapsed && (
              <h1 className="text-2xl font-bold text-gray-800">
                Admin Dashboard
              </h1>
            )}
            <button
              className="p-2 text-gray-600 focus:outline-none"
              onClick={() => setIsCollapsed(!isCollapsed)}
            >
              {isCollapsed ? <FiMenu size={24} /> : <FiX size={24} />}
            </button>
          </div>

          {!isCollapsed && <hr className="border-t border-gray-300 my-4" />}

          {/* Menu */}
          <ul className="space-y-3 flex-1">
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
                  {!isCollapsed && <span>{item.title}</span>}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Content */}
        <div
          className={`flex-1 p-6 transition-all duration-300 ease-in-out ${
            isCollapsed ? "ml-20" : "ml-80"
          }`}
        >
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">{pageTitle}</h1>
            <Link to={ROUTERS.USER.HOME}>
              <CiLogout className="text-3xl text-gray-700 hover:text-black transition" />
            </Link>
          </div>

          {children}
        </div>
      </div>
    </div>
  );
};

export default memo(MasterLayout);
