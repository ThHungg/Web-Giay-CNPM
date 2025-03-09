import { memo } from "react";

const Header = () => {
  return (
    <>
      <div className="grid grid-cols-12 h-screen">
        <div className="col-span-2 h-full bg-black"></div>
        <div className="col-span-10 bg-yellow-500 h-[40px]"></div>
      </div>
    </>
  );
};

export default memo(Header);
