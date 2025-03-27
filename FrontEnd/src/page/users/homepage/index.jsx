import { memo } from "react";
import { FaShippingFast } from "react-icons/fa";
import { MdOutlinePayment, MdSupportAgent } from "react-icons/md";
import { RiRefund2Line } from "react-icons/ri";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import Adidas from "../../../assets/users/img/brands/Adidas.webp";
import Jordan from "../../../assets/users/img/brands/Jordan.png";
import Nike from "../../../assets/users/img/brands/Nike.png";
import Puma from "../../../assets/users/img/brands/Puma.png";
import "./index.css";
import { ProductCard } from "../../../component";
import { useQuery } from "@tanstack/react-query";
import * as productService from "../../../services/productService";
import { Link } from "react-router-dom";
import { ROUTERS } from "../../../utils/router";

const HomePage = () => {
  const fetchProductAll = async () => {
    const res = await productService.getActiveProducts();
    const products = res.data || [];

    // Lấy 5 sản phẩm đầu tiên (nếu API trả về các sản phẩm đã sắp xếp đúng)
    return products.slice(0, 5);
  };

  const { data: products } = useQuery({
    queryKey: ["products"],
    queryFn: fetchProductAll,
    retry: 3,
    retryDelay: 1000,
  });

  if (!Array.isArray(products)) {
    return <div>Invalid data format</div>;
  }

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
        <Carousel responsive={responsive}>
          {/* {sliderItems.map((item, key) => (
            <div className="bg-white max-h-[380px] mx-2 rounded-xl pt-1">
              <div
                className="h-[270px] m-2 bg-white rounded-xl"
                style={{
                  backgroundImage: `url(${item.bgImg})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
                key={key}
              ></div>
              <p className="text-center mt-2 text-lg font-semibold pb-2 pt-2">
                {item.name}
              </p>
            </div>
          ))} */}
          {products.map((product) => (
            <Link to={`${ROUTERS.USER.DETAILPRODUCT}/${product._id}`}>
              <ProductCard
                key={product.id}
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
        {/* <div className="grid grid-cols-4">
          {products.map((item, key) => (
            <div className="" key={key}>
              <ProductCard
                name={item.name}
                img={item.img}
                price={item.price}
                oldprice={item.oldprice}
              />
            </div>
          ))}
        </div> */}
        <Carousel responsive={responsive}>
          <ProductCard></ProductCard>
          <ProductCard></ProductCard>
          <ProductCard></ProductCard>
          <ProductCard></ProductCard>
          <ProductCard></ProductCard>
        </Carousel>
      </div>

      {/* Brands */}
      <div className="max-w-screen-xl mx-auto mt-5">
        <div className="text-center text-3xl font-bold">Thương hiệu</div>
        <div className="flex justify-center">
          <img
            src={Adidas}
            alt=""
            className="h-[200px] w-[240px] object-contain mx-auto"
          />
          <img
            src={Nike}
            alt=""
            className="h-[200px] w-[240px] object-contain mx-auto"
          />
          <img
            src={Jordan}
            alt=""
            className="h-[200px] w-[240px] object-contain mx-auto"
          />
          <img
            src={Puma}
            alt=""
            className="h-[200px] w-[240px] object-contain mx-auto"
          />
        </div>
      </div>
    </>
  );
};

export default memo(HomePage);
