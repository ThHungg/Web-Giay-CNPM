import { memo, useState } from "react";
import { ProductCard } from "../../../component";
import { Link } from "react-router-dom";
import { ROUTERS } from "../../../utils/router";
import * as productService from "../../../services/productService";
import { useQuery } from "@tanstack/react-query";
import { FaSpinner } from "react-icons/fa";
const Products = () => {
  const fetchProductAll = async () => {
    const res = await productService.getActiveProducts();
    return res;
  };
  const { data: products } = useQuery({
    queryKey: ["products"],
    queryFn: fetchProductAll,
    retry: 3,
    retryDelay: 1000,
  });

  const brands = ["Adidas", "Nike", "Vans", "Air Jordan", "MLB", "Converse"];

  const [currentPage, setCurrentPage] = useState(1);
  const [selectedBrand, setSelectedBrand] = useState("");
  const [priceRange, setPriceRange] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const itemsPerPage = 12;

  const handlePriceFilter = (range) => {
    setPriceRange((prev) => (prev === range ? "" : range));
    setCurrentPage(1);
  };

  const filterProductsByPrice = (products) => {
    if (priceRange === "under1M") {
      return products.filter((product) => product.price < 1000000);
    }
    if (searchTerm) {
      return products.filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
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

  if (Array.isArray(products)) {
    return (
      <div className="flex justify-center items-center mt-10">
        <FaSpinner className="w-6 h-6 text-gray-500 animate-spin" />
      </div>
    );
  }

  return (
    <>
      <div className="max-w-screen-xl mx-auto grid grid-cols-5">
        <div className="col-span-1 mt-5 bg-white p-4 rounded-lg shadow-md h-[450px] sticky top-5 self-start">
          {/* Bộ lọc theo thương hiệu */}
          <div className="mb-5 flex flex-col gap-2">
            <div>
              <h1 className="text-2xl font-bold">Tìm kiếm:</h1>
              <input
                type="search"
                className="w-full p-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
                placeholder="Tìm kiếm sản phẩm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value.toLowerCase())}
              />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Thương hiệu:</h1>
              <select
                className="border w-full p-2 rounded-lg mt-2"
                name="brand"
                onChange={(e) => handleBrandClick(e.target.value)}
              >
                <option value="">Chọn thương hiệu</option>
                {brands.map((item, key) => (
                  <option value={item} key={key}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Bộ lọc theo mức giá */}
          <div>
            <h1 className="text-2xl font-bold">Mức giá:</h1>
            <div className="flex gap-4 mt-2 flex-col">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="priceFilter"
                  value="under1M"
                  className="w-4 h-4"
                  onClick={() => handlePriceFilter("under1M")}
                  checked={priceRange === "under1M"}
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
          </div>
        </div>

        <div className="col-span-4">
          <div className="grid grid-cols-3">
            {currentProducts.map((product) => {
              return (
                <Link to={`${ROUTERS.USER.DETAILPRODUCT}/${product._id}`}>
                  <div className="flex justify-center items-center transition-transform transform hover:scale-105 duration-300">
                    <ProductCard
                      key={product.id}
                      totalStock={product.totalStock}
                      name={product.name}
                      img={product.image}
                      price={product.price}
                      oldprice={product.oldPrice}
                      discount={product.discount}
                      // rating={product.averageRating}
                    />
                  </div>
                </Link>
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
