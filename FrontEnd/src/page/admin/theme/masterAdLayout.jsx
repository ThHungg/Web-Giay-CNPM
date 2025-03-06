import { memo } from "react";
import Header from "./Header";
import Footer from "./Footer";

const MasterLayout = ({ children, ...props }) => {
  return (
    <div {...props}>
      <Header />
      {children}
      <Footer />
    </div>
  );
};

export default memo(MasterLayout);
