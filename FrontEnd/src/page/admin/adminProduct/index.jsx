import { memo, useState, useMemo, useEffect } from "react";
import { useMutationHooks } from "../../../hooks/useMutation";
import * as productService from "../../../services/productService";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import ToastNotification from "../../../component/toastNotification";
import { Form, Switch } from "antd";
import { MdDelete } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import { useSelector } from "react-redux";
import Loading from "../../../component/Loading";
import formatter from "../../../utils/formatter";

const AdminProduct = () => {
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

  const queryClient = useQueryClient();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [sizeStock, setSizeStock] = useState([{ size: "", stock: "" }]);
  const [sizeList, setSizeList] = useState([{ id: 1 }]);
  const [form] = Form.useForm();
  const [rowSelected, setRowSelected] = useState("");
  const user = useSelector((state) => state.user);

  const [stateProduct, setSateProduct] = useState({
    name: "",
    price: "",
    description: "",
    brand: "",
    discount: "",
    image: "",
    sizeStock: {
      size: "",
      stock: "",
    },
  });

  const mutation = useMutationHooks(async (data) => {
    const { name, price, description, brand, image, discount, sizeStock } =
      data;
    return await productService.createProduct({
      name,
      price,
      description,
      brand,
      image,
      discount,
      sizeStock,
    });
  });

  const { data, isLoading, isSuccess, isError } = mutation;

  useEffect(() => {
    if (isSuccess) {
      toast.success("Thêm thành công");
      mutation.reset();
      setShowCreateModal(false);
    } else if (isError) {
      toast.error("Thêm thất bại");
      mutation.reset();
    }
  }, [isSuccess, isError]);

  const onFinish = (e) => {
    e.preventDefault();
    mutation.mutate(stateProduct);
  };

  const handleCancel = () => {
    setShowCreateModal(false);
    setShowUpdateModal(false);
    setSateProduct({
      name: "",
      price: "",
      description: "",
      brand: "",
      image: "",
      discount: "",
      sizeStock: {
        size: "",
        stock: "",
      },
    });
    form.resetFields();
  };

  const handleOnchange = (e) => {
    setSateProduct({ ...stateProduct, [e.target.name]: e.target.value });
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
      alert("Bạn phải để lại ít nhất một size");
    }
  };

  const [stateProductDetails, setStateProductDetails] = useState({
    name: "",
    price: "",
    description: "",
    brand: "",
    image: "",
    discount: "",
    sizeStock: [],
  });

  const handleOnchangeDetails = (e) => {
    setStateProductDetails({
      ...stateProductDetails,
      [e.target.name]: e.target.value,
    });
  };

  const fetchGetDetailsProduct = async (rowSelected) => {
    const res = await productService.getDetailsProduct(rowSelected);
    if (res?.data) {
      setStateProductDetails({
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
    form.setFieldsValue(stateProductDetails);
  }, [stateProductDetails]);

  useEffect(() => {
    if (rowSelected) {
      fetchGetDetailsProduct(rowSelected);
    }
  }, [rowSelected]);

  const handleDetailsProduct = () => {
    if (rowSelected) {
      fetchGetDetailsProduct(rowSelected);
    }
  };

  const mutationUpdate = useMutationHooks(async (data) => {
    console.log(data);
    const { id, token, ...rests } = data;
    return await productService.updateProduct(id, token, rests);
  });

  const {
    data: dataUpdated,
    isLoading: isLoadingUpdated,
    isSuccess: isSuccessUpdated,
    isError: isErrorUpdated,
  } = mutationUpdate;
  console.log("dataUpdated", dataUpdated);

    useEffect(() => {
      if (isSuccessUpdated) {
        toast.success("Cập nhật thành công");
        mutationUpdate.reset();
        setShowUpdateModal(false);
      } else if (isErrorUpdated) {
        toast.error("Thêm thất bại");
        mutationUpdate.reset();
      }
    }, [isSuccessUpdated, isErrorUpdated]);

  const onUpdateProduct = () => {
    setShowUpdateModal(false);
    mutationUpdate.mutate({
      id: rowSelected,
      token: user?.access_token,
      ...stateProductDetails,
    });
  };

  useEffect(() => {
    if (isSuccessUpdated) {
      queryClient.invalidateQueries(["products"]);
      fetchGetDetailsProduct(rowSelected);
    }
  }, [isSuccessUpdated]);

  // const [sortOrder, setSortOrder] = useState("asc");

  // const sortedProducts = [...(products?.data || [])].sort((a, b) => {
  //   return sortOrder === "asc"
  //     ? a.name.localeCompare(b.name)
  //     : b.name.localeCompare(a.name);
  // });

  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");

  // Lọc sản phẩm theo tên hoặc thương hiệu
  const filteredProducts = (products?.data || []).filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sắp xếp danh sách sản phẩm
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortField === "name") {
      return sortOrder === "asc"
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name);
    } else if (sortField === "price") {
      return sortOrder === "asc" ? a.price - b.price : b.price - a.price;
    }
  });

  // Xử lý sự kiện sắp xếp
  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const CreateModal = useMemo(
    () => (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
        <div className="bg-white p-8 flex flex-col gap-4 w-1/2 shadow-lg rounded-xl">
          <h1 className="text-2xl font-bold text-center">Thêm sản phẩm mới</h1>
          <form action="" className="space-y-3" form={form} onSubmit={onFinish}>
            <div className="grid grid-cols-2 gap-x-6">
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
                    <option>Nike</option>
                    <option>Adidas</option>
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
                        <option value="36">36</option>
                        <option value="37">37</option>
                        <option value="38">38</option>
                        <option value="39">39</option>
                        <option value="40">40</option>
                        <option value="41">41</option>
                        <option value="42">42</option>
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
              </div>
            </div>
          </form>

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
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
        <div className="bg-white p-8 flex flex-col gap-4 w-1/2 shadow-lg rounded-xl">
          <h1 className="text-2xl font-bold text-center">Thêm sản phẩm mới</h1>
          <form action="" className="space-y-3" form={form} onSubmit={onFinish}>
            <div className="grid grid-cols-2 gap-x-6">
              <div className="">
                <div className="flex flex-col gap-1">
                  <p className="text-xl font-bold">Name</p>
                  <input
                    type="text"
                    name="name"
                    className="border w-full p-2 rounded-lg"
                    value={stateProductDetails.name}
                    onChange={handleOnchangeDetails}
                    placeholder=""
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <p className="text-xl font-bold">Brand</p>
                  <select
                    className="border w-full p-2 rounded-lg"
                    name="brand"
                    value={stateProductDetails.brand}
                    onChange={handleOnchangeDetails}
                  >
                    <option value="">Chọn thương hiệu</option>
                    <option>Nike</option>
                    <option>Adidas</option>
                    <option>Puma</option>
                    <option>Vans</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <p className="text-xl font-bold">Price</p>
                  <input
                    type="text"
                    name="price"
                    className="border w-full p-2 rounded-lg"
                    value={stateProductDetails.price}
                    onChange={handleOnchangeDetails}
                    placeholder=""
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <p className="text-xl font-bold">Discount</p>
                  <input
                    type="text"
                    name="discount"
                    value={stateProductDetails.discount}
                    onChange={handleOnchangeDetails}
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
                    value={stateProductDetails.description}
                    onChange={handleOnchangeDetails}
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
                  {stateProductDetails.sizeStock.map((item, index) => (
                    <div key={index} className="grid grid-cols-2 gap-x-6">
                      <select
                        name={`size-${index}`}
                        className="border w-full p-2 rounded-lg"
                        value={item.size}
                        onChange={(e) =>
                          handleSizeStockChange(index, "size", e.target.value)
                        }
                      >
                        <option value="">Chọn size</option>
                        <option value="36">36</option>
                        <option value="37">37</option>
                        <option value="38">38</option>
                        <option value="39">39</option>
                        <option value="40">40</option>
                        <option value="41">41</option>
                        <option value="42">42</option>
                      </select>
                      <div className="flex gap-x-2">
                        <input
                          type="text"
                          name={`stock-${index}`}
                          className="border w-full p-2 rounded-lg"
                          value={item.stock}
                          onChange={(e) =>
                            handleSizeStockChange(
                              index,
                              "stock",
                              e.target.value
                            )
                          }
                        />
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
                    value={stateProductDetails.image}
                    onChange={handleOnchangeDetails}
                    placeholder=""
                  />
                </div>
              </div>
            </div>
          </form>

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
        </div>
      </div>
    ),
    [stateProductDetails, sizeList]
  );

  return (
    <>
      <div className="flex justify-between m-4">
        <h1 className="text-2xl font-bold">Product</h1>
        <button
          className="px-4 py-2 bg-black text-white rounded-lg text-xl"
          onClick={() => {
            setShowCreateModal(true);
          }}
        >
          Create
        </button>
      </div>
      <div className="mx-20">
        <div className="px-4 h-20 py-4 bg-white w-full shadow rounded-lg">
          <input
            type="search"
            className="w-full h-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
            placeholder="Tìm kiếm sản phẩm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      <div className="bg-white mt-5 mr-2">
        <table className="w-full border-collapse">
          <thead className="bg-gray-200">
            <tr>
              <th className="border p-2">#</th>
              <th
                className="border p-2 cursor-pointer"
                onClick={() => handleSort("name")}
              >
                Tên {sortField === "name" && (sortOrder === "asc" ? "▲" : "▼")}
              </th>
              <th className="border p-2">Thương hiệu</th>
              <th
                className="border p-2 cursor-pointer"
                onClick={() => handleSort("price")}
              >
                Giá {sortField === "price" && (sortOrder === "asc" ? "▲" : "▼")}
              </th>
              <th className="border p-2">Trạng thái</th>
              <th className="border p-2">Action</th>
            </tr>
          </thead>
          <tbody className="text-center">
            {sortedProducts.map((product) => (
              <tr key={product.id} onClick={() => setRowSelected(product._id)}>
                <td className="border p-2"></td>
                <td className="border p-2">{product.name}</td>
                <td className="border p-2">{product.brand}</td>
                <td className="border p-2">{formatter(product.price)}</td>
                <td className="border p-2">
                  <Switch
                    checkedChildren="Đang bán"
                    unCheckedChildren="Ngưng bán"
                    defaultChecked
                  />
                </td>
                <td className="border p-2">
                  <div className="flex gap-2 text-2xl justify-center">
                    <MdDelete className="cursor-pointer" />
                    <FaEdit
                      className="cursor-pointer"
                      onClick={() => {
                        handleDetailsProduct();
                        setShowUpdateModal(true);
                      }}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-end mt-5">
        <button className="px-4 py-2 mx-2 bg-gray-200 rounded disabled:opacity-50">
          Trước
        </button>
        <span className="px-4 py-2">1/2</span>
        <button className="px-4 py-2 mx-2 bg-gray-200 rounded disabled:opacity-50">
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
