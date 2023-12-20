import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { AiFillFileText, AiOutlineFileText } from "react-icons/ai";
import { BiCategoryAlt } from "react-icons/bi";
import { BsBag } from "react-icons/bs";
import useAxiosSecure from "../../../../../Hooks/useAxiosSecure";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Label,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import Loading from "../../../../Shared/Loading/Loading";

const AdminHome = () => {
  const { axiosSecure } = useAxiosSecure();
  const { data: stat = [], refetch } = useQuery(["stat"], async () => {
    const res = await axiosSecure.get("/admin-stats", {
      withCredentials: true,
    });
    console.log(res.data);
    return res.data;
  });

  const COLORS = ["#64c5b1", "rgb(230, 137, 0)", "#DCDCDC"]; // Customize colors as needed

  const [chartWidth, setChartWidth] = useState(600); // Initial width value

  useEffect(() => {
    const handleResize = () => {
      const screenWidth = window.innerWidth;

      if (screenWidth < 375) {
        setChartWidth(300); // Set width for small screens
      } else if (screenWidth <= 768) {
        setChartWidth(350); // Set width for small screens
      } else if (screenWidth <= 1024) {
        setChartWidth(300); // Set width for medium screens
      } else {
        setChartWidth(450); // Set width for large screens
      }
    };

    handleResize(); // Set initial width

    window.addEventListener("resize", handleResize); // Add event listener for window resize

    return () => {
      window.removeEventListener("resize", handleResize); // Clean up event listener on component unmount
    };
  }, []);
  return (
    <>
      <div className="w-full h-full">
        <div className="h-28 md:h-16 lg:h-[100px] bg-gradient-to-r from-primary to-white relative py-2">
          <div className="grid grid-cols-2 md:grid-cols-4 w-[250px] md:w-[600px] xl:w-[1000px] gap-2 mx-auto md:absolute md:inset-x-0 md:-bottom-8 lg:inset-x-0 lg:-bottom-11">
            <div className="w-28 h-12 md:w-36 md:h-16 lg:w-[200px] lg:h-[90px] rounded-[11px] backdrop-blur-xl bg-white/50 flex items-center justify-center gap-2 lg:gap-5 drop-shadow-md px-2">
              <div className="md:bg-white rounded-xl">
                <BiCategoryAlt className="md:m-1 lg:m-2 lg:text-lg" />
              </div>
              <div>
                <h3 className="text-[9px] lg:text-xl text-[#64748B]">Users</h3>
                <p className="text-sm lg:text-[30px] text-[#1E293B]">
                  {stat.users}
                </p>
              </div>
            </div>
            <div className="w-28 h-12 md:w-36 md:h-16 lg:w-[200px] lg:h-[90px] rounded-[11px] backdrop-blur-xl bg-white/50 flex items-center justify-center gap-2 lg:gap-5 drop-shadow-md px-2">
              <div className="md:bg-white rounded-xl">
                <BiCategoryAlt className="md:m-1 lg:m-2 lg:text-lg" />
              </div>
              <div>
                <h3 className="text-[9px] lg:text-xl text-[#64748B]">
                  Products
                </h3>
                <p className="text-sm lg:text-[30px] text-[#1E293B]">
                  {stat.products}
                </p>
              </div>
            </div>
            <div className="w-28 h-12 md:w-36 md:h-16 lg:w-[200px] lg:h-[90px] rounded-[11px] backdrop-blur-xl bg-white/50 flex items-center justify-center gap-2 lg:gap-5 drop-shadow-md px-2">
              <div className="md:bg-white rounded-xl">
                <AiFillFileText className="md:m-1 lg:m-2 lg:text-lg" />
              </div>
              <div>
                <h3 className="text-[9px] lg:text-xl text-[#64748B]">
                  Revenue
                </h3>
                <p className="text-sm lg:text-[30px] text-[#1E293B]">
                  {stat.revenue}
                </p>
              </div>
            </div>
            <div className="w-28 h-12 md:w-36 md:h-16 lg:w-[200px] lg:h-[90px] rounded-[11px] backdrop-blur-xl bg-white/50 flex items-center justify-center gap-2 lg:gap-5 drop-shadow-md px-2">
              <div className="md:bg-white rounded-xl">
                <BsBag className="md:m-1 lg:m-2 lg:text-lg" />
              </div>
              <div>
                <h3 className="text-[9px] lg:text-xl text-[#64748B]">
                  Total Orders
                </h3>
                <p className="text-sm lg:text-[30px] text-[#1E293B]">
                  {stat.orders}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 md:mt-12 lg:mt-24 mx-3 lg:mx-20 grid grid-cols-1 md:grid-cols-2 gap-5 justify-center">
          {/* revenue graph  */}
          <div className="" aria-label="revenue graph">
            <div className="rounded-lg shadow-md">
              <div className="m-5">
                <h1 className="text-lg">
                  Revenue <span className="text-xs">in tk</span>
                </h1>
              </div>

              <AreaChart
                width={chartWidth}
                height={288}
                data={stat.finalAmountByMonth}
                margin={{
                  top: 10,
                  right: 30,
                  left: 0,
                  bottom: 0,
                }}
                className=""
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey={"month"} className="text-[10px]" />
                <YAxis className="text-[10px]" />
                <Tooltip />
                <Legend />
                <Area
                  type="monotone"
                  dataKey={"totalFinalAmount"}
                  stroke="#64c5b1"
                  fill="#64c5b1"
                />
              </AreaChart>
            </div>
          </div>

          {/* order graph  */}
          <div className="rounded-lg shadow-md" aria-label="order graph">
            <div className="m-5">
              <h1 className="text-lg">Order Summary</h1>
            </div>
            <LineChart
              width={chartWidth}
              height={288}
              data={stat.ordersByMonth}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" className="text-[10px]" />
              <YAxis className="text-[10px]" />
              <Tooltip />

              <Line type="monotone" dataKey="totalOrders" stroke="#64c5b1" />
            </LineChart>
          </div>

          {/* Order per category  */}
          <div
            className="rounded-lg shadow-md"
            aria-label="New Users Per Month graph"
          >
            <div className="m-5">
              <h1 className="text-lg">Order Summary Per Category</h1>
            </div>
            <BarChart
              width={chartWidth}
              height={288}
              data={stat.ordersByCategory}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" className="text-[10px]" />
              <YAxis className="text-[10px]" />
              <Tooltip />

              <Bar dataKey="totalOrders" fill="#64c5b1" />
            </BarChart>
          </div>

          {/* completed order pie chart */}
          <div className="" aria-label="completed order pie chart">
            <div className="rounded-lg shadow-md">
              <div className="m-5">
                <h1 className="text-lg">Orders Completed vs Pending vs Cancelled</h1>
              </div>
              {stat.ordersStatusArray ? (
                <PieChart width={300} height={300}>
                  <Pie
                    data={stat.ordersStatusArray}
                    dataKey="totalOrders" // Update to the correct data property
                    outerRadius={90}
                    innerRadius={50}
                    labelLine={false}
                  >
                    {stat.ordersStatusArray.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                        className="shadow-lg"
                      />
                    ))}
                    <Label
                      value={stat.ordersStatusArray.reduce(
                        (sum, data) => sum + data.totalOrders,
                        0
                      )} // Update to the correct data property
                      position="center"
                      fontSize={24}
                      fontWeight="bold"
                    />
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              ) : (
                <Loading></Loading>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminHome;
