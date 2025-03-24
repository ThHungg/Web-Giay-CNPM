import { memo, useEffect, useState } from "react";
import formatter from "../../../utils/formatter.jsx";
import Quantity from "../../../component/Quantity/index.jsx";
import { useParams } from "react-router-dom";
import { ProductCard } from "../../../component/index.jsx";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import StarRating from "../../../component/StarRaint/index.jsx";
import * as productService from "../../../services/productService";
import * as cartService from "../../../services/cartService.js";
import * as orderService from "../../../services/orderService.js";
import { useSelector } from "react-redux";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";
import ToastNotification from "../../../component/toastNotification/index.js";
import { useMutationHooks } from "../../../hooks/useMutation.js";
import Loading from "../../../component/Loading/index.js";

const DetailProduct = () => {
  const { id } = useParams();
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);

  const token = localStorage.getItem("access_token");
  let userId;

  if (token) {
    const decoded = jwtDecode(token);
    userId = decoded.id;
  }

  const mutationAddToCart = useMutationHooks(
    async ({ userId, productId, size, quantity, price }) => {
      const res = await cartService.addToCart(
        userId,
        productId,
        size,
        quantity,
        price
      );
      return res;
    }
  );

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast("Vui lòng chọn size!");
    }
    mutationAddToCart.mutate({
      userId: userId,
      productId: id,
      size: selectedSize,
      quantity: quantity,
      price:
        productDetail.discount > 0
          ? productDetail.price * (1 - productDetail.discount / 100)
          : productDetail.price,
    });
  };

  useEffect(() => {
    if (mutationAddToCart.isSuccess) {
      toast("Thêm vào giỏ hàng thành công:", mutationAddToCart.data);
    }
  }, [mutationAddToCart.isSuccess, mutationAddToCart.isError]);

  // const handleAddToCart = async () => {
  //   if (!selectedSize) {
  //     toast("Vui lòng chọn size");
  //   }

  //   const cartIem = {
  //     userId,
  //     productId: id,
  //     size: selectedSize,
  //     quantity,
  //     price: productDetail.price,
  //   };
  //   console.log("CartItem", cartIem);
  //   console.log("CartItem gửi lên:", JSON.stringify(cartIem, null, 2));

  //   try {
  //     await cartService.addToCart(cartIem);
  //     toast("Thêm vào giỏ hàng thành công!");
  //   } catch (error) {
  //     console.error("Lỗi thêm vào giỏ hàng:", error);
  //     toast("Có lỗi xảy ra, vui lòng thử lại.");
  //   }
  // };

  const [productDetail, setProductDetail] = useState({
    name: "",
    price: "",
    description: "",
    brand: "",
    image: "",
    discount: "",
    sizeStock: [],
  });

  const fetchGetDetailsProduct = async (id) => {
    const res = await productService.getDetailsProduct(id);
    if (res?.data) {
      setProductDetail({
        name: res?.data?.name,
        price: res?.data?.price,
        description: res?.data?.description,
        brand: res?.data?.brand,
        image: res?.data?.image,
        discount: res?.data?.discount,
        sizeStock: res?.data?.sizeStock || [],
      });
    }
  };

  useEffect(() => {
    if (id) {
      fetchGetDetailsProduct(id);
    }
  }, [id]);

  // const handleBuyNow = async () => {
  //   if (!selectedSize) {
  //     toast("Vui lòng chọn size");
  //     return;
  //   }

  //   const orderData = {
  //     userId: userId, // Giữ nguyên userId không lồng thêm object
  //     items: [
  //       {
  //         productId: id,
  //         size: selectedSize,
  //         quantity: quantity,
  //         price:
  //           productDetail.discount > 0
  //             ? productDetail.price * (1 - productDetail.discount / 100)
  //             : productDetail.price,
  //       },
  //     ],
  //   };

  //   try {
  //     const res = await orderService.createOrder(
  //       orderData.userId,
  //       orderData.items
  //     );
  //     if (res.success) {
  //       toast("Đặt hàng thành công!");
  //     } else {
  //       toast("Đặt hàng thất bại, vui lòng thử lại!");
  //     }
  //   } catch (error) {
  //     console.error("Lỗi khi đặt hàng:", error);
  //     toast("Lỗi kết nối, vui lòng thử lại!");
  //   }
  // };

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
  return (
    <>
      <ToastNotification />
      <div className="max-w-screen-xl mx-auto mt-5 grid grid-cols-8">
        {/* image first*/}
        <div className="col-span-5 mx-auto">
          <img
            src={productDetail.image}
            alt=""
            className="h-[500px] w-[800px] object-cover"
          />
          <div className="flex justify-center gap-3 mt-2">
            <img
              src={productDetail.image}
              alt=""
              className="h-[80px] w-[80px] object-contain"
            />
          </div>
          <Tabs >
            <TabList className="flex justify-center">
              <Tab>
                <h1 className="text-2xl font-bold">Mô tả sản phẩm</h1>
              </Tab>
              <Tab>
                <h1 className="text-2xl font-bold">Đánh giá</h1>
              </Tab>
              <Tab>
                <h1 className="text-2xl font-bold">Hướng dẫn bảo quản</h1>
              </Tab>
            </TabList>

            <TabPanel>
              <h2 className="text-lg text-gray-700 leading-relaxed">
                {productDetail.description}
              </h2>
            </TabPanel>
            <TabPanel>
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
            <TabPanel>
              <ul className="list-disc space-y-2 text-lg text-gray-700 pl-5">
                <li className="hover:text-black transition-all duration-200">
                  Vệ sinh bằng khăn mềm
                </li>
                <li className="hover:text-black transition-all duration-200">
                  Tránh vật sắc nhọn và nơi có nhiệt độ cao
                </li>
                <li className="hover:text-black transition-all duration-200">
                  Tránh tiếp xúc với môi trường xăng dầu, kiềm
                </li>
                <li className="hover:text-black transition-all duration-200">
                  Không phơi sản phẩm nơi ánh nắng gắt
                </li>
                <li className="hover:text-black transition-all duration-200">
                  Để nơi khô thoáng khi không sử dụng
                </li>
              </ul>
            </TabPanel>
          </Tabs>
        </div>
        {/* image end*/}

        <div className="col-span-3 ml-3 sticky top-5 self-start">
          <h1 className="uppercase text-4xl font-bold w-full">
            {productDetail.name}
            {productDetail.discount > 0 && (
              <span className="text-red-500 text-2xl font-semibold m-5 inline-block">
                - {productDetail.discount} %
              </span>
            )}
          </h1>

          <ul>
            <li className="text-xl">
              <b>Mã SP: </b> <span></span>
            </li>
          </ul>
          <div className="flex gap-5 items-center">
            <h1 className="text-red-500 font-bold text-2xl">
              {formatter(
                productDetail.discount > 0
                  ? productDetail.price * (1 - productDetail.discount / 100)
                  : productDetail.price
              )}
              {/* {formatter(productDetail.price)} */}
            </h1>
            <h1 className="text-gray-500 opacity-70 font-bold text-xl line-through">
              {productDetail.discount > 0 && formatter(productDetail.price)}
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
          {/* Sizemap */}
          <div className="flex gap-2 items-center">
            {productDetail.sizeStock.map((item, index) => (
              <div key={index} className="relative inline-block">
                <button
                  className={`px-4 py-2 border rounded-lg font-medium transition-all duration-200 ${
                    selectedSize === item.size
                      ? "bg-black text-white shadow-md"
                      : "bg-white hover:bg-gray-100"
                  } ${item.stock === 0 ? "opacity-50 cursor-not-allowed" : ""}`}
                  onClick={() => setSelectedSize(item.size)}
                  disabled={item.stock === 0}
                >
                  {item.size}
                </button>
                {item.stock > 0 && (
                  <span className="absolute top-0 right-0 bg-red-600 text-white text-xs px-2 py-0.5 rounded-full font-bold shadow-md translate-x-1/2 -translate-y-1/2">
                    {item.stock}
                  </span>
                )}
              </div>
            ))}
          </div>
          <div className="my-2 flex justify-center gap-2 flex-col">
            <b className="text-2xl">Số lượng:</b>
            <Quantity quantity={quantity} setQuantity={setQuantity} />
          </div>
          <div className="grid grid-rows-2">
            <button
              type="submit"
              className="w-60 h-14 bg-black text-white mt-2 rounded-md shadow-sm text-xl font-bold"
              // onClick={handleBuyNow}
            >
              Mua ngay
            </button>
            <button
              type="submit"
              className="w-60 h-14 bg-white border border-gray-300 rounded-md shadow-sm mt-2 rounded-lg text-xl font-bold"
              onClick={handleAddToCart}
            >
              Thêm vào giỏ hàng
            </button>
          </div>
        </div>
      </div>
      <div>
        {/* <h1 className="text-3xl font-bold mt-5">Sản phẩm liên quan</h1> */}
        {/* <Carousel responsive={responsive}>
          </Carousel> */}
      </div>
    </>
  );
};

export default memo(DetailProduct);
