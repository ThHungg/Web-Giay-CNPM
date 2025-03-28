import { memo, useEffect, useState } from "react";
import formatter from "../../../utils/formatter.jsx";
import Quantity from "../../../component/Quantity/index.jsx";
import { useParams } from "react-router-dom";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import StarRating from "../../../component/StarRaint/index.jsx";
import * as productService from "../../../services/productService";
import * as cartService from "../../../services/cartService.js";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";
import ToastNotification from "../../../component/toastNotification/index.js";
import { useMutationHooks } from "../../../hooks/useMutation.js";

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
    if (!userId) {
      toast("Vui lòng đăng nhập để mua!");
    } else {
      if (!selectedSize) {
        toast("Vui lòng chọn size!");
      }
    }
    mutationAddToCart.mutate({
      userId: userId,
      productId: id,
      size: selectedSize,
      quantity: quantity,
      price: productDetail.price,
    });
  };

  useEffect(() => {
    if (mutationAddToCart.isSuccess) {
      toast("Thêm vào giỏ hàng thành công:", mutationAddToCart.data);
    }
  }, [mutationAddToCart.isSuccess, mutationAddToCart.isError]);
  const availableSizes = [36, 37, 38, 39, 40, 41, 42];

  const [productDetail, setProductDetail] = useState({
    name: "",
    price: "",
    oldPrice: "",
    description: "",
    brand: "",
    image: "",
    discount: "",
    sizeStock: [],
  });

  const mutation = useMutationHooks(async (data) => {
    const { id, ...rests } = data;
    return await productService.updateProductStatus(id, rests);
  });
  const fetchGetDetailsProduct = async (id) => {
    const res = await productService.getDetailsProduct(id);
    if (res?.data) {
      let updatedStatus = res.data.totalStock === 0 ? "Hết hàng" : "Còn hàng";

      // Cập nhật productDetail ngay lập tức
      setProductDetail({
        name: res.data.name,
        price: res.data.price,
        oldPrice: res.data.oldPrice,
        description: res.data.description,
        brand: res.data.brand,
        image: res.data.image,
        discount: res.data.discount,
        sizeStock: res.data.sizeStock || [],
        totalStock: res.data.totalStock,
        status: updatedStatus, // Cập nhật trạng thái ngay lập tức
      });

      // Nếu trạng thái trên server khác với trạng thái mới -> cập nhật
      if (res.data.status !== updatedStatus) {
        await mutation.mutateAsync({ id, status: updatedStatus });

        // Gọi lại API để đảm bảo UI luôn hiển thị trạng thái mới nhất
        const newRes = await productService.getDetailsProduct(id);
        if (newRes?.data) {
          setProductDetail((prev) => ({
            ...prev,
            status: newRes.data.status,
          }));
        }
      }
    }
  };

  useEffect(() => {
    if (id) {
      fetchGetDetailsProduct(id);
    }
  }, [id]);

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
            className="h-2/6 w-full object-cover"
          />
          <div className="flex justify-center gap-3 mt-2">
            <img
              src={productDetail.image}
              alt=""
              className="h-[80px] w-[80px] object-contain"
            />
          </div>
          <Tabs>
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
              <h2 className="text-lg text-gray-700 leading-relaxed whitespace-pre-line">
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
              {formatter(productDetail.price)}
              {/* {formatter(productDetail.price)} */}
            </h1>
            <h1 className="text-gray-500 opacity-70 font-bold text-xl line-through">
              {productDetail.discount > 0 && formatter(productDetail.oldPrice)}
            </h1>
          </div>
          <ul>
            <li className="text-xl">
              <b>Tình trạng: </b>{" "}
              <span>
                {productDetail.status} 
              </span>
            </li>
            <li className="text-xl">
              <b>Size: </b>
            </li>
          </ul>
          {/* Sizemap */}
          <div className="flex gap-2 items-center">
            {availableSizes.map((size) => {
              const item = productDetail.sizeStock.find((s) => s.size === size);
              const isAvailable = item && item.stock > 0;

              return (
                <div key={size} className="relative inline-block">
                  <button
                    className={`px-4 py-2 border rounded-lg font-medium transition-all duration-200
                    ${
                      selectedSize === size
                        ? "bg-black text-black shadow-md border border-black"
                        : ""
                    }
                    ${
                      isAvailable
                        ? "bg-white hover:bg-gray-100"
                        : "opacity-50 cursor-not-allowed"
                    }`}
                    onClick={() => isAvailable && setSelectedSize(size)}
                    disabled={!isAvailable}
                  >
                    {size}
                  </button>
                  {isAvailable && (
                    <span className="absolute top-0 right-0 bg-red-600 text-white text-xs px-2 py-0.5 rounded-full font-bold shadow-md translate-x-1/2 -translate-y-1/2">
                      {item.stock}
                    </span>
                  )}
                </div>
              );
            })}
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
