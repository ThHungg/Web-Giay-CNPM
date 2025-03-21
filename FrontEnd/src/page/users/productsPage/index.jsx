import { memo, useState } from "react";
import ncat1 from "../../../assets/users/img/newcategories/ncat1.jpg";
import { ProductCard } from "../../../component";
import { Link } from "react-router-dom";
import { ROUTERS } from "../../../utils/router";
import shoesData from "../../../data.json";
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

  const shoes = shoesData.shoes;

  const brands = ["Adidas", "Nike", "Puma", "Jordan", "Gucci"];
  const sorts = [
    "Giá thấp đến cao",
    "Giá cao đến thấp",
    "Cũ đến mới",
    "Mới đến cũ",
    "Bán chạy nhất",
    "Đang giảm giá",
  ];

  const itemsPerPage = 12;
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(shoes.length / itemsPerPage);
  const currenProducts = shoes.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  return (
    <>
      <div className="max-w-screen-xl mx-auto grid grid-cols-5">
        <div className="col-span-1">
          <div className="">
            <h1 className="text-2xl font-bold">Thương hiệu</h1>
            {brands.map((item, key) => (
              <div
                className="cursor-pointer bg-white max-w-[180px] m-2 p-1 text-center rounded-xl border-2 hover:font-bold"
                key={key}
              >
                {item}
              </div>
            ))}
          </div>
          <div className="">
            <h className="text-2xl font-bold">Mức giá</h>
            <p>Từ: </p>
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
            />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Sắp xếp</h1>
            {sorts.map((item, key) => (
              <div
                className="cursor-pointer bg-white max-w-[180px] m-2 p-1 text-center rounded-xl border-2 hover:font-bold"
                key={key}
              >
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="col-span-4">
          <div className="grid grid-cols-3">
            {/* {currenProducts.map((item, key) => (
                <div className="" key={key}>
                  <ProductCard
                    name={item.name}
                    img={item.img}
                    price={item.price}
                    oldprice={item.oldprice}
                  />
                </div>
              ))} */}

            {/* {currenProducts.map((item, key) => (
              <Link to={`${ROUTERS.USER.DETAILPRODUCT}/${item.id}`} key={key}>
                <div className="">
                  <ProductCard
                    name={item.name}
                    img={item.img}
                    price={item.price}
                    oldprice={item.oldprice}
                  />
                </div>
              </Link>
            ))} */}

            {products?.data?.map((product) => {
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
          <button
            className="px-4 py-2 mx-2 bg-gray-200 rounded disabled:opacity-50"
            onClick={() => setCurrentPage((page) => Math.max(page - 1, 1))}
            disabled={currentPage === 1}
          >
            Trước
          </button>
          <span className="px-4 py-2">
            {currentPage}/{totalPages}
          </span>
          <button
            className="px-4 py-2 mx-2 bg-gray-200 rounded disabled:opacity-50"
            onClick={() =>
              setCurrentPage((page) => Math.min(page + 1, totalPages))
            }
            disabled={currentPage === totalPages}
          >
            Sau
          </button>
        </div>
      </div>
    </>
  );
};

export default memo(Products);
