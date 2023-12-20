import React, { useRef } from "react";
import { Link, useParams } from "react-router-dom";
import useProfile from "../../../../../../Hooks/useProfile";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { BsCheckCircle } from "react-icons/bs";
import OrderDetailRow from "./OrderDetailRow";
import toast from "react-hot-toast";
import { TbCurrencyTaka } from "react-icons/tb";

const OrderDetailsView = () => {
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

  const handleCopyClick = () => {
    const OTP = orderedData?.OTP;

    if (OTP) {
      navigator.clipboard
        .writeText(OTP)
        .then(() => {
          toast.success("OTP copied to clipboard");
        })
        .catch((error) => {
          console.error("Failed to copy OTP: ", error);
        });
    }
  };
  return (
    <>
      <div className="w-full lg:w-[900px] h-full p-10 lg:p-20">
        <div className="bg-white p-5 rounded-md shadow-lg text-md grid gap-1">
          <p>
            Order Id:{" "}
            <span className="font-semibold text-accent">
              #{orderId.slice(-6)}
            </span>
          </p>
          <p>
            Receiver:{" "}
            <span className="font-semibold uppercase">{profile?.name}</span>
          </p>
          <p>
            <span className="font-semibold">{orderedData?.userPhone}</span>
          </p>
          <p>
            <span className="font-semibold text-slate-600">
              {orderedData?.userAddress}, {orderedData?.userCity}
            </span>
          </p>
          {orderedData?.deliveryPartner?.name && (
            <p>
              Delivery Partner:{" "}
              <span title={`Email: ${orderedData?.deliveryPartner?.email}`} className="font-semibold text-accent">
                {orderedData?.deliveryPartner?.name}
              </span>
            </p>
          )}

        </div>



        {orderedData?.OTP && (
          <div className="bg-white p-5 rounded-md shadow-lg text-md mt-5">
            <p className="flex items-center gap-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M11.02 19.5H7.5C6.88 19.5 6.33 19.48 5.84 19.41C3.21 19.12 2.5 17.88 2.5 14.5V9.5C2.5 6.12 3.21 4.88 5.84 4.59C6.33 4.52 6.88 4.5 7.5 4.5H10.96"
                  stroke="#292D32"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M15.02 4.5H16.5C17.12 4.5 17.67 4.52 18.16 4.59C20.79 4.88 21.5 6.12 21.5 9.5V14.5C21.5 17.88 20.79 19.12 18.16 19.41C17.67 19.48 17.12 19.5 16.5 19.5H15.02"
                  stroke="#292D32"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M15 2V22"
                  stroke="#292D32"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M11.0946 12H11.1036"
                  stroke="#292D32"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M7.0946 12H7.10359"
                  stroke="#292D32"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              One time password (OTP) for package collection{" "}
              <span
                className="flex items-center gap-1 text-accent italic"
                title="Click to copy"
                onClick={handleCopyClick}
              >
                {orderedData?.OTP} {" "}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    d="M9.31006 14.7L10.8101 16.2L14.8101 12.2"
                    stroke="#292D32"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M10 6H14C16 6 16 5 16 4C16 2 15 2 14 2H10C9 2 8 2 8 4C8 6 9 6 10 6Z"
                    stroke="#292D32"
                    strokeWidth="1.5"
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M16 4.02002C19.33 4.20002 21 5.43002 21 10V16C21 20 20 22 15 22H9C4 22 3 20 3 16V10C3 5.44002 4.67 4.20002 8 4.02002"
                    stroke="#292D32"
                    strokeWidth="1.5"
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </p>
          </div>
        )}

        <div className="bg-white p-10 rounded-md shadow-lg text-md grid gap-1 mt-5">
          <ol className="relative border-l border-gray-200 ">
            {orderedData.orderStatus.map((i, index) => (
              <li key={index} className="mb-10 ml-4">
                <div className="absolute w-3 h-3 bg-gray-200 rounded-full mt-1.5 -left-1.5 border border-white"></div>
                <time className="flex items-center gap-1 mb-1 text-sm font-normal leading-none text-gray-400 ">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M8 2V5"
                      stroke="#292D32"
                      strokeWidth="1.5"
                      strokeMiterlimit="10"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M16 2V5"
                      stroke="#292D32"
                      strokeWidth="1.5"
                      strokeMiterlimit="10"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M3.5 9.08997H20.5"
                      stroke="#292D32"
                      strokeWidth="1.5"
                      strokeMiterlimit="10"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M21 8.5V17C21 20 19.5 22 16 22H8C4.5 22 3 20 3 17V8.5C3 5.5 4.5 3.5 8 3.5H16C19.5 3.5 21 5.5 21 8.5Z"
                      stroke="#292D32"
                      strokeWidth="1.5"
                      strokeMiterlimit="10"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M15.6947 13.7H15.7037"
                      stroke="#292D32"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M15.6947 16.7H15.7037"
                      stroke="#292D32"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M11.9955 13.7H12.0045"
                      stroke="#292D32"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M11.9955 16.7H12.0045"
                      stroke="#292D32"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M8.29431 13.7H8.30329"
                      stroke="#292D32"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M8.29431 16.7H8.30329"
                      stroke="#292D32"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  {new Intl.DateTimeFormat("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  }).format(new Date(i?.time))}{" "}
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M22 12C22 17.52 17.52 22 12 22C6.48 22 2 17.52 2 12C2 6.48 6.48 2 12 2C17.52 2 22 6.48 22 12Z"
                      stroke="#292D32"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M15.71 15.18L12.61 13.33C12.07 13.01 11.63 12.24 11.63 11.61V7.51001"
                      stroke="#292D32"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  {new Date(i?.time).toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </time>
                <h3 className="text-lg font-semibold text-gray-900 ">
                  {i?.name}
                </h3>

                <p className="mb-4 text-base font-normal text-gray-500 ">
                  {i?.message}
                </p>

              </li>
            ))}
          </ol>

          {orderedData?.status === "Cancelled"
            && <>
              <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm ">
                <div className="items-center justify-between mb-3 sm:flex">
                  <div className="mb-1 text-xs font-normal text-gray-400 sm:order-last sm:mb-0">{orderedData?.status}&#39;s message</div>
                  <div className="text-sm      text-red-500 font-medium">The Order has been &#39;{orderedData?.status}&#39;</div>
                </div>
                <div className="p-3 text-xs italic font-normal text-gray-500 border border-gray-200 rounded-lg bg-gray-50">
                  Your order has been canceled. If you have already made a payment and require a refund, please contact our administrator for assistance. We apologize for any inconvenience this may have caused.
                </div>
              </div>
            </>
          }
          {
            orderedData?.status !== "Cancelled" && orderedData?.orderStatus && Array.isArray(orderedData?.orderStatus) &&
            orderedData?.orderStatus[orderedData?.orderStatus.length - 1]?.name === "Payment Pending" &&
            <Link
              to={`/dashboard/payment-methods/${orderedData._id}`}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:outline-none focus:ring-gray-200 focus:text-blue-700 max-w-fit"
            >
              Pay Now{" "}
              <svg
                className="w-3 h-3 ml-2"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 14 10"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M1 5h12m0 0L9 1m4 4L9 9"
                />
              </svg>
            </Link>
          }

        </div>

        <div className="bg-white md:p-5 rounded-md shadow-lg text-md mt-5">
          <OrderDetailRow products={orderedData?.orderedItems}></OrderDetailRow>
        </div>
        <div className="w-full" >
          {/* price section  */}
          <div className="bg-white px-2 py-5 rounded-md shadow-lg text-md  mt-5 pb-20 flex justify-end ">

            <div className=" w-screen  max-w-[400px] pr-5">

              <div className="flex justify-between items-center h-10">
                <p className="col-span-4">Subtotal:</p>
                <p className="col-span-2 flex items-center"><TbCurrencyTaka />{orderedData?.subTotalAmount}</p>
              </div>
              <div className="flex justify-between items-center h-10">
                <p className="col-span-4">Delivery Charge</p>
                <p className="col-span-2 flex items-center"><TbCurrencyTaka />{orderedData?.courirerCharge}</p>
              </div>
              <div className="flex justify-between items-center h-10">
                <p className="col-span-4">Discount</p>
                <p className="col-span-2 flex items-center text-red-500"><TbCurrencyTaka />-{orderedData?.discountedAmount}</p>
              </div>
              <hr className="mt-2" />
              <div className="flex justify-between items-center h-10 mt-3 font-semibold">
                <p className="col-span-4">Total </p>
                <p className="col-span-2 flex items-center"><TbCurrencyTaka />{orderedData?.finalAmount}</p>
              </div>


      
       


            </div>
          </div>
        </div >
{/* 
        <div className="bg-white p-10 rounded-md shadow-lg text-md grid gap-1 mt-5">
          <div className="grid grid-cols-4">
            <div className=" col-span-3">
              <p>Subtotal:</p>
              <p>Delivery Charge:</p>
              <p>Discounts:</p>
            </div>
            <div>
              <p>{orderedData.subTotalAmount}</p>
              <p>{orderedData.courirerCharge}</p>
              <p>- {orderedData.discountedAmount}</p>
              <p>
                {orderedData.orderedItems.length}{" "}
                {(orderedData.orderedItems.length > 1 && <>Items</>) || (
                  <>Item</>
                )}
              </p>
              <p>Total: {orderedData.finalAmount}</p>
            </div>
          </div>
        </div> */}
      </div>

      <div></div>
    </>
  );
};

export default OrderDetailsView;
