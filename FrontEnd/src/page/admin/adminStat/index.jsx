import { memo } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const AdminStat = () => {
  // Dữ liệu doanh thu cho Tháng 4 và Tháng 8
  const revenueData = {
    Banking: [300000, 0, 0, 450000, 0, 0, 0, 500000, 0, 0, 0, 0], // Dữ liệu cho Banking
    COD: [200000, 0, 0, 350000, 0, 0, 0, 400000, 0, 0, 0, 0], // Dữ liệu cho COD
  };

  // Dữ liệu tổng doanh thu (Banking + COD) cho các tháng
  const totalRevenue = revenueData.Banking.map(
    (banking, index) => banking + revenueData.COD[index]
  );

  // Dữ liệu cho Biểu đồ
  const data = {
    labels: [
      "Tháng 1",
      "Tháng 2",
      "Tháng 3",
      "Tháng 4",
      "Tháng 5",
      "Tháng 6",
      "Tháng 7",
      "Tháng 8",
      "Tháng 9",
      "Tháng 10",
      "Tháng 11",
      "Tháng 12",
    ], // Nhãn trục X với tất cả các tháng
    datasets: [
      {
        label: "Doanh thu từ Banking (VND)",
        data: revenueData.Banking, // Dữ liệu doanh thu từ Banking
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
      {
        label: "Doanh thu từ COD (VND)",
        data: revenueData.COD, // Dữ liệu doanh thu từ COD
        backgroundColor: "rgba(153, 102, 255, 0.2)",
        borderColor: "rgba(153, 102, 255, 1)",
        borderWidth: 1,
      },
      {
        label: "Tổng Doanh thu (VND)",
        data: totalRevenue, // Dữ liệu tổng doanh thu
        backgroundColor: "rgba(255, 159, 64, 0.2)",
        borderColor: "rgba(255, 159, 64, 1)",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: "Doanh thu theo phương thức thanh toán (Tháng 1 đến Tháng 12)",
      },
    },
  };

  return (
    <>
      {/* Thông tin thống kê */}
      <div className="grid grid-cols-4 mt-3 gap-3">
        {/* Tổng doanh thu */}
        <div className="bg-white h-[200px] rounded-lg text-center shadow-md flex flex-col justify-center items-center hover:scale-105 hover:shadow-lg transition-all duration-300">
          <h1 className="text-xl font-semibold">Tổng doanh thu</h1>
          <p className="mt-2 text-4xl font-bold">{`${totalRevenue[3].toLocaleString()} VND`}</p>
        </div>

        {/* Tổng Đơn hàng */}
        <div className="bg-white h-[200px] rounded-lg text-center shadow-md flex flex-col justify-center items-center hover:scale-105 hover:shadow-lg transition-all duration-300">
          <h1 className="text-xl font-semibold">Tổng Đơn hàng</h1>
          <p className="mt-2 text-4xl font-bold">100</p>
        </div>

        {/* Đơn hàng đang xử lý */}
        <div className="bg-white h-[200px] rounded-lg text-center shadow-md flex flex-col justify-center items-center hover:scale-105 hover:shadow-lg transition-all duration-300">
          <h1 className="text-xl font-semibold">Đơn hàng đang xử lý</h1>
          <p className="mt-2 text-4xl font-bold">25</p>
        </div>

        {/* Đơn hàng thành công và thất bại */}
        <div className="grid grid-rows-2 gap-3">
          <div className="bg-white h-[95px] rounded-lg text-center shadow-md flex flex-col justify-center items-center hover:scale-105 hover:shadow-lg transition-all duration-300">
            <h1 className="text-xl font-semibold">Đơn hàng thành công</h1>
            <p className="mt-2 text-4xl font-bold">70</p>
          </div>
          <div className="bg-white h-[95px] rounded-lg text-center shadow-md flex flex-col justify-center items-center hover:scale-105 hover:shadow-lg transition-all duration-300">
            <h1 className="text-xl font-semibold">Đơn hàng thất bại</h1>
            <p className="mt-2 text-4xl font-bold">5</p>
          </div>
        </div>
      </div>

      {/* Biểu đồ cột */}
      <div className="">
        <h2 className="text-center text-xl font-semibold mb-4">
          Biểu đồ Cột Doanh Thu (Tháng 1 đến Tháng 12)
        </h2>
        <Bar data={data} options={options} />
      </div>

      <div className="">
        <h1>Top 10 sản phẩm bán chạy nhất</h1>
      </div>
    </>
  );
};

export default memo(AdminStat);
