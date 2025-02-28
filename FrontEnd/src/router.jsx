import { Routes, Route } from "react-router-dom";
import { ROUTERS } from "./utils/router";
import Homepage from "./page/users/homepage";
import MasterLayout from "./page/users/theme/masterLayout";
import ProfilePage from "./page/users/profilePage";
import Contact from "./page/users/contact";
import Voucher from "./page/users/voucher";
import DetailProductPage from "./page/users/detailProductPage";
import ProductsPage from "./page/users/productsPage";
import ShoppingCartPage from "./page/users/shoppingCartPage";
import LoginPage from "./page/users/loginPage";

const renderUserRouter = () => {
  const userRouter = [
    {
      path: ROUTERS.USER.HOME,
      component: <Homepage />,
      // Ứng với đường dẫn này sẽ trả về componen là Home
    },
    {
      path: ROUTERS.USER.PROFILE,
      component: <ProfilePage />,
      // Ứng với đường dẫn này sẽ trả về componen là Home
    },
    {
      path: ROUTERS.USER.PRODUCTS,
      component: <ProductsPage />,
      // Ứng với đường dẫn này sẽ trả về componen là Home
    },
    {
      path: ROUTERS.USER.CONTACT,
      component: <Contact />,
      // Ứng với đường dẫn này sẽ trả về componen là Home
    },
    {
      path: ROUTERS.USER.VOUCHER,
      component: <Voucher />,
      // Ứng với đường dẫn này sẽ trả về componen là Home
    },
    {
      path: ROUTERS.USER.PROFILEPAGE,
      component: <ProfilePage />,
      // Ứng với đường dẫn này sẽ trả về componen là Home
    },
    {
      path: `${ROUTERS.USER.DETAILPRODUCT}/:id`,
      component: <DetailProductPage />,
      // Ứng với đường dẫn này sẽ trả về componen là Home
    },
    {
      path: ROUTERS.USER.SHOPPINGCARTPAGE,
      component: <ShoppingCartPage />,
      // Ứng với đường dẫn này sẽ trả về componen là Home
    },
    {
      path: ROUTERS.USER.LOGINPAGE,
      component: <LoginPage />,
    },
  ];

  return (
    <MasterLayout>
      <Routes>
        {userRouter.map((item, key) => (
          <Route key={key} path={item.path} element={item.component} />
        ))}
      </Routes>
    </MasterLayout>
    //   <Routes>
    //   {userRouter.map((item, key) => (
    //     <Route
    //       key={key}
    //       path={item.path}
    //       element={
    //         <MasterLayout hasAddToBanner={item.hasToBanner}>
    //           {item.component}
    //         </MasterLayout>
    //       }
    //     />
    //   ))}
    // </Routes>
  );
};

const RouterCustome = () => {
  return renderUserRouter();
};

export default RouterCustome;
