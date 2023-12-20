import axios from "axios";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import AdminTitle from "../../../../../Component/AdminTitle";
import { addDays } from "date-fns"; // Import the format function
import "react-datepicker/dist/react-datepicker.css";
import Swal from "sweetalert2";
import { DateRangePicker } from "react-date-range";

import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file

const AddCoupon = () => {
  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
    reset,
  } = useForm();

  const [state, setState] = useState([
    {
      startDate: new Date(),
      endDate: addDays(new Date(), 2),
      key: "selection",
    },
  ]);

  const dateFunction = (item) => {
    setState([item.selection]);
    //console.log(item.selection)
    if (item?.selection?.startDate && item?.selection?.endDate) {
      setValue(
        "start_Date",
        new Date(item.selection.startDate).toISOString().replace("Z", "+00:00")
      );
      setValue(
        "end_Date",
        new Date(item.selection.endDate).toISOString().replace("Z", "+00:00")
      );
    }
  };

  const onSubmit = (data) => {
    console.log(data);
    const {
      couponCode,
      percentage,
      minimumOrderAmount,
      maximumDiscountLimit,
      numberOfUse,
      start_Date,
      end_Date,
    } = data;

    const newCoupon = {
      couponCode,
      percentage: parseFloat(percentage).toFixed(2),
      minimumOrderAmount: parseFloat(minimumOrderAmount).toFixed(2),
      maximumDiscountLimit: parseFloat(maximumDiscountLimit).toFixed(2),
      numberOfUse: parseInt(numberOfUse),
      start_Date,
      end_Date,
    };

    console.log(newCoupon);

    axios
      .post(`${import.meta.env.VITE_SERVER_ADDRESS}/coupon`, newCoupon, {
        withCredentials: true,
      })
      .then((data) => {
        console.log("new", data.data);
        if (data.data.insertedId) {
          reset();
          Swal.fire({
            position: "top-end",
            icon: "success",
            title: "One new coupon code added",
            showConfirmButton: false,
            timer: 1500,
          });
        }
      })
      .catch((e) => {
        console.log(e);
        if (e?.response?.status === 409) {
        }
      });
  };

  return (
    <>
      <div className="w-full h-full px-10">
        <AdminTitle heading="Create New Coupon"></AdminTitle>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-control">
            <input
              type="text"
              placeholder="Coupon Code"
              className="input input-bordered rounded-md"
              {...register("couponCode", { required: true })}
            />
          </div>
          <div className="form-control my-3">
            <input
              placeholder="Percentage"
              type="text"
              className="input input-bordered rounded-md"
              {...register("percentage", {
                required: "Percentage is required",
                validate: (value) =>
                  !isNaN(Number(value)) || "Please enter a number",
              })}
            />
            {errors.percentage && (
              <p className="p-1 text-xs text-red-600">
                {errors.percentage.message}
              </p>
            )}
          </div>
          <div className="form-control">
            <input
              placeholder="Minimum Order Amount"
              type="number"
              className="input input-bordered rounded-md"
              {...register("minimumOrderAmount", {
                required: true,
                validate: (value) =>
                  !isNaN(Number(value)) || "Please enter a number",
              })}
            />
          </div>
          <div className="form-control my-3">
            <input
              placeholder="Maximum Discount Limit"
              type="number"
              className="input input-bordered rounded-md"
              {...register("maximumDiscountLimit", { required: true })}
            />
          </div>
          <div className="form-control">
            <input
              placeholder="Number of Use"
              type="number"
              className="input input-bordered rounded-md"
              {...register("numberOfUse", { required: true })}
            />
          </div>
          <div className="mt-3">
          <input
            type="checkbox"
            name="datePicker"
            id="datePicker"
            className="peer/datePicker hidden"
          />
          <label
            htmlFor="datePicker"
            className="text-gray-400"
          >
            Select Date Range
          </label>
          <div className="my-3">
            <DateRangePicker
              onChange={(item) => dateFunction(item)}
              showSelectionPreview={true}
              moveRangeOnFirstSelection={false}
              months={2}
              ranges={state}
              direction="horizontal"
            />
          </div>
          </div>

          <input
            type="submit"
            className="w-full h-12 cursor-pointer bg-primary text-white hover:bg-slate-200 hover:text-primary font-bold rounded-md"
            value="Add Coupon Code"
          />
        </form>
      </div>
    </>
  );
};

export default AddCoupon;
