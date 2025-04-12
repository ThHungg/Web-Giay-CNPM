import { memo } from "react";
import formatter from "../../utils/formatter";

const ProductsCard = ({
  img,
  name,
  price,
  discount,
  oldprice,
  totalStock,
  rating,
}) => {
  const isSoldOut = totalStock === 0;

  return (
    <div className="m-3 bg-white w-[360px] h-[430px] rounded-xl p-3 shadow-lg hover:shadow-xl transition duration-300">
      {/* Ảnh sản phẩm */}
      <div className="relative w-full h-[260px] overflow-hidden rounded-lg">
        <img
          src={img}
          alt={name}
          className={`w-full h-full object-contain transition-opacity duration-300 ${
            isSoldOut ? "opacity-30" : ""
          }`}
        />
        {/* Tag giảm giá */}
        {discount > 0 && (
          <div className="absolute top-2 right-2 bg-red-600 text-white text-sm font-bold px-2 py-1 rounded-md shadow-md">
            -{discount}%
          </div>
        )}

        {/* Tag Sold Out */}
        {isSoldOut && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-lg">
            <span className="text-white text-2xl font-bold uppercase">
              Sold Out
            </span>
          </div>
        )}
      </div>
      {/* <div className="text-yellow-500 font-bold">
        {"★".repeat(rating || 0)}{" "}
      </div> */}

      {/* Thông tin sản phẩm */}
      <div className="mt-4 text-center space-y-2">
        <h2 className="text-lg font-semibold text-gray-800 hover:text-red-500 transition duration-300">
          {name}
        </h2>

        <div className="flex justify-center items-center gap-2">
          <span className="text-red-600 text-xl font-bold">
            {formatter(price)}
          </span>
          {discount > 0 && (
            <span className="text-gray-400 line-through text-sm">
              {formatter(oldprice)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default memo(ProductsCard);
