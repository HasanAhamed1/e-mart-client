import axios from "axios";
import React from "react";
import { useForm } from "react-hook-form";
import { TbCurrencyTaka } from "react-icons/tb";
import Swal from "sweetalert2";
import useProfile from "../../../../../../Hooks/useProfile";

const DetailRow = ({ products }) => {
    //console.log(products)
  return (
    <>
      <div className="h-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
      {products &&
            Array.isArray(products) &&
            products.map((i, count) => (
          <div key={count} className="">
            <div className="border rounded-md shadow-lg w-52 h-96 mx-auto p-3">
              <div className="h-52">
                <figure>
                  <img
                    className="w-32 h-40 mx-auto"
                    src={i?.productImage}
                    alt={i?.productName}
                  />
                </figure>

                <div className="my-1 text-center">
                  <p className="text-gray-700 text-sm px-3">
                    {i?.productName}
                  </p>
                 
                </div>
                
                </div>
                <div>
                <ReviewForm cart_product={i} id={i?.productId} />
                </div>
              
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

const ReviewForm = ({ cart_product, id }) => {
    const [profile] = useProfile();
    const {
      register,
      handleSubmit,
      formState: { errors },
      reset
    } = useForm();
  
    const onSubmit = (data) => {
        const { rating, comment } = data;
        const {_id, name, email} = profile
        const reviewData = { rating: parseFloat(rating),
           comment, _id, name, email };
      
        axios
          .post(`${import.meta.env.VITE_SERVER_ADDRESS}/products/${id}/reviews`, reviewData, {
            withCredentials: true,
          })
          .then((response) => {
            console.log("Review added:", response.data);
            if (response.data?.message === "Review added successfully.") {
              reset(); // Clear the form
              Swal.fire({
                icon: "success",
                title: "Review submitted successfully",
                showConfirmButton: false,
                timer: 1500,
              });
            } else {
              Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Review submission failed",
              });
            }
          })
          .catch((error) => {
            console.error("Error adding review:", error);
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: "Something went wrong",
            });
          });
      };
      
    
  
    return (
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Add a hidden field to store the cart_product ID */}
        <input type="hidden" {...register("productId")} value={id} />
  
        <div className="form-control">
          <input
            type="number"
            placeholder="Rating 1 to 5"
            className="input input-bordered rounded-md"
            {...register("rating", { required: true })}
          />
        </div>
        <div className="form-control">
          <textarea
            placeholder="Comment Here"
            className="textarea textarea-bordered rounded-md h-14 my-2"
            {...register("comment", { required: true })}
          ></textarea>
        </div>
        <input
          type="submit"
          className="w-full h-8 bg-accent cursor-pointer text-white text-sm font-semibold rounded-md"
          value="Add your review"
        />
      </form>
    );
  };

export default DetailRow;
