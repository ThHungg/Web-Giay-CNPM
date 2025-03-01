import { memo } from "react";

const MasterLayout = ({ children, ... props}) => {
  return (
    <div {...props}>
      {children}
    </div>
  );
};

export default memo(MasterLayout);
