import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import useProfile from "../../../../Hooks/useProfile";

const AddReview = () => {
  const [profile, profileLoading] = useProfile();
  const {
    isLoading,
    isError,
    data: orderedData,
    error,
  } = useQuery({
    queryKey: ["allOrders", profile],
    enabled: !profileLoading,
    queryFn: async () => {
      const res = await axios.get(
        `${import.meta.env.VITE_SERVER_ADDRESS}/order-details?email=${
          profile?.email
        }&_id=${profile?._id}`,
        { withCredentials: true }
      );
      
      return res?.data?.allOrders;
    },
  });

  if (isLoading) {
    return <span>Loading... orderdetail</span>;
  }

  if (isError) {
    return <span>Error: {error?.response?.data?.message}</span>;
  }

  return (
    <>
      {/* <Helmet>
                <title>E-Mart |  Cart</title>
            </Helmet> */}

      {/* <SectionTitle subheading="My Cart" heading="WANNA ADD MORE?" /> */}

      <section className="mt-8 py-7 h-full  px-4 bg-white max-w-5xl mx-auto">
        {/* table  */}

        <div className="relative overflow-x-auto shadow-md sm:rounded-lg mt-5">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 ">
              <tr>
                
                <th scope="col" className="px-6 py-3">
                  Order Id
                </th>
                <th scope="col" className="px-6 py-3">
                  Status
                </th>
                <th scope="col" className="px-6 py-3">
                  Placed On
                </th>
                <th scope="col" className="px-6 py-3">
                  Price
                </th>
                <th scope="col" className="px-6 py-3">
                  Details
                </th>
              </tr>
            </thead>
            <tbody>
              {orderedData &&
                Array.isArray(orderedData) &&
                orderedData.map((i, count) => (
                  <tr
                    key={i?._id}
                    className={`bg-white border-b  hover:bg-gray-50 `}
                  >

                    {/* <td className="px-6 py-4">
                                        <img className="w-10 h-10 rounded-full" src={i?.image} alt={i?.name} />

                                    </td> */}
                    <td className={`px-6 py-4 ${i?.status === "Cancelled" && "text-red-500 font-medium"}`}>#{i?._id.slice(-6)}</td>
                    <td className={`px-6 py-4 ${i?.status === "Cancelled" && "text-red-500 font-medium"}`}>
                    {i?.status === "Cancelled" ? "Cancelled" :
                      i?.orderStatus[i?.orderStatus.length - 1]?.name}
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm">
                        {new Intl.DateTimeFormat("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        }).format(new Date(i?.orderStatus[0]?.time))}
                      </p>
                      <p className="text-sm">
                        {new Date(i?.orderStatus[0]?.time).toLocaleTimeString("en-US")}
                      </p>
                    </td>
                    <td className="px-6 py-4">${i?.finalAmount}</td>
                    <td className="px-6 py-4">
                    <Link to={`${i?._id}`} className="font-medium text-blue-600 hover:underline">See Details</Link>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
      
        </div>
      </section>
    </>
  );
};

export default AddReview;
