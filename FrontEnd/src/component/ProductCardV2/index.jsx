import { memo } from "react";
import formatter from "../../utils/formatter";

const ProductsCardV2 = ({
  img,
  name,
  price,
  discount,
  oldprice,
  totalStock,
}) => {
  return (
    <div className="m-3 bg-white w-[300px] h-[400px] rounded-xl py-2 space-y-3 shadow-lg">
      <div className="w-full h-[280px] p-2 overflow-hidden rounded-xl relative">
        <img src={img} alt={name} className="w-full h-full object-contain" />
        {totalStock === 0 && (
          <img
            src="https://www.freeiconspng.com/uploads/sold-out-png-4.png"
            alt="Sold Out"
            className="absolute top-0 left-0 w-full h-full object-contain opacity-75"
          />
        )}
        {discount && (
          <h1 className="absolute top-2 right-2 bg-red-500 text-white text-[16px] font-bold px-2 py-1 rounded-md">
            -{discount}%
          </h1>
        )}
      </div>

      <div className="flex flex-col items-center text-center">
        {/* <ul className="flex gap-3 text-[29px]">
          <li className="hover:bg-red-100 p-2 rounded-lg cursor-pointer">
            <AiOutlineEye />
          </li>
          <li className="hover:bg-red-100 p-2 rounded-lg cursor-pointer">
            <AiOutlineShoppingCart />
          </li>
        </ul> */}

        <div className="space-y-1">
          <div className="mx-5">
            <h1
              to=""
              className="text-[18px] font-bold hover:text-red-500 transition text-center duration-300"
            >
              {name}
            </h1>
          </div>
          <div className="flex justify-center gap-2">
            <h1 className="text-[19px] text-red-500 font-semibold">
              {formatter(price)}
            </h1>
            {discount > 0 && (
              <h1 className="text-[16px] line-through opacity-50">
                {formatter(oldprice)}
              </h1>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(ProductsCardV2);
