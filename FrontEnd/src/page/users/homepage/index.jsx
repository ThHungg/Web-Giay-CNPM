import { memo } from "react";
import { FaShippingFast, FaSpinner } from "react-icons/fa";
import { MdOutlinePayment, MdSupportAgent } from "react-icons/md";
import { RiRefund2Line } from "react-icons/ri";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import Adidas from "../../../assets/users/img/brands/Adidas.webp";
import Jordan from "../../../assets/users/img/brands/Jordan.png";
import Nike from "../../../assets/users/img/brands/Nike.png";
import Puma from "../../../assets/users/img/brands/Puma.png";
import "./index.css";
import { useQuery } from "@tanstack/react-query";
import * as productService from "../../../services/productService";
import { Link } from "react-router-dom";
import { ROUTERS } from "../../../utils/router";
import ProductCardV2 from "../../../component/ProductCardV2";
import * as brandService from "../../../services/brandService";

const HomePage = () => {
  const fetchProductAll = async () => {
    const res = await productService.getActiveProducts();
    const products = res.data || [];
    return products.slice(0, 5);
  };

  const { data: brands = [], refetch } = useQuery({
    queryKey: ["brand"],
    queryFn: async () => {
      const res = await brandService.getActiveBrand();
      return res.data;
    },
  });

  console.log("brands", brands);

  const { data: products } = useQuery({
    queryKey: ["products"],
    queryFn: fetchProductAll,
    retry: 3,
    retryDelay: 1000,
  });

  const fetchTopSell = async () => {
    const res = await productService.getTopSell();
    return res;
  };

  const { data: topSell } = useQuery({
    queryKey: ["topSellingProducts"],
    queryFn: fetchTopSell,
    retry: 3,
    retryDelay: 1000,
  });

  const responsive = {
    superLargeDesktop: {
      breakpoint: { max: 4000, min: 3000 },
      items: 5,
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 4,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 2,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
    },
  };

  if (!Array.isArray(products)) {
    return (
      <div className="flex justify-center items-center mt-10">
        <FaSpinner className="w-6 h-6 text-gray-500 animate-spin" />
      </div>
    );
  }

  if (!Array.isArray(topSell?.data)) {
    return (
      <div className="flex justify-center items-center mt-10">
        <FaSpinner className="w-6 h-6 text-gray-500 animate-spin" />
      </div>
    );
  }

  return (
    <>
      <div className="bg-white max-w-screen-xl min-h-[150px] mx-auto mt-6 grid grid-cols-4 items-center rounded-2xl">
        <div className="ml-5 text-center flex flex-col items-center">
          <i className="text-3xl">
            <FaShippingFast />
          </i>
          <p>Vận chuyển nhanh chóng</p>
        </div>
        <div className="ml-5 text-center flex flex-col items-center">
          <i className="text-3xl">
            <RiRefund2Line />
          </i>
          <p>Chính sách hoàn trả</p>
        </div>

        <div className="ml-5 text-center flex flex-col items-center">
          <i className="text-3xl">
            <MdSupportAgent />
          </i>
          <p>Hỗ trợ 24/7</p>
        </div>

        <div className="ml-5 text-center flex flex-col items-center">
          <i className="text-3xl">
            <MdOutlinePayment />
          </i>
          <p>Phương thức thanh toán</p>
        </div>
      </div>
      {/* Categories New */}
      <div className="max-w-screen-xl mx-auto mt-5">
        <h1 className="text-4xl text-center font-bold my-10">Sản phẩm mới</h1>
        <Carousel
          responsive={responsive}
          infinite={true}
          autoPlay={true}
          autoPlaySpeed={3000}
          removeArrowOnDeviceType={["tablet", "mobile"]}
        >
          {products.map((product) => (
            <Link
              key={product._id}
              to={`${ROUTERS.USER.DETAILPRODUCT}/${product._id}`}
            >
              <ProductCardV2
                name={product.name}
                img={product.image}
                price={product.price}
                oldprice={product.oldPrice}
                discount={product.discount}
              />
            </Link>
          ))}
        </Carousel>
      </div>
      {/* Featured Products */}
      <div className="max-w-screen-xl mx-auto mt-5">
        <h1 className="text-4xl text-center font-bold my-10">Sản nổi bật</h1>
        <Carousel
          responsive={responsive}
          infinite={true}
          autoPlay={true}
          autoPlaySpeed={2500}
          removeArrowOnDeviceType={["tablet", "mobile"]}
        >
          {topSell?.data.map((product) => (
            <Link
              key={product._id}
              to={`${ROUTERS.USER.DETAILPRODUCT}/${product._id}`}
            >
              <div className="transition-transform transform hover:scale-105 duration-300">
                <ProductCardV2
                  name={product.name}
                  img={product.image}
                  price={product.price}
                  oldprice={product.oldPrice}
                  discount={product.discount}
                />
              </div>
            </Link>
          ))}
        </Carousel>
      </div>

      <div className="max-w-screen-xl mx-auto mt-5">
        <div className="text-center text-3xl font-bold mb-4">Thương hiệu</div>
        <Carousel
          responsive={responsive}
          infinite={true}
          autoPlay={true}
          autoPlaySpeed={2500}
          removeArrowOnDeviceType={["tablet", "mobile"]}
        >
          {brands.map((brand, index) => (
            <Link to={ROUTERS.USER.PRODUCTS}>
              <div key={index} className="flex justify-center">
                <img
                  src={brand.image}
                  value={brand.brand}
                  alt={`brand-${index}`}
                  className="h-[200px] w-[240px] object-contain mx-auto"
                />
              </div>
            </Link>
          ))}
        </Carousel>
      </div>
    </>
  );
};

export default memo(HomePage);
