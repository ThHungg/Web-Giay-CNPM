import { memo } from "react";
import "./index.css";

const Quantity = ({ quantity, setQuantity }) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <span
          className="bg-white w-10 h-10 flex justify-center items-center rounded-lg border-2 text-red-500 text-3xl cursor-pointer"
          onClick={() => setQuantity(Math.max(1, quantity - 1))}
        >
          -
        </span>
        <input
          type="number"
          value={quantity}
          readOnly
          className="w-14 h-10 text-center bg-white rounded-lg border-2 text-red-500 text-xl"
        />
        <span
          className="bg-white w-10 h-10 flex justify-center items-center rounded-lg border-2 text-red-500 text-3xl cursor-pointer"
          onClick={() => setQuantity(quantity + 1)}
        >
          +
        </span>
      </div>
    </div>
  );
};

export default memo(Quantity);
