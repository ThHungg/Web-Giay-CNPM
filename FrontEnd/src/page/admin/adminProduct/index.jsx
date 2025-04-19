import { memo, useState, useMemo, useEffect } from "react";
import { useMutationHooks } from "../../../hooks/useMutation";
import * as productService from "../../../services/productService";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import ToastNotification from "../../../component/toastNotification";
import { Form, Switch } from "antd";
import { useSelector } from "react-redux";
import formatter from "../../../utils/formatter";
import { FaSpinner } from "react-icons/fa";
import { CiEdit } from "react-icons/ci";

const AdminProduct = () => {
  const fetchProductAll = async () => {
    const res = await productService.getAllProduct();
    return res;
  };

  const { data: products, refetch } = useQuery({
    queryKey: ["products"],
    queryFn: fetchProductAll,
  });

  const queryClient = useQueryClient();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [sizeStock, setSizeStock] = useState([{ size: "", stock: "" }]);
  const [sizeList, setSizeList] = useState([{ id: 1 }]);
  // const [sizeList, setSizeList] = useState([{ id: 1 }]);
  const [form] = Form.useForm();
  const [rowSelected, setRowSelected] = useState("");
  const user = useSelector((state) => state.user);
  const brands = ["Adidas", "Nike", "Vans", "Air Jordan", "MLB", "Converse"];
  // const [checked, setChecked] = useState(products ? !products.deletedAt : true);

  const [stateProduct, setSateProduct] = useState({
    name: "",
    price: "",
    description: "",
    brand: "",
    discount: "",
    image: "",
    images: [],
    sizeStock: {
      size: "",
      stock: "",
    },
  });

  const [stateProductDetails, setStateProductDetails] = useState({
    name: "",
    price: "",
    description: "",
    brand: "",
    image: "",
    images: [],
    discount: "",
    sizeStock: [],
  });

  const mutation = useMutationHooks(async (data) => {
    const {
      name,
      price,
      description,
      brand,
      image,
      images,
      discount,
      sizeStock,
    } = data;
    return await productService.createProduct({
      name,
      price,
      description,
      brand,
      image,
      images,
      discount,
      sizeStock,
    });
  });

  const { isSuccess, isError, reset } = mutation;

  useEffect(() => {
    if (isSuccess) {
      toast.success("Thêm thành công");
      reset();
      fetchProductAll();
      queryClient.invalidateQueries("products");
      setShowCreateModal(false);
    } else if (isError) {
      toast.error("Thêm thất bại");
      mutation.reset();
    }
  }, [isSuccess, isError]);

  const onFinish = (e) => {
    e.preventDefault();
    if (mutation.isSuccess) {
      toast.success("Thêm thành công");
      reset();
      fetchProductAll();
      queryClient.invalidateQueries("products");
      setShowCreateModal(false);
    } else if (mutation.isError) {
      toast.error("Thêm thất bại");
      mutation.reset();
    }
    // if (!stateProduct.name.trim())
    //   return toast.error("Vui lòng nhập tên sản phẩm");
    // if (!stateProduct.brand.trim())
    //   return toast.error("Vui lòng chọn thương hiệu");
    // if (!stateProduct.price || stateProduct.price <= 0)
    //   return toast.error("Vui lòng nhập giá hợp lệ");
    // if (stateProduct.discount !== "" || stateProduct.discount < 0)
    //   return toast.error("Vui lòng nhập giảm giá hợp lệ");
    // if (!stateProduct.description.trim())
    //   return toast.error("Vui lòng nhập mô tả sản phẩm");

    mutation.mutate(stateProduct);
  };

  const [checkedItems, setCheckedItems] = useState({});

  const handleChangeSoftDelete = async (checked, id) => {
    setCheckedItems((prev) => ({
      ...prev,
      [id]: checked,
    }));

    try {
      if (checked) {
        await productService.restore(id);
        toast.success("Sản phẩm đã được kích hoạt");
      } else {
        await productService.softDelete(id);
        toast.success("Sản phẩm đã ngừng bán");
      }
    } catch (e) {
      toast.error("Có lỗi xảy ra, vui lòng thử lại!");
    }
  };

  const handleCancel = () => {
    setShowCreateModal(false);
    setShowUpdateModal(false);
    setSateProduct({
      name: "",
      price: "",
      oldPrice: "",
      status: "",
      description: "",
      brand: "",
      image: "",
      images: "",
      discount: "",
      sizeStock: {
        size: "",
        stock: "",
      },
    });
    form.resetFields();
  };

  const handleOnchange = (e, index) => {
    const { name, value } = e.target;

    if (name === "images") {
      const newImages = [...stateProduct.images]; // Sao chép mảng images
      newImages[index] = value; // Cập nhật giá trị của ảnh tại vị trí tương ứng
      setSateProduct({ ...stateProduct, images: newImages });
    } else {
      setSateProduct({ ...stateProduct, [name]: value });
    }
  };

  const handleSizeStockChange = (index, field, value) => {
    setSizeStock((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  };

  useEffect(() => {
    setSateProduct((prev) => ({
      ...prev,
      sizeStock,
    }));
  }, [sizeStock]);

  const addSizeField = (e) => {
    e.preventDefault();
    setSizeList([...sizeList, { id: sizeList.length + 1 }]);
    setSizeStock([...sizeStock, { size: "", stock: "" }]);
  };

  const apartSizeField = (id, e) => {
    e.preventDefault();
    if (sizeList.length > 1) {
      const indexToRemove = sizeList.findIndex((item) => item.id === id);
      setSizeList(sizeList.filter((item) => item.id !== id));
      setSizeStock(sizeStock.filter((_, index) => index !== indexToRemove));
    } else {
      toast.error("Bạn phải để lại ít nhất một size");
    }
  };

  const handleSizeStockChangeDetails = (index, field, value) => {
    setStateProductDetails((prev) => ({
      ...prev,
      sizeStock: prev.sizeStock.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      ),
    }));
  };

  const addSizeFieldDetails = (e) => {
    e.preventDefault();
    setStateProductDetails((prev) => ({
      ...prev,
      sizeStock: [...prev.sizeStock, { size: "", stock: "" }],
    }));
  };

  const apartSizeFieldDetails = (index, e) => {
    e.preventDefault();
    if (stateProductDetails.sizeStock.length > 1) {
      setStateProductDetails((prev) => ({
        ...prev,
        sizeStock: prev.sizeStock.filter((_, i) => i !== index),
      }));
    } else {
      toast("Bạn phải để lại ít nhất một size");
    }
  };

  const handleOnchangeDetails = (e) => {
    setStateProductDetails({
      ...stateProductDetails,
      [e.target.name]: e.target.value,
    });
  };

  const fetchGetDetailsProduct = async (rowSelectedId) => {
    if (!rowSelectedId) {
      return;
    }
    const res = await productService.getDetailsProduct(rowSelectedId);
    if (res?.data) {
      setStateProductDetails({
        name: res?.data?.name,
        price: res?.data?.price,
        oldPrice: res?.data?.oldPrice,
        description: res?.data?.description,
        brand: res?.data?.brand,
        image: res?.data?.image,
        images: res?.data?.images,
        discount: res?.data?.discount,
        sizeStock: res?.data?.sizeStock || [],
      });
    } else {
    }
  };

  useEffect(() => {
    if (rowSelected) {
      fetchGetDetailsProduct(rowSelected);
    }
  }, [rowSelected]);

  useEffect(() => {
    form.setFieldsValue(stateProductDetails);
  }, [stateProductDetails]);

  const handleDetailsProduct = () => {
    if (rowSelected) {
      fetchGetDetailsProduct(rowSelected);
    }
  };

  const mutationUpdate = useMutationHooks(async (data) => {
    const { id, token, ...rests } = data;
    return await productService.updateProduct(id, token, rests);
  });

  const { isSuccess: isSuccessUpdate, isError: isErrorUpdate } = mutationUpdate;

  useEffect(() => {
    if (isSuccessUpdate) {
      toast.success("Cập nhật thành công");
      mutationUpdate.reset();
      setShowUpdateModal(false);
      refetch();
    } else if (isErrorUpdate) {
      toast.error("Thêm thất bại");
      mutationUpdate.reset();
    }
  }, [isSuccessUpdate, isErrorUpdate]);

  const onUpdateProduct = () => {
    setShowUpdateModal(false);
    mutationUpdate.mutate({
      id: rowSelected,
      token: user?.access_token,
      ...stateProductDetails,
    });
  };

  useEffect(() => {
    if (isSuccess) {
      queryClient.invalidateQueries(["products"]);
      fetchGetDetailsProduct(rowSelected);
    }
  }, [isSuccess]);

  const [currentPage, setCurrentPage] = useState(1);
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedDiscount, setSelectedDiscount] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  // const itemsPerPage = 10;

  const [itemsPerPage, setItemsPerPage] = useState(9);

  // useEffect(() => {
  //   const updateItemsPerPage = () => {
  //     const itemHeight = 48; // Giả sử mỗi sản phẩm cao 150px
  //     const availableHeight = window.innerHeight - 200; // Trừ đi header, footer, padding
  //     const items = Math.floor(availableHeight / itemHeight); // Tính số sản phẩm tối đa
  //     setItemsPerPage(items > 0 ? items : 1); // Đảm bảo ít nhất 1 sản phẩm/trang
  //   };

  //   updateItemsPerPage(); // Gọi khi load trang
  //   window.addEventListener("resize", updateItemsPerPage); // Cập nhật khi resize

  //   return () => window.removeEventListener("resize", updateItemsPerPage);
  // }, []);

  const filteredProducts =
    products?.data?.filter((product) => {
      if (selectedBrand && product.brand !== selectedBrand) {
        return false;
      }
      if (selectedDiscount === "discount" && product.discount <= 0) {
        return false;
      }
      if (selectedDiscount === "no-discount" && product.discount > 0) {
        return false;
      }
      if (searchTerm && !product.name.toLowerCase().includes(searchTerm)) {
        return false;
      }
      if (selectedStatus === "Đang bán" && product.deletedAt !== null) {
        return false;
      }
      if (selectedStatus === "Ngưng bán" && product.deletedAt === null) {
        return false;
      }
      return true;
    }) || [];

  const totalPages = filteredProducts.length
    ? Math.ceil(filteredProducts.length / itemsPerPage)
    : 0;

  const currentProducts =
    filteredProducts.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    ) || [];

  const [loading, setLoading] = useState(false);

  const openUpdateModal = () => {
    setShowUpdateModal(true);
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
    }, 500);
  };

  const addImageField = (e) => {
    e.preventDefault();
    setSateProduct((prev) => ({
      ...prev,
      images: [...prev.images, ""],
    }));
  };

  const apartImageField = (index, e) => {
    e.preventDefault();
    if (stateProduct.images.length > 1) {
      setSateProduct((prev) => ({
        ...prev,
        images: prev.images.filter((_, i) => i !== index),
      }));
    } else {
      toast("Bạn phải để lại ít nhất một ảnh");
    }
  };

  const handleImageChange = (index, e) => {
    const newImages = [...stateProduct.images];
    newImages[index] = e.target.value;
    setSateProduct((prev) => ({
      ...prev,
      images: newImages,
    }));
  };

  const addImageFieldDetails = (e) => {
    // Thêm một ô nhập ảnh mới vào state (mảng images)
    e.preventDefault();
    setStateProductDetails((prev) => ({
      ...prev,
      images: [...prev.images, ""], // Thêm một chuỗi rỗng cho ô nhập ảnh mới
    }));
  };

  const handleImageChangeDetails = (index, e) => {
    const { value } = e.target;
    // Cập nhật giá trị của ảnh tại vị trí index trong mảng images
    const updatedImages = [...stateProductDetails.images];
    updatedImages[index] = value;
    setStateProductDetails((prev) => ({
      ...prev,
      images: updatedImages,
    }));
  };

  const apartImageFieldDetails = (index, e) => {
    e.preventDefault();
    const updatedImages = stateProductDetails.images.filter(
      (_, i) => i !== index
    );
    setStateProductDetails((prev) => ({
      ...prev,
      images: updatedImages,
    }));
  };

  console.log("stateProductDetails", stateProductDetails);

  const CreateModal = useMemo(
    () => (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white p-6 w-[700px] max-w-3xl rounded-xl shadow-lg">
          <h1 className="text-2xl font-bold text-center">Thêm sản phẩm mới</h1>
          <div>
            <form
              action=""
              className="space-y-3"
              form={form}
              onSubmit={onFinish}
            >
              <div className="grid grid-cols-2 gap-2">
                <div className="">
                  <div className="flex flex-col gap-1">
                    <p className="text-xl font-bold">Name</p>
                    <input
                      type="text"
                      name="name"
                      className="border w-full p-2 rounded-lg"
                      value={stateProduct.name}
                      onChange={handleOnchange}
                      placeholder=""
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <p className="text-xl font-bold">Brand</p>
                    <select
                      className="border w-full p-2 rounded-lg"
                      name="brand"
                      value={stateProduct.brand}
                      onChange={handleOnchange}
                    >
                      <option value="">Chọn thương hiệu</option>
                      {brands.map((item, key) => (
                        <option value={item} key={key}>
                          {item}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex flex-col gap-1">
                    <p className="text-xl font-bold">Price</p>
                    <input
                      type="text"
                      name="price"
                      className="border w-full p-2 rounded-lg"
                      value={stateProduct.price}
                      onChange={handleOnchange}
                      placeholder=""
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <p className="text-xl font-bold">Discount</p>
                    <input
                      type="text"
                      name="discount"
                      value={stateProduct.discount}
                      onChange={handleOnchange}
                      className="border w-full p-2 rounded-lg"
                      placeholder=""
                    />
                  </div>
                </div>

                <div className="">
                  <div className="flex flex-col gap-1">
                    <p className="text-xl font-bold">Description</p>
                    <textarea
                      rows={2}
                      name="description"
                      className="border w-full p-2 rounded-lg"
                      value={stateProduct.description}
                      onChange={handleOnchange}
                    ></textarea>
                  </div>

                  <div className="flex flex-col gap-y-2 mt-2">
                    <div className="grid grid-cols-2">
                      <p className="text-xl font-bold">Size</p>
                      <div className="flex justify-between">
                        <p className="text-xl font-bold">Số lượng</p>
                        <button
                          className="flex items-center justify-center border w-[40px] h-[40px] text-3xl font-bold"
                          onClick={addSizeField}
                        >
                          +
                        </button>
                      </div>
                    </div>
                    {sizeList.map((item, index) => (
                      <div key={item.id} className="grid grid-cols-2 gap-x-6">
                        <select
                          name="size"
                          className="border w-full p-2 rounded-lg"
                          value={sizeStock[index]?.size}
                          onChange={(e) =>
                            handleSizeStockChange(index, "size", e.target.value)
                          }
                        >
                          <option value="">Chọn size</option>
                          {[36, 37, 38, 39, 40, 41, 42].map((size) => (
                            <option
                              key={size}
                              value={size}
                              disabled={sizeStock.some(
                                (item) => item.size === String(size)
                              )}
                            >
                              {size}
                            </option>
                          ))}
                        </select>
                        <div className="flex gap-x-2">
                          <input
                            type="text"
                            name="stock"
                            className="border w-full p-2 rounded-lg"
                            value={sizeStock[index]?.stock}
                            onChange={(e) =>
                              handleSizeStockChange(
                                index,
                                "stock",
                                e.target.value
                              )
                            }
                          />
                          <button
                            className="flex items-center justify-center border w-[40px] h-[40px] text-3xl font-bold"
                            onClick={(e) => apartSizeField(item.id, e)}
                          >
                            -
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-col gap-y-2 mt-2">
                    <p className="text-xl font-bold">Ảnh</p>
                    <input
                      type="text"
                      name="image"
                      className="border w-full p-2 rounded-lg"
                      value={stateProduct.image}
                      onChange={handleOnchange}
                      placeholder=""
                    />
                  </div>
                  <div className="flex flex-col gap-y-2 mt-2">
                    <div className="flex justify-between">
                      <p className="text-xl font-bold">Ảnh khác</p>
                      <button
                        className="flex items-center justify-center border w-[40px] h-[40px] text-3xl font-bold"
                        onClick={addImageField}
                      >
                        +
                      </button>
                    </div>
                    {Array.isArray(stateProduct.images) &&
                      stateProduct.images.length > 0 &&
                      stateProduct.images.map((image, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-3 mb-3"
                        >
                          <input
                            type="text"
                            name="images"
                            className="border w-full p-2 rounded-lg"
                            value={image}
                            onChange={(e) => handleImageChange(index, e)} // Cập nhật giá trị ảnh
                            placeholder="Nhập URL ảnh"
                          />
                          <button
                            className="flex items-center justify-center border w-[40px] h-[40px] text-3xl font-bold"
                            onClick={(e) => apartImageField(index, e)}
                          >
                            -
                          </button>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </form>
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <button
              className="px-4 py-2 bg-white border font-bold w-1/4 rounded-lg"
              onClick={handleCancel}
            >
              Hủy
            </button>
            <button
              className="px-4 py-2 bg-black text-white font-bold w-1/4 rounded-lg"
              onClick={onFinish}
            >
              Tạo
            </button>
          </div>
        </div>
      </div>
    ),
    [stateProduct, sizeList]
  );

  const UpdateModal = useMemo(
    () => (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white p-6 w-[700px] max-w-3xl rounded-xl shadow-lg">
          <h1 className="text-2xl font-bold text-center">Cập nhật sản phẩm</h1>
          {loading ? (
            <div className="flex justify-center items-center py-10">
              <FaSpinner className="text-4xl animate-spin text-gray-700" />
            </div>
          ) : (
            <div>
              <form
                action=""
                className="space-y-3"
                form={form}
                onSubmit={onFinish}
              >
                <div className="grid grid-cols-2 gap-2">
                  {/* Thông tin sản phẩm */}
                  <div className="">
                    <div className="flex flex-col gap-1">
                      <p className="text-xl font-bold">Tên sản phẩm</p>
                      <input
                        type="text"
                        name="name"
                        className="border w-full p-2 rounded-lg"
                        value={stateProductDetails.name}
                        onChange={handleOnchangeDetails}
                        placeholder="Nhập tên sản phẩm"
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <p className="text-xl font-bold">Thương hiệu</p>
                      <select
                        className="border w-full p-2 rounded-lg"
                        name="brand"
                        value={stateProductDetails.brand}
                        onChange={handleOnchangeDetails}
                      >
                        <option value="">Chọn thương hiệu</option>
                        {brands.map((item, key) => (
                          <option value={item} key={key}>
                            {item}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="flex flex-col gap-1">
                      <p className="text-xl font-bold">Giá</p>
                      <input
                        type="text"
                        name="price"
                        className="border w-full p-2 rounded-lg"
                        value={stateProductDetails.price}
                        onChange={handleOnchangeDetails}
                        placeholder="Nhập giá sản phẩm"
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <p className="text-xl font-bold">Giảm giá</p>
                      <input
                        type="text"
                        name="discount"
                        value={stateProductDetails.discount}
                        onChange={handleOnchangeDetails}
                        className="border w-full p-2 rounded-lg"
                        placeholder="Nhập giảm giá"
                      />
                    </div>
                  </div>

                  <div className="">
                    <div className="flex flex-col gap-1">
                      <p className="text-xl font-bold">Mô tả sản phẩm</p>
                      <textarea
                        rows={2}
                        name="description"
                        className="border w-full p-2 rounded-lg"
                        value={stateProductDetails.description}
                        onChange={handleOnchangeDetails}
                      ></textarea>
                    </div>

                    {/* Phần Size và Số lượng */}
                    <div className="flex flex-col gap-y-2 mt-2">
                      <div className="grid grid-cols-2">
                        <p className="text-xl font-bold">Size</p>
                        <div className="flex justify-between">
                          <p className="text-xl font-bold">Số lượng</p>
                          <button
                            className="flex items-center justify-center border w-[40px] h-[40px] text-3xl font-bold"
                            onClick={addSizeFieldDetails}
                          >
                            +
                          </button>
                        </div>
                      </div>
                      {stateProductDetails.sizeStock.map((item, index) => (
                        <div key={index} className="grid grid-cols-2 gap-x-6">
                          <select
                            name={`size-${index}`}
                            className="border w-full p-2 rounded-lg"
                            value={item.size}
                            onChange={(e) =>
                              handleSizeStockChangeDetails(
                                index,
                                "size",
                                e.target.value
                              )
                            }
                          >
                            <option value="">Chọn size</option>
                            {[36, 37, 38, 39, 40, 41, 42].map((size) => (
                              <option
                                key={size}
                                value={size}
                                disabled={stateProductDetails.sizeStock
                                  .filter((_, i) => i !== index) // Loại bỏ chính nó ra khỏi kiểm tra
                                  .some((s) => s.size === String(size))}
                              >
                                {size}
                              </option>
                            ))}
                          </select>

                          <div className="flex gap-x-2">
                            <input
                              type="text"
                              name={`stock-${index}`}
                              className="border w-full p-2 rounded-lg"
                              value={item.stock}
                              onChange={(e) =>
                                handleSizeStockChangeDetails(
                                  index,
                                  "stock",
                                  e.target.value
                                )
                              }
                            />
                            <button
                              className="flex items-center justify-center border w-[40px] h-[40px] text-3xl font-bold"
                              onClick={(e) => apartSizeFieldDetails(index, e)}
                            >
                              -
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Phần ảnh */}
                    <div className="flex flex-col gap-y-2 mt-2">
                      <p className="text-xl font-bold">Ảnh chính</p>
                      <input
                        type="text"
                        name="image"
                        className="border w-full p-2 rounded-lg"
                        value={stateProductDetails.image}
                        onChange={handleOnchangeDetails}
                        placeholder="Nhập URL ảnh chính"
                      />
                    </div>

                    <div className="flex flex-col gap-y-2 mt-2">
                      <div className="flex justify-between">
                        <p className="text-xl font-bold">Ảnh khác</p>
                        <button
                          className="flex items-center justify-center border w-[40px] h-[40px] text-3xl font-bold"
                          onClick={addImageFieldDetails}
                        >
                          +
                        </button>
                      </div>

                      {/* Render các ảnh khác */}
                      {Array.isArray(stateProductDetails.images) &&
                        stateProductDetails.images.length > 0 &&
                        stateProductDetails.images.map((image, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-3 mb-3"
                          >
                            <input
                              type="text"
                              name="images"
                              className="border w-full p-2 rounded-lg"
                              value={image}
                              onChange={(e) =>
                                handleImageChangeDetails(index, e)
                              } // Cập nhật giá trị ảnh
                              placeholder="Nhập URL ảnh"
                            />
                            <button
                              className="flex items-center justify-center border w-[40px] h-[40px] text-3xl font-bold"
                              onClick={(e) => apartImageFieldDetails(index, e)} // Xóa ảnh
                            >
                              -
                            </button>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-2 mt-4">
                  <button
                    className="px-4 py-2 bg-white border font-bold w-1/4 rounded-lg"
                    onClick={handleCancel}
                  >
                    Hủy
                  </button>
                  <button
                    className="px-4 py-2 bg-black text-white font-bold w-1/4 rounded-lg"
                    onClick={onUpdateProduct}
                  >
                    Cập nhật
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    ),
    [stateProductDetails, sizeList, loading]
  );

  return (
    <>
      {/* Lọc tạo tìm  start*/}
      <div className="flex justify-between items-center mt-3">
        <div className="flex gap-3 mt-5">
          {/* brands */}
          <div className="w-[200px]">
            <select
              className="border w-full p-2 rounded-lg"
              name="brand"
              onChange={(e) => setSelectedBrand(e.target.value)}
            >
              <option value="">Thương hiệu</option>
              {brands.map((item, key) => (
                <option value={item} key={key}>
                  {item}
                </option>
              ))}
              {/* <option>Nike</option>
              <option>Adidas</option>
              <option>Puma</option>
              <option>Vans</option> */}
            </select>
          </div>
          {/* discount */}
          <div className="w-[200px]">
            <select
              className="border w-full p-2 rounded-lg"
              name="discount"
              onChange={(e) => setSelectedDiscount(e.target.value)}
            >
              <option value="">Giảm giá</option>
              <option value="discount">Đang giảm giá</option>
              <option value="no-discount">Không giảm giá</option>
            </select>
          </div>
          {/* status */}
          <div className="w-[200px]">
            <select
              className="border w-full p-2 rounded-lg"
              name="brand"
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="">Trạng thái</option>
              <option value="Ngưng bán">Ngưng bán</option>
              <option value="Đang bán">Đang bán</option>
            </select>
          </div>
        </div>
        {/* search */}
        <div className="flex gap-5">
          <div className="px-2 py-2 bg-white w-[400px] shadow-sm rounded-lg flex items-center">
            <input
              type="search"
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
              placeholder="Tìm kiếm sản phẩm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value.toLowerCase())}
            />
          </div>
          <button
            className="px-4 py-2 bg-black text-white rounded-lg text-xl"
            onClick={() => {
              setShowCreateModal(true);
            }}
          >
            Create
          </button>
        </div>
      </div>
      {/* Lọc tạo tìm  end*/}
      {/* <div className="bg-white mt-5 mr-2">
        <table className="w-full border-collapse">
          <thead className="bg-gray-200">
            <tr>
              <th className="border p-2">STT</th>
              <th className="border p-2 cursor-pointer">Tên</th>
              <th className="border p-2">Thương hiệu</th>
              <th className="border p-2 cursor-pointer">Giá</th>
              <th className="border p-2 cursor-pointer">Tồn kho/Đã bán</th>
              <th className="border p-2">Trạng thái</th>
              <th className="border p-2">Action</th>
            </tr>
          </thead>
          <tbody className="text-center">
            {currentProducts.map((product, index) => (
              <tr key={product.id} onClick={() => setRowSelected(product._id)}>
                <td className="border p-2">
                  {" "}
                  {(currentPage - 1) * itemsPerPage + index + 1}
                </td>
                <td className="border p-2 text-1xl max-w-xs whitespace-normal break-words">
                  {product.discount > 0 ? (
                    <>
                      {product.name}{" "}
                      <span className="text-red-500">
                        - {product.discount}%
                      </span>
                    </>
                  ) : (
                    product.name
                  )}
                </td>

                <td className="border p-2">{product.brand}</td>
                <td className="border p-2">{formatter(product.price)}</td>
                <td className="border p-2">
                  <div className="flex flex-col">
                    <p className="">Tồn kho: {product.totalStock}</p>
                    <p>Đã bán: {product.totalSold}</p>
                  </div>
                </td>
                <td className="border p-2">
                  <Switch
                    checked={checkedItems[product._id] ?? !product.deletedAt}
                    checkedChildren="Đang bán"
                    unCheckedChildren="Ngưng bán"
                    onChange={(checked) =>
                      handleChangeSoftDelete(checked, product._id)
                    }
                  />
                </td>
                <td className="border p-2">
                  <div className="flex gap-2 text-2xl justify-center">
                    <FaEdit
                      className="cursor-pointer"
                      onClick={() => {
                        handleDetailsProduct();
                        openUpdateModal();
                      }}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div> */}
      <div className="grid grid-cols-3 gap-3 mt-3">
        {currentProducts.map((product, index) => (
          <div
            key={index}
            className="bg-white rounded-lg h-[200px] grid grid-cols-5"
            onClick={() => setRowSelected(product._id)}
          >
            <div className="col-span-2 rounded-lg flex justify-center items-center p-2">
              <img
                src={product.image}
                alt=""
                className="w-full h-[150px] object-cover rounded-lg"
              />
            </div>

            <div className="col-span-3 mt-2">
              <div className="flex flex-col">
                <p className="font-bold">
                  {product.name}{" "}
                  {product.discount > 0 && (
                    <span className="text-red-500">- {product.discount}%</span>
                  )}
                </p>
                <p className="">
                  Trạng thái:{" "}
                  <span
                    className={
                      product.status === "Hết hàng"
                        ? "font-bold text-red-500"
                        : ""
                    }
                  >
                    {product.status}{" "}
                  </span>
                </p>
                {product.discount > 0 ? (
                  <>
                    <div className="flex gap-3">
                      <p>
                        Giá:{" "}
                        <span className="text-red-500">
                          {formatter(product.price)}
                        </span>
                      </p>
                      <p className="line-through text-gray-500">
                        {formatter(product.oldPrice)}
                      </p>
                    </div>
                  </>
                ) : (
                  <p>
                    Giá:{" "}
                    <span className="text-red-500">
                      {formatter(product.price)}
                    </span>
                  </p>
                )}
              </div>

              <div className="flex flex-col">
                <p className="">Tồn kho: {product.totalStock}</p>
                <p>Đã bán: {product.totalSold}</p>
              </div>
              <div className="flex justify-between">
                <Switch
                  checked={checkedItems[product._id] ?? !product.deletedAt}
                  checkedChildren="Đang bán"
                  unCheckedChildren="Ngưng bán"
                  onChange={(checked) =>
                    handleChangeSoftDelete(checked, product._id)
                  }
                />
                <CiEdit
                  className="cursor-pointer text-3xl"
                  onClick={() => {
                    handleDetailsProduct();
                    openUpdateModal();
                  }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
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

      {showCreateModal && CreateModal}
      {showUpdateModal && UpdateModal}
      <ToastNotification />
    </>
  );
};

export default memo(AdminProduct);
