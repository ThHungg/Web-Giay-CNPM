import { memo, useState } from "react";
import "./index.css";

const Quantity = ({ hasAddToCart = true }) => {
  const [count, setCount] = useState(1);
  return (
    <>
      <div className="space-y-3">
        {hasAddToCart && (<b className="text-2xl">Số lượng:</b>)}
        <div className="flex items-center gap-2">
          <span
            className=" bg-white w-10 h-10 flex justify-center items-center rounded-lg border-2 text-red-500 text-3xl cursor-pointer"
            onClick={() => count > 1 && setCount(count - 1)}
          >
            -
          </span>
          <input
            type="number"
            defaultValue={1}
            value={count}
            readOnly
            className="w-14 h-10 text-center bg-white rounded-lg border-2 text-red-500 text-xl"
          />
          <span
            className="bg-white w-10 h-10 flex justify-center items-center rounded-lg border-2 text-red-500 text-3xl cursor-pointer"
            onClick={() => setCount(count + 1)}
          >
            +
          </span>
        </div>
        {hasAddToCart && (
          <div className="grid grid-rows-2">
            <button
              type="submit"
              className="w-60 h-14 bg-red-500 mt-2 rounded-lg text-xl font-bold"
            >
              Mua ngay
            </button>
            <button
              type="submit"
              className="w-60 h-14 bg-gray-500 mt-2 rounded-lg text-xl font-bold"
            >
              Thêm vào giỏ hàng
            </button>
          </div>
        )}
      </div>
    </>
  );
};
export default memo(Quantity);
