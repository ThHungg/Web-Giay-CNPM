import { memo } from "react";
import Header from "./Header";
import Footer from "./Footer";

const MasterLayout = ({ children, ...props }) => {
  const menuItems = [
    {
      title: "User",
      path: "admin/users",
    },
    {
      title: "Oders",
      path: "admin/users",
    },
    {
      title: "Product",
      path: "admin/users",
    },
    {
      title: "Coupon",
      path: "admin/users",
    },
  ];
  return (
    <div {...props}>
      {/* <Header />
      {children}
      <Footer /> */}
      <>
        <div className="grid grid-cols-12 h-screen">
          <div className="col-span-2 h-full bg-white p-2">
            <h1 className="text-2xl font-bold">Admin DashBoard</h1>
            {/* <ul>
              {menuItems.map((item, key) => (
                <li key={key}>
                  <a href={item.path} className="text-blue-500">
                    {item.title}
                  </a>
                </li>
              ))}
            </ul> */}
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
