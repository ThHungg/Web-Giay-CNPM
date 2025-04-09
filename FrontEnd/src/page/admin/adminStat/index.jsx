import { memo, useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { useQuery } from "@tanstack/react-query";
import * as statService from "../../../services/statService";
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
  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();
  const [month, setMonth] = useState(currentMonth);
  const [year, setYear] = useState(currentYear);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const [revenueData, setRevenueData] = useState({ Banking: [], COD: [] });
  const {
    data: stat,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["stat", month, year],
    queryFn: () => statService.forceUpdateStat(month, year),
    enabled: !!month && !!year,
  });

  const statData = stat?.data || {};

  useEffect(() => {
    const fetchAllStats = async () => {
      const banking = [];
      const cod = [];

      for (const month of months) {
        try {
          const res = await statService.getStat(month, year);
          const data = res?.data || {};
          banking.push(data.revenueByMethod?.Banking || 0);
          cod.push(data.revenueByMethod?.COD || 0);
        } catch (error) {
          banking.push(0);
          cod.push(0);
        }
      }
      setRevenueData({ Banking: banking, COD: cod });
    };

    fetchAllStats();
  }, [year]);

  const totalRevenue = revenueData.Banking.map(
    (banking, i) => banking + revenueData.COD[i]
  );

  const chartData = {
    labels: months.map((m) => `Tháng ${m}`),
    datasets: [
      {
        label: "Banking",
        data: revenueData.Banking,
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
      {
        label: "COD",
        data: revenueData.COD,
        backgroundColor: "rgba(153, 102, 255, 0.2)",
        borderColor: "rgba(153, 102, 255, 1)",
        borderWidth: 1,
      },
      {
        label: "Tổng doanh thu",
        data: totalRevenue,
        backgroundColor: "rgba(255, 159, 64, 0.2)",
        borderColor: "rgba(255, 159, 64, 1)",
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: `Doanh thu theo phương thức thanh toán (Tháng 1 đến Tháng 12 / ${year})`,
      },
    },
  };

  return (
    <>
      <div className="flex gap-5 mt-3">
        <select
          className="border px-3 py-2 rounded"
          value={month}
          onChange={(e) => setMonth(parseInt(e.target.value))}
        >
          {Array.from({ length: 12 }, (_, i) => (
            <option key={i + 1} value={i + 1}>{`Tháng ${i + 1}`}</option>
          ))}
        </select>
        <select
          className="border px-3 py-2 rounded"
          value={year}
          onChange={(e) => setYear(parseInt(e.target.value))}
        >
          {[2023, 2024, 2025].map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </div>

      {/* Thông tin thống kê */}
      <div className="grid grid-cols-4 mt-3 gap-3">
        <div className="bg-white h-[200px] rounded-lg text-center shadow-md flex flex-col justify-center items-center hover:scale-105 hover:shadow-lg transition-all duration-300">
          <h1 className="text-xl font-semibold">Tổng doanh thu</h1>
          <p className="mt-2 text-4xl font-bold">
            {isLoading
              ? "..."
              : `${statData.totalRevenue?.toLocaleString()} VND`}
          </p>
        </div>

        <div className="bg-white h-[200px] rounded-lg text-center shadow-md flex flex-col justify-center items-center hover:scale-105 hover:shadow-lg transition-all duration-300">
          <h1 className="text-xl font-semibold">Tổng Đơn hàng</h1>
          <p className="mt-2 text-4xl font-bold">
            {isLoading ? "..." : statData.totalOrders || 0}
          </p>
        </div>

        <div className="bg-white h-[200px] rounded-lg text-center shadow-md flex flex-col justify-center items-center hover:scale-105 hover:shadow-lg transition-all duration-300">
          <h1 className="text-xl font-semibold">Đang xử lý</h1>
          <p className="mt-2 text-4xl font-bold">
            {isLoading ? "..." : statData.processingOrders || 0}
          </p>
        </div>

        <div className="grid grid-rows-2 gap-3">
          <div className="bg-white h-[95px] rounded-lg text-center shadow-md flex flex-col justify-center items-center hover:scale-105 hover:shadow-lg transition-all duration-300">
            <h1 className="text-xl font-semibold">Thành công</h1>
            <p className="mt-2 text-4xl font-bold">
              {isLoading ? "..." : statData.successfulOrders || 0}
            </p>
          </div>
          <div className="bg-white h-[95px] rounded-lg text-center shadow-md flex flex-col justify-center items-center hover:scale-105 hover:shadow-lg transition-all duration-300">
            <h1 className="text-xl font-semibold">Thất bại</h1>
            <p className="mt-2 text-4xl font-bold">
              {isLoading ? "..." : statData.failedOrders || 0}
            </p>
          </div>
        </div>
      </div>

      {/* Biểu đồ cột */}
      <div className="mt-8">
        <h2 className="text-center text-xl font-semibold mb-4">
          Biểu đồ Cột Doanh Thu theo phương thức thanh toán từ tháng 1 đến tháng
          12
        </h2>
        <Bar data={chartData} options={chartOptions} />
      </div>
    </>
  );
};

export default memo(AdminStat);
