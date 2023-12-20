import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import React from 'react';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import DeliveryChargeCard from './DeliveryChargeCard';
import AdminTitle from '../../../../../Component/AdminTitle';

const DeliveryCharge = () => {
  const {
    data: places = []
  } = useQuery(["places"], async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_SERVER_ADDRESS}/address`);
      //console.log(res.data);
      return res.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "An error occurred");
    }
  });

  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
    reset,
  } = useForm();

  const onSubmit = (data) => {
    console.log(data)
    const { defaultCharge, minimumOrderCostLimit, address, deliveryCharge } = data;
    const newDeliveryCharge = {
      defaultCharge: parseInt(defaultCharge),
      minimumOrderCostLimit: parseInt(minimumOrderCostLimit),
      address,
      deliveryCharge: parseInt(deliveryCharge),
    };
    console.log(newDeliveryCharge);

    axios
      .post(`${import.meta.env.VITE_SERVER_ADDRESS}/delivery-charge`, newDeliveryCharge, {
        withCredentials: true,
      })
      .then((data) => {
        console.log("new", data.data);
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Done",
          showConfirmButton: false,
          timer: 1500,
        });
      })
      .catch((e) => {
        console.log(e);
        if (e?.response?.status === 409) {
          //
        }
      });
  }

  return (
    <>
      <div className="bg-white w-fit h-full p-5 lg:p-10">

        <AdminTitle heading="Delivery Charges" />

        {
          places.map((p, _idx) => <DeliveryChargeCard key={p?._id} disctrict={p} count={_idx} />)
        }

      </div>
    </>
  );
};

export default DeliveryCharge;