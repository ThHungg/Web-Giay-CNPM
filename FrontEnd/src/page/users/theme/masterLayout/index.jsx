import { memo } from "react";
import { useLocation } from "react-router-dom";
import Header from "../header";
import Footer from "../footer";

const MasterLayout = ({ children, hasAddToBanner = false, setActiveTab }) => {
  const location = useLocation();
  const isCheckPaymentPage = location.pathname === "/payment-result";

  return (
    <div className="flex flex-col min-h-screen">
      {!isCheckPaymentPage && <Header hasAddToBanner={hasAddToBanner} />}
      <main className="flex-grow">{children}</main>
      {!isCheckPaymentPage && <Footer />}
    </div>
  );
};

export default memo(MasterLayout);
