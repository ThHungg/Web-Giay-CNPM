import { memo, useState } from "react";
import { ProductCard } from "../../../component";
import { Link } from "react-router-dom";
import { ROUTERS } from "../../../utils/router";
import * as productService from "../../../services/productService";
import { useQuery } from "@tanstack/react-query";
const Products = () => {
  const fetchProductAll = async () => {
    const res = await productService.getAllProduct();
    return res;
  };
  const { isLosading, data: products } = useQuery({
    queryKey: ["products"],
    queryFn: fetchProductAll,
    retry: 3,
    retryDelay: 1000,
  });

  const brands = ["Adidas", "Nike", "Vans", "Air Jordan", "MLB", "Converse"];
  const sorts = [
    "Giá thấp đến cao",
    "Giá cao đến thấp",
    "Cũ đến mới",
    "Mới đến cũ",
    "Bán chạy nhất",
    "Đang giảm giá",
  ];

  const [currentPage, setCurrentPage] = useState(1);
  const [selectedBrand, setSelectedBrand] = useState("");
  const [priceRange, setPriceRange] = useState("");
  const itemsPerPage = 12;

  const handlePriceFilter = (range) => {
    setPriceRange((prev) => (prev === range ? "" : range)); // Nếu đang chọn thì bỏ chọn, nếu chưa chọn thì chọn
    setCurrentPage(1);
  };

  const filterProductsByPrice = (products) => {
    if (priceRange === "under1M") {
      return products.filter((product) => product.price < 1000000);
    }
    if (priceRange === "1Mto2M") {
      return products.filter(
        (product) => product.price >= 1000000 && product.price <= 2000000
      );
    }
    if (priceRange === "2Mto3M") {
      return products.filter(
        (product) => product.price >= 2000000 && product.price <= 3000000
      );
    }
    if (priceRange === "above3M") {
      return products.filter((product) => product.price > 3000000);
    }
    return products;
  };

  const filteredProducts = selectedBrand
    ? products?.data.filter((product) => product.brand === selectedBrand)
    : products?.data;

  const handleBrandClick = (selectedBrand) => {
    setSelectedBrand(selectedBrand);
    setCurrentPage(1); // Đặt lại trang khi thay đổi thương hiệu
  };

  // Áp dụng bộ lọc giá sau khi lọc theo thương hiệu
  const filteredByPrice = filterProductsByPrice(filteredProducts);

  const totalPages = filteredByPrice?.length
    ? Math.ceil(filteredByPrice.length / itemsPerPage)
    : 0;

  const currentProducts =
    filteredByPrice?.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    ) || [];

  return (
    <>
      <div className="max-w-screen-xl mx-auto grid grid-cols-5">
        <div className="col-span-1">
          <div className="">
            <h1 className="text-2xl font-bold">Thương hiệu:</h1>
            <select
              className="border w-full p-2 rounded-lg"
              name="brand"
              onClick={(e) => handleBrandClick(e.target.value)}
            >
              <option value="">Thương hiệu</option>
              {brands.map((item, key) => (
                <option value={item} key={key}>
                  {item}
                </option>
                // <div
                //   className="cursor-pointer bg-white max-w-[180px] m-2 p-1 text-center rounded-xl border-2 hover:font-bold"
                //   key={key}
                // >
                //   {item}
                // </div>
              ))}
            </select>
          </div>
          <div className="">
            <h className="text-2xl font-bold">Mức giá:</h>
            <div className="flex gap-4 mt-2 flex-col">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="priceFilter"
                  value="under1M"
                  className="w-4 h-4"
                  onClick={() => handlePriceFilter("under1M")}
                  checked={priceRange === "under1M"} // Kiểm tra nếu giá trị đang chọn trùng với giá trị của radio
                />
                Dưới 1.000.000 đ
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="priceFilter"
                  value="1Mto2M"
                  className="w-4 h-4"
                  onClick={() => handlePriceFilter("1Mto2M")}
                  checked={priceRange === "1Mto2M"}
                />
                1.000.000 đ - 2.000.000 đ
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="priceFilter"
                  value="2Mto3M"
                  className="w-4 h-4"
                  onClick={() => handlePriceFilter("2Mto3M")}
                  checked={priceRange === "2Mto3M"}
                />
                2.000.000 đ - 3.000.000 đ
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="priceFilter"
                  value="above3M"
                  className="w-4 h-4"
                  onClick={() => handlePriceFilter("above3M")}
                  checked={priceRange === "above3M"}
                />
                Trên 3.000.000 đ
              </label>
            </div>
            {/* <p>Từ: </p>
            <input
              type="number"
              min={0}
              className="text-center border-2 my-2 "
            />
            <p>Đến: </p>
            <input
              type="number"
              min={0}
              className="text-center border-2 my-2 "
            /> */}
          </div>
          {/* <div>
            <h1 className="text-2xl font-bold">Sắp xếp</h1>
            {sorts.map((item, key) => (
              <div
                className="cursor-pointer bg-white max-w-[180px] m-2 p-1 text-center rounded-xl border-2 hover:font-bold"
                key={key}
              >
                {item}
              </div>
            ))}
          </div> */}
        </div>

        <div className="col-span-4">
          <div className="grid grid-cols-3">
            {currentProducts.map((product) => {
              return (
                <div className="">
                  <Link to={`${ROUTERS.USER.DETAILPRODUCT}/${product._id}`}>
                    <ProductCard
                      key={product.id}
                      name={product.name}
                      img={product.image}
                      price={product.price}
                      oldprice={product.oldprice}
                      discount={product.discount}
                    />
                  </Link>
                </div>
              );
            })}
          </div>
          {/* Pagination */}
          <div className="mt-5 flex justify-end">
            <button
              className="px-4 py-2 mx-2 bg-gray-200 rounded disabled:opacity-50"
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Trước
            </button>
            <span className="px-4 py-2">
              {currentPage}/{totalPages}
            </span>
            <button
              className="px-4 py-2 mx-2 bg-gray-200 rounded disabled:opacity-50"
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Sau
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default memo(Products);
