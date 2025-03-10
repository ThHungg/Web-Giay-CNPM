import { memo, useState } from "react";

const AdminUser = () => {
  const [showCreateModal, setCreateModel] = useState(false);

  const CreateModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-8 flex flex-col gap-4 w-1/2 max-w-xl shadow-lg rounded-xl">
        <h1 className="text-center text-2xl font-bold">Tạo người dùng mới</h1>
        <form action="" className="flex flex-col gap-2">
          <input
            type="text"
            className="border w-full p-2 rounded-lg"
            placeholder="Username"
          />

          <input
            type="text"
            className="border w-full p-2 rounded-lg"
            placeholder="Họ và Tên"
          />

          <input
            type="text"
            className="border w-full p-2 rounded-lg"
            placeholder="Email"
          />

          <input
            type="text"
            className="border w-full p-2 rounded-lg"
            placeholder="Mật khẩu"
          />
        </form>
        <div className="flex justify-end gap-2 mt-4">
          <button
            className="px-4 py-2 bg-white border font-bold w-1/4 rounded-lg"
            onClick={() => setCreateModel(false)}
          >
            Hủy
          </button>
          <button
            className="px-4 py-2 bg-black text-white font-bold w-1/4 rounded-lg"
            onClick={() => setCreateModel(false)}
          >
            Tạo
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div className="flex justify-between m-4">
        <h1 className="text-2xl font-bold">Users</h1>
        <button
          className="px-4 py-2 bg-black text-white text-xl rounded-2xl"
          onClick={() => setCreateModel(true)}
        >
          Create
        </button>
      </div>
      <div className="mx-20">
        <div className="px-4 h-20 py-4 bg-white w-full shadow rounded-lg">
          <input
            type="search"
            className="w-full h-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
            placeholder="Tìm kiếm người dùng"
          />
        </div>
      </div>
      <div className="bg-white p-2 mt-10">
        <table className="w-full border-collapse">
          <thead className="bg-gray-200">
            <tr>
              <th className="border p-2">#</th>
              <th className="border p-2">Name</th>
              <th className="border p-2">Email</th>
              <th className="border p-2">Phone</th>
              <th className="border p-2">Status</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody className="text-center">
            <tr>
              <td className="border p-2">1</td>
              <td className="border p-2">Nguyễn Văn A</td>
              <td className="border p-2">a@example.com</td>
              <td className="border p-2">0348910968</td>
              <td className="border p-2"></td>
              <td className="border p-2"></td>
            </tr>
          </tbody>
        </table>
        {showCreateModal && <CreateModal />}
      </div>
    </>
  );
};

export default memo(AdminUser);
