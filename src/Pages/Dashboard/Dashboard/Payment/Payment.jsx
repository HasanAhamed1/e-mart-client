import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import React ,{useContext} from 'react';
import CheckoutForm from './CheckoutForm';
import { useLocation, useParams } from 'react-router-dom';
import { FaCcMastercard, FaCreditCard } from "react-icons/fa";
import { useQueries, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { AuthContext } from '../../../../Contexts/AuthProvider';

const stripePromise = loadStripe(import.meta.env.VITE_PAYMENT_GATEWAY_PK);

const Payment = () => {
    const {_OrderID} = useParams();
    const { user } = useContext(AuthContext);
   
  const { isLoading, isError, data : orderedData, error } = useQuery({
    queryKey: ['orderData', _OrderID],
    queryFn: async () => {

      const res = await axios.get(`${import.meta.env.VITE_SERVER_ADDRESS}/payment-methods?email=${user?.email}&_orderID=${_OrderID}`, { withCredentials: true })
   
      return res?.data;
    },
  })

  if (isLoading) {
    return <span>Loading... pay</span>
  }

  if (isError) {
    return <span>Error: {error.message}</span>
  }


    

    return (
        <>
            <div className='bg-white p-10'>
                <div className='flex gap-5 text-3xl mb-10'>
                    <FaCcMastercard />
                    <FaCreditCard />
                </div>
                <div>
                    <Elements stripe={stripePromise}>
                        <CheckoutForm price={orderedData?.totalAmount} products={orderedData?.productLength}></CheckoutForm>
                    </Elements>
                </div>
            </div>
        </>
    );
};

export default Payment;