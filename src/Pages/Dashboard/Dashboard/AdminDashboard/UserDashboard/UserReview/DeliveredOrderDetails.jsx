import React, { useRef } from "react";
import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { BsCheckCircle } from "react-icons/bs";
import toast from "react-hot-toast";
import { TbCurrencyTaka } from "react-icons/tb";
import useProfile from "../../../../../../Hooks/useProfile";
import OrderDetailRow from "../OrderDetails/OrderDetailRow";
import DetailRow from "./DetailRow";

const DeliveredOrderDetails = () => {
  const { orderId } = useParams();
  const [profile, profileLoading] = useProfile();
  const {
    isLoading,
    isError,
    data: orderedData,
    error,
  } = useQuery({
    queryKey: ["details", profile, orderId],
    enabled: !profileLoading,
    queryFn: async () => {
      const res = await axios.get(
        `${import.meta.env.VITE_SERVER_ADDRESS
        }/order-detail-view/${orderId}?email=${profile?.email}`,
        { withCredentials: true }
      );
      console.log(res.data.details);
      return res?.data?.details;
    },
  });

  if (isLoading) {
    return <span>Loading... detailview</span>;
  }

  if (isError) {
    return <span>Error: {error?.response?.data?.message}</span>;
  }

  
  return (
    <>
      <div className="w-[300px] md:w-[600px] lg:w-[900px] h-full lg:p-20">
       
        
        <div className="bg-white p-5 rounded-md shadow-lg text-md mt-5">
          <DetailRow products={orderedData?.orderedItems}></DetailRow>
        </div>
        
      </div>

      <div></div>
    </>
  );
};

export default DeliveredOrderDetails;
