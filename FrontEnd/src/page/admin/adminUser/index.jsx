import { memo, useEffect, useMemo, useState } from "react";
import * as userServices from "../../../services/userServices";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Form } from "antd";
import { useMutationHooks } from "../../../hooks/useMutation";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import ToastNotification from "../../../component/toastNotification";

const AdminUser = () => {
  const queryClient = useQueryClient();
  const [showCreateModal, setShowCreateModel] = useState(false);
  const [showUpdateModal, setShowUpdateModel] = useState(false);
  const [rowSelected, setRowSelected] = useState("");
  const [form] = Form.useForm();
  const user = useSelector((state) => state?.user);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedRole, setSelectedRole] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  // const itemsPerPage = 10;
  useEffect(() => {
    const updateItemsPerPage = () => {
      const itemHeight = 60;
      const availableHeight = window.innerHeight - 200;
      const items = Math.floor(availableHeight / itemHeight);
      setItemsPerPage(items > 0 ? items : 1);
    };

    updateItemsPerPage(); // Gọi khi load trang
    window.addEventListener("resize", updateItemsPerPage);

    return () => window.removeEventListener("resize", updateItemsPerPage);
  }, []);

  const getAllUser = async () => {
    const res = await userServices.getAllUser(user?.access_token);
    return res;
  };

  const { data: users } = useQuery({
    queryKey: ["user"],
    queryFn: getAllUser,
    retry: 3,
    retryDelay: 1000,
    enabled: !!user?.access_token,
  });

  const [stateUser, setStateUser] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  const [stateUserDetails, setStateUserDetails] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  const mutation = useMutationHooks(async (data) => {
    const { name, phone, email, password } = data;
    const res = await userServices.registerUser(data);
    return res;
  });

  const onFinish = (e) => {
    e.preventDefault();
    mutation.mutate(stateUser);
  };

  const handleCancel = () => {
    setShowCreateModel(false);
    setShowUpdateModel(false);
    setStateUser({
      name: "",
      email: "",
      phone: "",
      password: "",
    });
    form.resetFields();
  };

  const handleOnchange = (e) => {
    setStateUser({ ...stateUser, [e.target.name]: e.target.value });
  };

  const handleOnchangeDetails = (e) => {
    setStateUserDetails({
      ...stateUserDetails,
      [e.target.name]: e.target.value,
    });
  };

  const fetchGetDetailsUser = async (rowSelected) => {
    const res = await userServices.getDetailsUser(rowSelected);
    if (res?.data) {
      setStateUserDetails({
        name: res?.data?.name,
        phone: res?.data?.phone,
        email: res?.data?.email,
      });
    }
  };

  useEffect(() => {
    form.setFieldsValue(stateUserDetails);
  }, [stateUserDetails]);

  useEffect(() => {
    if (rowSelected) {
      fetchGetDetailsUser(rowSelected);
    }
  }, [rowSelected]);

  const handleDetailsUser = () => {
    if (rowSelected) {
      fetchGetDetailsUser(rowSelected);
    }
  };

  const mutationUpdate = useMutationHooks(async (data) => {
    console.log("Data gửi lên:", data); // Kiểm tra dữ liệu trước khi gọi API
    const { id, token, ...rests } = data;
    const res = await userServices.updateUser(id, token, rests);
    console.log(id);
    console.log("Kết quả từ API:", res);
    return res;
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
      setShowUpdateModel(false);
    } else if (isErrorUpdated) {
      toast.error("Cập nhật thất bại");
      mutationUpdate.reset();
    }
  }, [isSuccessUpdated, isErrorUpdated]);

  const onUpdateUser = () => {
    setShowUpdateModel(false);
    mutationUpdate.mutate({
      id: rowSelected,
      token: user?.access_token,
      ...stateUserDetails,
    });
  };

  useEffect(() => {
    if (isSuccessUpdated) {
      queryClient.invalidateQueries(["user"]);
      fetchGetDetailsUser(rowSelected);
    }
  }, [isSuccessUpdated]);

  const handleChangeRole = (id, role) => {
    const isAdmin = role === "admin";
    id = rowSelected;
    console.log("ID:", id, "Role:", role, "isAdmin:", isAdmin);
    mutationUpdate.mutate({
      id,
      token: user?.access_token,
      isAdmin,
    });
  };

  const filteredUsers =
    users?.data?.filter((user) => {
      if (selectedRole === "Admin") return user.isAdmin === true;
      if (selectedRole === "User") return user.isAdmin === false;
      if (searchTerm && !user.name.toLowerCase().includes(searchTerm)) {
        return false;
      }
      return true; 
    }) || [];

  const totalPages = filteredUsers.length
    ? Math.ceil(filteredUsers.length / itemsPerPage)
    : 0;
  const currentUsers =
    filteredUsers.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    ) || [];

  // const totalPages = users?.data
  //   ? Math.ceil(users.data.length / itemsPerPage)
  //   : 0;
  // const currentUsers =
  //   users?.data?.slice(
  //     (currentPage - 1) * itemsPerPage,
  //     currentPage * itemsPerPage
  //   ) || [];

  const CreateModal = useMemo(
    () => (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
        <div className="bg-white p-8 flex flex-col gap-4 w-1/2 max-w-xl shadow-lg rounded-xl">
          <h1 className="text-center text-2xl font-bold">Tạo người dùng mới</h1>
          <form className="flex flex-col gap-2" form={form} onSubmit={onFinish}>
            <input
              type="text"
              className="border w-full p-2 rounded-lg"
              name="name"
              value={stateUser.name}
              onChange={handleOnchange}
              placeholder="Họ và Tên"
            />

            <input
              type="text"
              className="border w-full p-2 rounded-lg"
              name="phone"
              value={stateUser.phone}
              onChange={handleOnchange}
              placeholder="SDT"
            />

            <input
              type="text"
              className="border w-full p-2 rounded-lg"
              name="email"
              value={stateUser.email}
              onChange={handleOnchange}
              placeholder="Email"
            />

            <input
              type="password"
              className="border w-full p-2 rounded-lg"
              name="password"
              value={stateUser.password}
              onChange={handleOnchange}
              placeholder="Mật khẩu"
            />
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
    [stateUser]
  );

  const UpdateModal = useMemo(
    () => (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
        <div className="bg-white p-8 flex flex-col gap-4 w-1/2 max-w-xl shadow-lg rounded-xl">
          <h1 className="text-center text-2xl font-bold">
            Tạo thông tin người dùng
          </h1>
          <form className="flex flex-col gap-2" form={form} onSubmit={onFinish}>
            <input
              type="text"
              className="border w-full p-2 rounded-lg"
              name="name"
              value={stateUserDetails.name}
              onChange={handleOnchangeDetails}
              placeholder="Họ và Tên"
            />

            <input
              type="text"
              className="border w-full p-2 rounded-lg"
              name="phone"
              value={stateUserDetails.phone}
              onChange={handleOnchangeDetails}
              placeholder="SDT"
            />

            <input
              type="text"
              className="border w-full p-2 rounded-lg"
              name="email"
              value={stateUserDetails.email}
              onChange={handleOnchangeDetails}
              placeholder="Email"
            />

            <input
              type="password"
              className="border w-full p-2 rounded-lg"
              name="password"
              value={stateUserDetails.password}
              onChange={handleOnchangeDetails}
              placeholder="Mật khẩu"
            />
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
              onClick={onUpdateUser}
            >
              Tạo
            </button>
          </div>
        </div>
      </div>
    ),
    [stateUserDetails]
  );

  return (
    <>
      <div className="flex justify-between items-center mt-3">
        <div className="flex gap-3 mt-5">
          <div className="w-[200px]">
            <select
              className="border w-full p-2 rounded-lg"
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
            >
              <option value="">Role</option>
              <option value="Admin">Admin</option>
              <option value="User">User</option>
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
              setShowCreateModel(true);
            }}
          >
            Create
          </button>
        </div>
      </div>
      <div className="bg-white mt-5 mr-2">
        <table className="w-full border-collapse">
          <thead className="bg-gray-200">
            <tr>
              <th className="border p-2">STT</th>
              <th className="border p-2">Name</th>
              <th className="border p-2">Email</th>
              <th className="border p-2">Phone</th>
              <th className="border p-2">Role</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody className="text-center bg-white">
            {currentUsers?.map((user, index) => (
              <tr key={user.id} onClick={() => setRowSelected(user._id)}>
                <td className="border p-2">
                  {(currentPage - 1) * itemsPerPage + index + 1}
                </td>
                <td className="border p-2">{user.name}</td>
                <td className="border p-2">{user.email}</td>
                <td className="border p-2">{user.phone}</td>
                <td className="border p-2">
                  <select
                    className="p-1 border-2 border-gray-300 rounded-md bg-white text-lg cursor-pointer"
                    value={user.isAdmin ? "admin" : "user"}
                    onChange={(e) => handleChangeRole(user.id, e.target.value)}
                  >
                    <option value="admin">Admin</option>
                    <option value="user">User</option>
                  </select>
                </td>

                <td className="border p-2">
                  <button
                    className="px-2 py-1 bg-red-500 text-white rounded"
                    onClick={() => {
                      setShowUpdateModel(true);
                      handleDetailsUser();
                    }}
                  >
                    Sửa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {showCreateModal && CreateModal}
        {showUpdateModal && UpdateModal}
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
      <ToastNotification />
    </>
  );
};

export default memo(AdminUser);
