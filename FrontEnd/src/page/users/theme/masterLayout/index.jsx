import { memo } from "react";
import Header from "../header";
import Footer from "../footer";

const MasterLayout = ({ children, hasAddToBanner, ...props }) => {
  return (
    <div {...props}>
      <Header />
      {children}
      <Footer />
    </div>
  );
};

export default memo(MasterLayout);
