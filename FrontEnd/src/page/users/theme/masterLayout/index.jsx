import { memo } from "react";
import Header from "../header";
import Footer from "../footer";

const MasterLayout = ({ children, hasAddToBanner = false }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header hasAddToBanner={hasAddToBanner} />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
};

export default memo(MasterLayout);
