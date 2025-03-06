import { memo, useState } from "react";
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
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import StarRating from "../../../component/StarRaint/index.jsx";
const DetailProduct = () => {
  const { id } = useParams();
  const product = shoesData.shoes.find((item) => item.id === Number(id));
  const relateProducts = shoesData.shoes;
  console.log(relateProducts);
  const imgs = [ncat2, ncat1, ncat2_2];
  const [selectedSize, setSelectedSize] = useState(null);

  const sizes = [38, 39, 40, 41, 42, 43, 4];

  const [name, setName] = useState("");
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");

  const reviewer = [
    {
      user: "Đặng Thành Hưng",
      stars: 5,
      text: "Sản phẩm này đi tốt",
    },
    {
      user: "Đặng Thành Hưng",
      stars: 3,
      text: "Sản phẩm chất lượng, đúng như mô tả.",
    },
    {
      user: "Đặng Thành Hưng",
      stars: 1,
      text: "Giao hàng lâu, liên hệ hỗ trợ nhưng phản hồi chậm.",
    },
  ];

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
            {product.oldprice && (
              <h1 className="text-gray-500 opacity-70 font-bold text-xl line-through">
                {formatter(product.oldprice)}
              </h1>
            )}
          </div>
          <ul>
            <li className="text-xl">
              <b>Tình trạng: </b> <span>Còn hàng</span>
            </li>
            <li className="text-xl">
              <b>Size: </b>
            </li>
          </ul>
          {/* Sizemap */}
          <div className="space-y-2">
            {sizes.map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`px-4 py-2 border rounded transition-all duration-300 m-1 ${
                  selectedSize === size
                    ? "text-black border-blue-700"
                    : "bg-white text-black border-gray-400"
                }`}
              >
                {size}
              </button>
            ))}
          </div>
          <div className="my-2 flex justify-center gap-2 flex-col">
            <b className="text-2xl">Số lượng:</b>
            <Quantity />
          </div>
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
        </div>
      </div>
      <div className="max-w-screen-xl mx-auto mt-5 text-center">
        <Tabs>
          <TabList>
            <Tab>
              <h1 className="text-2xl font-bold">Mô tả sản phẩm</h1>
            </Tab>
            <Tab>
              <h1 className="text-2xl font-bold">Đánh giá</h1>
            </Tab>
          </TabList>

          <TabPanel>
            <h2>
              Giày Air Jordan 1 Low ‘White Dune Red’ FJ3459-160 đem đến sự tinh
              tế và phong cách đặc trưng của dòng sản phẩm Jordan. Với chất liệu
              da cao cấp và thiết kế độc đáo, đôi giày này kết hợp màu trắng
              trang nhã với điểm nhấn màu đỏ dune tạo nên sự cá tính và thu hút.
              Thiết kế đa lớp của phần thân giày tạo độ sâu và phong phú trong
              hình thức. Logo Jumpman nổi bật ở ngực giày và mũi giày, thêm phần
              sang trọng và đẳng cấp cho đôi giày này. Đế được thiết kế để cung
              cấp sự thoải mái và bền bỉ, phản ánh sự chăm chỉ trong sản xuất.
              Với màu sắc và kiểu dáng độc đáo, Air Jordan 1 Low ‘White Dune
              Red’ FJ3459-160 là sự lựa chọn lý tưởng cho những người ưa chuộng
              phong cách thể thao và đường phố. Sự kết hợp hoàn hảo giữa phong
              cách và tiện ích, đôi giày này là điểm nhấn thú vị trong bộ sưu
              tập sneaker của bạn.
            </h2>
          </TabPanel>
          <TabPanel>
            {/* <div className="grid grid-cols-2 gap-5">
              <div className="space-y-2">
                <h1 className="text-2xl font-bold">Đánh giá</h1>
                <div className="bg-white border border-black p-2">
                  <h1 className="flex">Đặng Thành Hưng</h1>
                  <div className="flex items-center text-yellow-500 font-bold">
                    ★★★★★
                  </div>
                  <p className="flex">Sản phẩm này đi tốt</p>
                </div>
                <div className="bg-white border border-black p-2">
                  <h1 className="flex">Đặng Thành Hưng</h1>
                  <div className="flex items-center text-yellow-500 font-bold">
                    ★★★
                  </div>
                  <p className="flex">
                    Sản phẩm chất lượng, đúng như mô tả. Rất hài lòng!
                  </p>
                </div>
                <div className="bg-white border border-black p-2">
                  <h1 className="flex">Đặng Thành Hưng</h1>
                  <div className="flex items-center text-yellow-500 font-bold">
                    ★
                  </div>
                  <p className="flex">
                    Giao hàng lâu, liên hệ hỗ trợ nhưng phản hồi chậm.
                  </p>
                </div>
              </div>
              <div className="">
                <h1 className="text-2xl font-bold">Viết đánh giá của bạn</h1>
                <div className="mt-2">
                  <textarea
                    id="review"
                    className="border border-gray-300 p-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows="3"
                  ></textarea>
                </div>

              </div>
            </div> */}

            <div className="grid grid-cols-2 gap-5">
              {/* Danh sách đánh giá */}
              <div className="space-y-2">
                <h1 className="text-2xl font-bold">Đánh giá</h1>
                {reviewer.map((item, index) => (
                  <div
                    key={index}
                    className="bg-white border border-black p-2 rounded-lg"
                  >
                    <h1 className="font-bold">{item.user}</h1>
                    <div className="text-yellow-500 font-bold">
                      {"★".repeat(item.stars)}
                    </div>
                    <p>{item.text}</p>
                  </div>
                ))}
              </div>

              {/* Form nhập đánh giá */}
              <div>
                <h1 className="text-2xl font-bold">Viết đánh giá của bạn</h1>
                <div className="mt-2 space-y-2">
                  {/* <select
                    value={rating}
                    onChange={(e) => setRating(Number(e.target.value))}
                    className="border border-gray-300 p-2 rounded-lg w-full"
                  >
                    {[5, 4, 3, 2, 1].map((num) => (
                      <option key={num} value={num}>
                        {"★".repeat(num)}
                      </option>
                    ))}
                  </select> */}
                  <textarea
                    placeholder="Nhập đánh giá của bạn"
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                    className="border border-gray-300 p-2 rounded-lg w-full"
                    rows="3"
                  ></textarea>
                  <StarRating rating={rating} setRating={setRating} />
                  <button
                    className="w-full bg-blue-500 text-white p-2 rounded-lg"
                    onClick={() => console.log({ name, rating, review })} // Sau này thay bằng API call
                  >
                    Gửi đánh giá
                  </button>
                </div>
              </div>
            </div>
          </TabPanel>
        </Tabs>

        {/* <div className="mx-[100px]">
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
        </div> */}
        <div>
          <h1 className="text-3xl font-bold mt-5">Sản phẩm liên quan</h1>
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
