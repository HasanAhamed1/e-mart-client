import React, { useContext } from 'react';
import { AuthContext } from '../../../../Contexts/AuthProvider';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import UserTitle from '../../../../Component/UserTitle';
import { TbCurrencyTaka } from 'react-icons/tb';
import usePaymentHistory from '../../../../Hooks/usePaymentHistory';
import useProfile from '../../../../Hooks/useProfile';

const PaymentHistory = () => {

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
        

        <section className="mt-8 py-7 px-4 bg-white max-w-5xl mx-auto">
        <UserTitle heading="Payment History" />
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg mt-5">
        <table className="w-full text-sm text-left text-gray-500">
          {/* head */}
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 ">
            <tr>
              <th scope="col" className="px-6 py-3">User Info</th>
            <th scope="col" className="px-6 py-3">Type Of Payment</th>
              <th scope="col" className="px-6 py-3">Transaction Id</th>
              
              <th scope="col" className="px-6 py-3">Amount</th>
              <th scope="col" className="px-6 py-3">Date & Time</th>
            </tr>
          </thead>
          <tbody>
            {/* row 1 */}
            {orderedData.map((info, index) => (
              <tr key={info?._id} className="bg-white border-b  hover:bg-gray-50 ">
                <td>{info?.transaction_method_name} {info?.transaction_method_email} {info?.transaction_method_phone}</td>
                <td className="px-6 py-4">{info?.typeOfPayment}</td>
                <td className="px-6 py-4">{info?.transactionId}</td>
                <td className='px-6 py-4 flex items-center'><TbCurrencyTaka />{info?.finalAmount}</td>
                <td>{info?.payment_date}</td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </section>
        </>
    );
};

export default PaymentHistory;