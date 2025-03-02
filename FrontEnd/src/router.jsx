import { Routes, Route, useLocation } from "react-router-dom";
import { ROUTERS } from "./utils/router";
import Homepage from "./page/users/homePage";
import MasterLayout from "./page/users/theme/masterLayout";
import ProfilePage from "./page/users/profilePage";
import Contact from "./page/users/contact";
import Voucher from "./page/users/voucher";
import DetailProductPage from "./page/users/detailProductPage";
import ProductsPage from "./page/users/productsPage";
import ShoppingCartPage from "./page/users/shoppingCartPage";
import LoginPage from "./page/users/loginPage";
import CheckoutPage from "./page/users/checkoutPage";
import LoginADPage from "./page/admin/loginPage";
import MasterAdLayout from "./page/admin/theme/masterAdLayout";

const renderUserRouter = () => {
  const userRouter = [
    {
      path: ROUTERS.USER.HOME,
      component: <Homepage />,
      hasAddToBanner: true,
    },
    {
      path: ROUTERS.USER.PROFILEPAGE,
      component: <ProfilePage />,
      hasAddToBanner: false,
    },
    {
      path: ROUTERS.USER.PRODUCTS,
      component: <ProductsPage />,
      hasAddToBanner: true,
    },
    {
      path: ROUTERS.USER.CONTACT,
      component: <Contact />,
      hasAddToBanner: false,
    },
    {
      path: ROUTERS.USER.VOUCHER,
      component: <Voucher />,
      hasAddToBanner: false,
    },
    {
      path: `${ROUTERS.USER.DETAILPRODUCT}/:id`,
      component: <DetailProductPage />,
      hasAddToBanner: false,
    },
    {
      path: ROUTERS.USER.SHOPPINGCARTPAGE,
      component: <ShoppingCartPage />,
      hasAddToBanner: false,
    },
    {
      path: ROUTERS.USER.LOGINPAGE,
      component: <LoginPage />,
      hasAddToBanner: false,
    },
    {
      path: ROUTERS.USER.CHECKOUT,
      component: <CheckoutPage />,
      hasAddToBanner: false,
    },
  ];

  return (
    <Routes>
      {userRouter.map((item, key) => (
        <Route
          key={key}
          path={item.path}
          element={
            <MasterLayout hasAddToBanner={item.hasAddToBanner}>
              {item.component}
            </MasterLayout>
          }
        />
      ))}
    </Routes>
  );
};
const renderAdminRouter = () => {
  const adminRouters = [
    {
      path: ROUTERS.ADMIN.LOGIN,
      component: <LoginADPage />,
    },
  ];
  return (
    <MasterAdLayout>
      <Routes>
        {adminRouters.map((item, key) => (
          <Route key={key} path={item.path} element={item.component} />
        ))}
      </Routes>
    </MasterAdLayout>
  );
};

const RouterCustome = () => {
  const location = useLocation();
  const isAdminRouters = location.pathname.startsWith("/admin/");
  return isAdminRouters ? renderAdminRouter() : renderUserRouter();
};

export default RouterCustome;
