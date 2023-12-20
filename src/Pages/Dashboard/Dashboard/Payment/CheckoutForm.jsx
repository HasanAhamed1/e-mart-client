import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { AuthContext } from "../../../../Contexts/AuthProvider";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import SuccessFullPage from "./SuccessFullPage";
import PaymentError from "./PaymentError";
import Field from "./Field";
import CardField from "./CardField";
import { TbCurrencyTaka } from "react-icons/tb";

//import './CheckoutForm.css'

const CheckoutForm = ({ price, products }) => {
  console.log(price, products);
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const stripe = useStripe();
  const elements = useElements();
  const [cardError, setCardError] = useState("");
  const [cardComplete, setCardComplete] = useState(false);
  const [clientSecret, setClientSecret] = useState("");
  const [processing, setProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [transactionId, setTransactionId] = useState("");
  const [billingDetails, setBillingDetails] = useState({
    email: "",
    phone: "",
    name: "",
  });

  const { _OrderID } = useParams();

  const {
    isLoading,
    isError,
    data: orderedData,
    error,
  } = useQuery({
    queryKey: ["orderData", _OrderID],
    queryFn: async () => {
      const res = await axios.get(
        `${import.meta.env.VITE_SERVER_ADDRESS}/payment-methods?email=${
          user?.email
        }&_orderID=${_OrderID}`,
        { withCredentials: true }
      );

      return res?.data;
    },
  });

  if (isLoading) {
    return <span>Loading... checkouy</span>;
  }

  if (isError) {
    return <span>Error: {error?.response?.data?.message}</span>;
  }

  useEffect(() => {
    axios
      .post(`https://e-mart-server-one.vercel.app/create-payment-intent`, {
        price,
      })
      .then((res) => {
        //console.log(res.data.clientSecret);
        setClientSecret(res.data.clientSecret);
      });
  }, [price]);

  const handleSubmit = async (event) => {
    // Block native form submission.
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not loaded yet. Make sure to disable
      // form submission until Stripe.js has loaded.
      return;
    }
    // Get a reference to a mounted CardElement. Elements knows how
    // to find your CardElement because there can only ever be one of
    // each type of element.
    const card = elements.getElement(CardElement);

    if (card == null) {
      return;
    }

    if (error) {
      card.focus();
      return;
    }

    if (cardComplete) {
      setProcessing(true);
    }

    const payload = await stripe.createPaymentMethod({
      type: "card",
      card,
      billing_details: billingDetails,
    });

    if (payload.error) {
      setCardError(payload.error.message);
    } else {
      setProcessing(true);
    }

    const { paymentIntent, error: intentError } =
      await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: card,
          billing_details: billingDetails,
        },
      });
    setProcessing(false);

    if (intentError) {
      setCardError(intentError.message);
    }
    //console.log(paymentIntent);

    if (payload.error) {
      setCardError(payload.error);
    } else {
      setPaymentMethod(payload.paymentMethod);

      if (paymentIntent.status === "succeeded") {
        setTransactionId(paymentIntent.id);
        const updatedData = {
          typeOfPayment: "Card",
          email: user?.email,
          transaction_method_email:
            payload.paymentMethod?.billing_details?.email,
          transaction_method_name: payload.paymentMethod?.billing_details?.name,
          transaction_method_phone:
            payload.paymentMethod?.billing_details?.phone,
          transactionId: paymentIntent.id,
          methodID: payload.paymentMethod?.id,
          price: parseFloat((paymentIntent?.amount / 100.0).toFixed(2)),
          // orderLength: products.length,
          // productsID: products.map(i => i?._id),
          // menuItems: products.map(i => i?.productID),
          // itemsName: products.map(i => { return {  name: i?.name, price: i?.price } }),
          payment_date: new Date().toISOString(),
        };

        axios
          .patch(
            `${import.meta.env.VITE_SERVER_ADDRESS}/payment/${_OrderID}?email=${
              user?.email
            }`,
            updatedData,
            { withCredentials: true }
          )
          .then((data) => {
            toast.success("successfully paid");
            navigate("/dashboard/order-details");
          })
          .catch((e) => {
            toast.error("try again");
            console.error(e);
          });
      }
    }
  };

  const reset = () => {
    setCardError(null);
    setProcessing(false);
    setPaymentMethod(null);
    setBillingDetails({
      email: "",
      phone: "",
      name: "",
    });
  };

  if (paymentMethod && transactionId) {
    return (
      <SuccessFullPage
        transactionId={transactionId}
        id={paymentMethod.id}
        reset={reset}
      />
    );
  }

  return (
    <>
      <div className="w-60 md:w-96 lg:w-[500px]">
        <form onSubmit={handleSubmit}>
          <fieldset className="FormGroup">
            <Field
              label="Name"
              id="name"
              type="text"
              required
              autoComplete="name"
              value={billingDetails.name}
              onChange={(e) => {
                setBillingDetails({ ...billingDetails, name: e.target.value });
              }}
            />
            <Field
              label="Email"
              id="email"
              type="email"
              required
              autoComplete="email"
              value={billingDetails.email}
              onChange={(e) => {
                setBillingDetails({ ...billingDetails, email: e.target.value });
              }}
            />
            <Field
              label="Phone"
              id="phone"
              type="tel"
              required
              autoComplete="tel"
              value={billingDetails.phone}
              onChange={(e) => {
                setBillingDetails({ ...billingDetails, phone: e.target.value });
              }}
            />
          </fieldset>
          <fieldset className="FormGroup mt-5">
            <CardField
              onChange={(e) => {
                setCardError(e.error);
                setCardComplete(e.complete);
              }}
            />
          </fieldset>
          {error && <PaymentError message={error.message} />}
          <button
            type="submit"
            disabled={!stripe || !clientSecret || processing}
            className="bg-accent text-white font-bold text-lg p-2 rounded-md mt-10"
          >
            <span className="inline-flex">Pay Now Only <TbCurrencyTaka />{price}</span>
          </button>
        </form>
        {cardError && toast.error(cardError)}
        {transactionId && (
          <p className="text-green-900">Transaction IDL: {transactionId}</p>
        )}
      </div>
    </>
  );
};

export default CheckoutForm;
