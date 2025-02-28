import { memo } from "react";
import ncat1 from "../../../assets/users/img/newcategories/ncat1.jpg";
import ncat2 from "../../../assets/users/img/newcategories/ncat2.jpg";
import ncat2_1 from "../../../assets/users/img/newcategories/ncat2.jpg";
import ncat2_2 from "../../../assets/users/img/newcategories/ncat2.jpg";
import formatter from "../../../utils/formatter.jsx";
import Quantity from "../../../component/Quantity/index.jsx";
import shoesData from "../../../data.json";
import { useParams } from "react-router-dom";
import { ProductCard } from "../../../component/index.jsx";
import Carousel from "react-multi-carousel";

const DetailProduct = () => {
  const { id } = useParams();
  const product = shoesData.shoes.find((item) => item.id === Number(id));
  const relateProducts = shoesData.shoes;
  console.log(relateProducts);
  const imgs = [ncat2, ncat1, ncat2_2];

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
  return (
    <>
      <div className="max-w-screen-xl mx-auto mt-5 grid grid-cols-6">
        {/* image first*/}
        <div className="col-span-4 mx-auto">
          <img
            src={product.img}
            alt=""
            className="h-[500px] w-[800px] object-cover"
          />
          <div className="flex justify-center gap-3 mt-2">
            {imgs.map((item, key) => (
              <img
                src={item}
                alt=""
                key={key}
                className="h-[80px] w-[80px] object-contain"
              />
            ))}
          </div>
        </div>
        {/* image end*/}
        <div className="col-span-2 ml-3">
          <h1 className="uppercase text-4xl font-bold">{product.name}</h1>
          <ul>
            <li className="text-xl">
              <b>Mã SP: </b> <span>{product.id}</span>
            </li>
          </ul>
          <div className="flex gap-5 items-center">
            <h1 className="text-red-500 font-bold text-2xl">
              {formatter(product.price)}
            </h1>
            <h1 className="text-gray-500 opacity-70 font-bold text-xl line-through">
              {formatter(product.oldprice)}
            </h1>
          </div>
          <ul>
            <li className="text-xl">
              <b>Tình trạng: </b> <span>Còn hàng</span>
            </li>
            <li className="text-xl">
              <b>Size: </b>
            </li>
          </ul>
          <Quantity />
        </div>
      </div>
      <div className="max-w-screen-xl mx-auto mt-5 text-center">
        <div className="mx-[100px]">
          <h1 className="text-3xl font-bold">Mô tả sản phẩm</h1>
          <p className="text-xl">
            Giày Air Jordan 1 Low ‘White Dune Red’ FJ3459-160 đem đến sự tinh tế
            và phong cách đặc trưng của dòng sản phẩm Jordan. Với chất liệu da
            cao cấp và thiết kế độc đáo, đôi giày này kết hợp màu trắng trang
            nhã với điểm nhấn màu đỏ dune tạo nên sự cá tính và thu hút. Thiết
            kế đa lớp của phần thân giày tạo độ sâu và phong phú trong hình
            thức. Logo Jumpman nổi bật ở ngực giày và mũi giày, thêm phần sang
            trọng và đẳng cấp cho đôi giày này. Đế được thiết kế để cung cấp sự
            thoải mái và bền bỉ, phản ánh sự chăm chỉ trong sản xuất. Với màu
            sắc và kiểu dáng độc đáo, Air Jordan 1 Low ‘White Dune Red’
            FJ3459-160 là sự lựa chọn lý tưởng cho những người ưa chuộng phong
            cách thể thao và đường phố. Sự kết hợp hoàn hảo giữa phong cách và
            tiện ích, đôi giày này là điểm nhấn thú vị trong bộ sưu tập sneaker
            của bạn.
          </p>
        </div>
        <div>
          <h1 className="text-3xl font-bold ">Sản phẩm liên quan</h1>
          {/* {relateProducts.map((item, key) => (
            <div key={key} className="text-center">
              <img
                src={item.img}
                alt={item.name}
                className="h-[150px] w-full object-contain"
              />
              <p className="mt-2 font-semibold">{item.name}</p>
            </div>
          ))} */}
          <Carousel responsive={responsive}>
            {relateProducts.map((item, key) => (
              <div key={key}>
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
      </div>
    </>
  );
};

export default memo(DetailProduct);
