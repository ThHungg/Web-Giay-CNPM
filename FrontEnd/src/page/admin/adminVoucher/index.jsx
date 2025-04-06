import { memo } from "react";
import { useSelector } from "react-redux";
import * as voucherService from "../../../services/voucherService";
import { useQuery } from "@tanstack/react-query";

const AdminVoucher = () => {
  const user = useSelector((state) => state?.user);

  const getAllVoucher = async () => {
    const res = await voucherService.getAllVoucher(user?.access_token);
    return res.data;
  };

  const { data: vouchers, refetch } = useQuery({
    queryKey: ["voucher"],
    queryFn: getAllVoucher,
    enabled: !!user?.access_token,
  });
  console.log(vouchers);

  return (
    <>
      <div className="flex justify-between items-center mt-3">
        <div className="flex gap-3 mt-5">
          <div className="w-[200px]">
            <select className="border w-full p-2 rounded-lg">
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
              placeholder="Tìm kiếm người dùng"
            />
          </div>
          <button className="px-4 py-2 bg-black text-white rounded-lg text-xl">
            Create
          </button>
        </div>
      </div>
      <div className="bg-white mt-5 mr-2">
        <table className="w-full border-collapse">
          <thead className="bg-gray-200">
            <tr>
              <th className="border p-2">Code</th>
              <th className="border p-2">Discount</th>
              <th className="border p-2">StartDate / ExpiryDate</th>
              <th className="border p-2">Type</th>
              <th className="border p-2">MinOrder</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody className="text-center bg-white">
            {vouchers?.map((voucher, index) => (
              <tr key={voucher._id}>
                <td className="border p-2">{voucher.code}</td>
                <td className="border p-2">{voucher.discount}</td>
                <td className="border p-2">
                  {new Date(voucher.createdAt).toLocaleDateString()} --{" "}
                  {new Date(voucher.expiryDate).toLocaleDateString()}
                </td>
                <td className="border p-2">{voucher.type}</td>
                <td className="border p-2">{voucher.minOrder}</td>
                <td className="border p-2">Thay đổi</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default memo(AdminVoucher);
