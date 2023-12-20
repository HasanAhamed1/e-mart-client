import React, { useEffect, useState } from "react";
import useAddToCart from "../../Hooks/useAddToCart";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { TbCurrencyTaka } from "react-icons/tb";
import { useLoaderData, useParams } from "react-router-dom";
import useCart from "../../Hooks/useCart";
import ReactStars from "react-rating-stars-component";
import useRole from "../../Hooks/useRole";
import AutoBackToTop from "../../Component/AutoBackToTop";

const ProductOverView = () => {
  const {role} = useRole();
  const productDetail = useLoaderData();
  const {
    _id,
    image,
    productTitle,
    price,
    mainPrice,
    des,
    weight,
    size,
    quantity,
    reviews
  } = productDetail;
  console.log(productDetail)

  const [selectedSize, setSelectedSize] = useState(""); // State to track the selected size
  const [cart] = useCart();

  const [alreadyAdded, setAlreadyAdded] = useState(false);
  
  const handleAddToCart = useAddToCart();

  useEffect(() => {
    if(role === "user")
    {
      setAlreadyAdded(cart.some((obj) => obj._id === _id));
    }
  }, [cart, _id, role]);


  return (
    <>
      <div className="md:flex my-10 mx-5 md:mx-16 md:gap-8">
        <figure>
          <img
            className="w-60 md:h-[450px] md:w-96 border"
            src={image}
            alt={productTitle}
          />
        </figure>

        <div className=" md:w-3/5">
          <p className="text-gray-700 text-xl font-bold">{productTitle}</p>

          <div className="divider"></div>
          <p className="flex text-yellow-700 font-bold lg:text-xl my-1">
            <TbCurrencyTaka></TbCurrencyTaka>
            {price}
            {mainPrice && (
              <s className="flex text-sm text-gray-600">
                <TbCurrencyTaka></TbCurrencyTaka>
                {mainPrice}
              </s>
            )}
          </p>
          {
            weight && (<><div className="divider"></div>
            <p>Weight: {weight}</p></>)
          }
          {/* Size selection dropdown */}
          {/* {size && (
            <>
              <div className="divider"></div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Size</span>
                </label>
                <select
                  value={selectedSize}
                  onChange={(e) => setSelectedSize(e.target.value)}
                  className="select select-bordered rounded-md w-full max-w-xs"
                >
                  {size?.map((sizeOption) => (
                    <option key={sizeOption.trim()} value={sizeOption.trim()}>
                      {sizeOption.trim()}
                    </option>
                  ))}
                </select>
              </div>
            </>
          )} */}
          {
            size && (<><div className="divider"></div>
            <p>Size: {size}</p></>)
          }
          <div className="divider"></div>
          <p>Current Stock: {quantity}</p>

          {quantity > 0 ? (
            alreadyAdded ? (
              <button className="flex justify-center items-center gap-2 rounded-lg  lg:text-xl w-32 h-8 md:w-48 md:h-14 bg-accent text-white mt-5">
                <AiOutlineShoppingCart />
                <span>Added</span>
              </button>
            ) : (
              <button
                onClick={() => handleAddToCart(productDetail, 1)}
                className={`flex justify-center items-center gap-2 rounded-lg lg:text-xl w-32 h-8 md:w-48 md:h-14 bg-accent text-white mt-5 ${
                  ["admin", "Order Manager", "Product Manager", "Delivery Partner"].includes(role)
                    ? "hidden"
                    : ""
                }`}
              >
                <AiOutlineShoppingCart />
                <span>Add to Cart</span>
              </button>
            )
          ) : (
            <button
              className={`flex justify-center items-center gap-2 rounded-lg  lg:text-xl w-32 h-8 md:w-48 md:h-14 bg-accent text-white mt-5 ${
                ["admin", "Order Manager", "Product Manager", "Delivery Partner"].includes(role)
                  ? "hidden"
                  : ""
              }`}
              disabled
            >
              <AiOutlineShoppingCart />
              <span>Out of Stock</span>
            </button>
          )}
        </div>
      </div>
      {
        des && (<div className="border p-5 m-16">
        <h3 className="text-xl font-bold">Description</h3>
        <div className="divider"></div>
        <p className=" text-gray-600">{des}</p>
      </div>)
      }

      {
        reviews.length===0 ? <></> : (<div className="border p-5 m-5 md:m-16 overflow-y-scroll h-96">
        <h3 className="text-xl font-bold">Reviews</h3>
        <div className="divider"></div>
        {
          reviews?.map((review, index) => (
            <div key={index}>
              <p>Posted By <span className="font-semibold italic text-orange-800">{review?.name}</span> <span className="text-sm text-gray-600">on {new Intl.DateTimeFormat("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  }).format(new Date(review?.createdAt))}</span></p>
              <ReactStars
              count={5}
              value={review?.rating}
              edit={false}
              size={24}
              activeColor="#ffd700"
            />
              <p className="text-sm text-justify text-gray-500">{review?.comment}</p>
              <div className="divider"></div>
            </div>
          ))
        }
      </div>)
      }
      <AutoBackToTop />
    </>
  );
};

export default ProductOverView;
