import { memo, useEffect, useState } from "react";
import formatter from "../../../utils/formatter.jsx";
import Quantity from "../../../component/Quantity/index.jsx";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import StarRating from "../../../component/StarRaint/index.jsx";
import * as productService from "../../../services/productService";
import * as cartService from "../../../services/cartService.js";
import * as reviewService from "../../../services/reviewService.js";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";
import ToastNotification from "../../../component/toastNotification/index.js";
import { useMutationHooks } from "../../../hooks/useMutation.js";
import { useQuery } from "@tanstack/react-query";
import ProductCardV2 from "../../../component/ProductCardV2";
import { ROUTERS } from "../../../utils/router.jsx";
import Carousel from "react-multi-carousel";
import { FaSpinner } from "react-icons/fa";

const DetailProduct = () => {
  const { id } = useParams();
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const navigate = useNavigate();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
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
    images: "",
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
      setProductDetail({
        name: res.data.name,
        price: res.data.price,
        oldPrice: res.data.oldPrice,
        description: res.data.description,
        brand: res.data.brand,
        image: res.data.image,
        images: res.data.images,
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

  const handleBuyNow = () => {
    navigate("/thanh-toan", {
      state: {
        productId: id,
        product: productDetail,
        quantity: quantity,
        selectedSize: selectedSize,
      },
    });
  };

  const fetchRelatedProduct = async () => {
    const res = await productService.getRelated(id);
    const relatedProduct = res.data;
    return relatedProduct;
  };

  const { data: relatedProduct } = useQuery({
    queryKey: ["products"],
    queryFn: fetchRelatedProduct,
  });

  const fetchReviewProduct = async (id) => {
    const res = await reviewService.getReviewProduct(id);
    return res.reviews;
  };

  const { data: reviewProduct, refetch } = useQuery({
    queryKey: ["reviewProduct", id],
    queryFn: () => fetchReviewProduct(id),
  });

  const mutationReview = useMutationHooks((data) =>
    reviewService.addReview(data)
  );

  const { isSuccess: rvSuccess, isError: rvError } = mutationReview;

  const handleReview = (e) => {
    e.preventDefault();
    mutationReview.mutate({
      userId: userId,
      productId: id,
      comment: comment,
      rating: rating,
    });
  };

  useEffect(() => {
    if (rvSuccess) {
      toast.success("Đánh giá thành công");
      mutationReview.reset();
      refetch();
    } else if (rvError) {
      toast.error("Đánh giá thất bại");
      mutationReview.reset();
    }
  }, [rvSuccess, rvError]);

  const [image, setImage] = useState("");
  const [smallImages, setSmallImages] = useState([]);

  useEffect(() => {
    if (productDetail?.image) {
      setImage(productDetail.image);
      setSmallImages([
        "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco,u_126ab356-44d8-4a06-89b4-fcdcc8df0245,c_scale,fl_relative,w_1.0,h_1.0,fl_layer_apply/6ee3bfc0-d21d-4315-a989-4abf91e18ade/JORDAN+TATUM+3+PF.png",
        "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco,u_126ab356-44d8-4a06-89b4-fcdcc8df0245,c_scale,fl_relative,w_1.0,h_1.0,fl_layer_apply/9c38c645-4189-4163-a199-e35f77338a6f/JORDAN+ZION+4+PF.png",
      ]);
    }
  }, [productDetail]);

  const handleImageClick = (newImg) => {
    setSmallImages((prev) => {
      const updatedImages = prev.filter((img) => img !== newImg);
      updatedImages.unshift(image); // Đưa ảnh lớn cũ xuống danh sách ảnh nhỏ
      return updatedImages;
    });
    setImage(newImg); // Cập nhật ảnh lớn
  };

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

  // if (!Array.isArray(relatedProduct) || relatedProduct.length === 0) {
  //   return <div>No related products found.</div>;
  // }

  if (!Array.isArray(relatedProduct) || relatedProduct.length === 0) {
    return (
      <div className="flex justify-center items-center mt-10">
        <FaSpinner className="w-6 h-6 text-gray-500 animate-spin" />
      </div>
    );
  }

  return (
    <>
      <div className="max-w-screen-xl mx-auto mt-5 grid grid-cols-8">
        {/* image first*/}
        <div className="col-span-5">
          <img
            src={image}
            alt="Large product"
            className="h-[500px] w-full object-cover"
          />

          {/* Ảnh nhỏ */}
          <div className="flex justify-center gap-3 mt-2">
            {smallImages.map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`Small image ${index}`}
                className="h-[80px] w-[80px] object-contain cursor-pointer"
                onClick={() => handleImageClick(img)}
              />
            ))}
          </div>
          <Tabs>
            <TabList className="flex justify-center gap-10 border-b pb-2">
              <Tab>
                <h1 className="text-2xl font-bold hover:text-red-600 transition-all">
                  Mô tả sản phẩm
                </h1>
              </Tab>
              <Tab>
                <h1 className="text-2xl font-bold hover:text-red-600 transition-all">
                  Đánh giá
                </h1>
              </Tab>
              <Tab>
                <h1 className="text-2xl font-bold hover:text-red-600 transition-all">
                  Hướng dẫn bảo quản
                </h1>
              </Tab>
            </TabList>

            {/* Mô tả sản phẩm */}
            <TabPanel>
              <h2 className="text-base text-gray-700 leading-relaxed whitespace-pre-line h-[360px] overflow-auto px-3 mt-3">
                {productDetail.description}
              </h2>
            </TabPanel>

            {/* Đánh giá */}
            <TabPanel>
              <div className="grid grid-cols-2 gap-5 mt-4">
                {/* Danh sách đánh giá */}
                <div className="space-y-2 h-[360px] overflow-auto pr-2">
                  <h1 className="text-xl font-bold">Đánh giá sản phẩm</h1>
                  {Array.isArray(reviewProduct) && reviewProduct.length > 0 ? (
                    reviewProduct.map((item) => (
                      <div
                        key={item._id || item.id}
                        className="bg-white border border-gray-300 p-3 rounded-lg shadow-sm"
                      >
                        <h1 className="font-bold text-lg">
                          {item.userId?.name || "Người dùng ẩn danh"}
                        </h1>
                        <div className="text-yellow-500 font-bold text-lg">
                          {"★".repeat(item.rating || 0)}
                        </div>
                        <p className="text-gray-700 mt-1">
                          {item.comment || "Không có nội dung đánh giá."}
                        </p>
                      </div>
                    ))
                  ) : (
                    <div className="text-center text-gray-500 mt-3">
                      Chưa có đánh giá nào
                    </div>
                  )}
                </div>

                {/* Form đánh giá */}
                <div className="bg-white border border-gray-200 p-4 rounded-lg shadow-md">
                  <h1 className="text-xl font-bold mb-3">
                    Viết đánh giá của bạn
                  </h1>
                  <textarea
                    placeholder="Nhập đánh giá..."
                    className="w-full border border-gray-300 p-2 rounded-lg mb-3"
                    rows="3"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  />
                  <StarRating rating={rating} setRating={setRating} />
                  <button
                    onClick={handleReview}
                    className="w-full bg-black text-white font-bold p-2 rounded-lg mt-3"
                  >
                    Gửi đánh giá
                  </button>
                </div>
              </div>
            </TabPanel>

            {/* Hướng dẫn bảo quản */}
            <TabPanel>
              <ul className="list-disc space-y-2 text-lg text-gray-700 pl-6 mt-4 h-[360px] overflow-auto">
                <li className="hover:text-black transition-all">
                  Vệ sinh bằng khăn mềm
                </li>
                <li className="hover:text-black transition-all">
                  Tránh vật sắc nhọn và nơi có nhiệt độ cao
                </li>
                <li className="hover:text-black transition-all">
                  Tránh tiếp xúc với môi trường xăng dầu, kiềm
                </li>
                <li className="hover:text-black transition-all">
                  Không phơi sản phẩm nơi ánh nắng gắt
                </li>
                <li className="hover:text-black transition-all">
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
              <b>Tình trạng: </b> <span>{productDetail.status}</span>
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
              onClick={handleBuyNow}
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
      <div className="max-w-screen-xl mx-auto">
        <h1 className="text-3xl font-bold mt-5 flex justify-center items-center">
          Sản phẩm liên quan
        </h1>
        <Carousel
          responsive={responsive}
          infinite={true}
          autoPlay={true}
          autoPlaySpeed={3000}
          removeArrowOnDeviceType={["tablet", "mobile"]}
        >
          {relatedProduct.map((product) => (
            <Link
              key={product._id}
              to={`${ROUTERS.USER.DETAILPRODUCT}/${product._id}`}
              // onClick={() => window.location.reload()}
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
      <ToastNotification />
    </>
  );
};

export default memo(DetailProduct);
