import { memo } from "react";
import { FaShippingFast } from "react-icons/fa";
import { MdOutlinePayment, MdSupportAgent } from "react-icons/md";
import { RiRefund2Line } from "react-icons/ri";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import ncat1 from "../../../assets/users/img/newcategories/ncat1.jpg";
import ncat2 from "../../../assets/users/img/newcategories/ncat2.jpg";
import Adidas from "../../../assets/users/img/brands/Adidas.webp";
import Jordan from "../../../assets/users/img/brands/Jordan.png";
import Nike from "../../../assets/users/img/brands/Nike.png";
import Puma from "../../../assets/users/img/brands/Puma.png";
import "./index.css";
import shoesData from "../../../data.json";
import { useParams } from "react-router-dom";

import { ProductCard } from "../../../component";
const HomePage = () => {
  const { id } = useParams();
  const product = shoesData.shoes.find((item) => item.id === Number(id));
  const relateProducts = shoesData.shoes;
  const responsive = {
    superLargeDesktop: {
      // the naming can be any, depends on you.
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

  const sliderItems = [
    {
      bgImg: ncat1,
      name: "AF1 Shadow",
    },
    {
      bgImg: ncat2,
      name: "AF1 Shadow",
    },
    {
      bgImg: ncat1,
      name: "AF1 Shadow",
    },
    {
      bgImg: ncat1,
      name: "AF1 Shadow",
    },
    {
      bgImg: ncat1,
      name: "AF1 Shadow",
    },
    {
      bgImg: ncat1,
      name: "AF1 Shadow",
    },
    {
      bgImg: ncat1,
      name: "AF1 Shadow",
    },
  ];
  const products = [
    {
      img: ncat1,
      name: "Nike Air Force 1 Shadow",
      price: "3390000",
      oldprice: "4000000",
    },
    {
      img: ncat1,
      name: "2. Nike Air Force 1 Shadow",
      price: "3390000",
      oldprice: "4000000",
    },

    {
      img: ncat1,
      name: "3. Nike Air Force 1 Shadow",
      price: "3390000",
      oldprice: "4000000",
    },

    {
      img: ncat1,
      name: "4. Nike Air Force 1 Shadow",
      price: "3390000",
      oldprice: "4000000",
    },
  ];

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
          {sliderItems.map((item, key) => (
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
          {relateProducts.map((item, key) => (
            <div key={key} className="m-1">
              <ProductCard
                img={item.img}
                name={item.name}
                price={item.price}
                oldprice={item.price}
              />
            </div>
          ))}
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
