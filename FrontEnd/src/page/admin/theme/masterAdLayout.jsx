import { memo } from "react";
import Header from "./Header";
import Footer from "./Footer";
import { ROUTERS } from "../../../utils/router";
import { Link, useLocation } from "react-router-dom";
import { FaRegUser } from "react-icons/fa";
import { CiShoppingCart } from "react-icons/ci";

const MasterLayout = ({ children, ...props }) => {
  const menuItems = [
    {
      icon: <FaRegUser />,
      title: "User",
      path: ROUTERS.ADMIN.USER,
    },
    {
      icon: <CiShoppingCart />,
      title: "Product",
      path: ROUTERS.ADMIN.PRODUCT,
    },
  ];

  const location = useLocation();
  return (
    <div {...props}>
      <>
        <div className="grid grid-cols-12 h-screen">
          <div className="col-span-2 h-full bg-white p-2">
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
          <div className="col-span-10 bg-yellow-500 h-[40px]">
            <div className="mt-[50px] ml-[10px] ">{children}</div>
          </div>
        </div>
      </>
    </div>
  );
};

export default memo(MasterLayout);
