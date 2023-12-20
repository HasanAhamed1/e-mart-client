import React, { useEffect, useState } from "react";
import useAddToCart from "../../Hooks/useAddToCart";
import { AiFillHeart, AiOutlineHeart, AiOutlineShoppingCart } from "react-icons/ai";
import { TbCurrencyTaka } from "react-icons/tb";
import { Link } from "react-router-dom";
import useCart from "../../Hooks/useCart";
import useRole from "../../Hooks/useRole";
import toast from "react-hot-toast";
import ReactStars from "react-rating-stars-component";
import { IoMdStar } from "react-icons/io";
// import useAddToWishList from "../../Hooks/useAddToWishList";
// import useWishList from "../../Hooks/useWishList";


const ProductCard = ({ showProduct }) => {
  const { _id, image, productTitle, price, mainPrice, quantity, reviews } = showProduct;

  const {role} = useRole();
  //console.log(role);

  const [cart] = useCart();
  // const [wishList] = useWishList();
  const [hoveredProduct, setHoveredProduct] = useState(null);
  const [alreadyAdded, setAlreadyAdded] = useState(false);
  // const [inWishList, setInWishList] = useState(false);

  useEffect(() => {
    if(role === "user")
    {
      setAlreadyAdded(cart.some((obj) => obj._id === _id));
    }
  }, [cart, _id, role]);

  // useEffect(() => {
  //   setInWishList(wishList.some((obj) => obj._id === _id));
  // }, [wishList, _id]);

  const handleMouseEnter = (product) => {
    setHoveredProduct(product);
  };

  const handleMouseLeave = () => {
    setHoveredProduct(null);
  };

  const handleAddToCart = useAddToCart();
  // const handleAddToWishList = useAddToWishList();

  // const toggleWishList = () => {
  //   if (!inWishList) {
  //     handleAddToWishList(showProduct);
  //   } else {
  //     // Handle removing from wishlist here if needed
  //   }
  //   setInWishList(!inWishList);
  // };

  // Calculate the average rating from the reviews array
  const calculateAverageRating = () => {
    if (!reviews || reviews?.length === 0) {
      return 0; // Return 0 if there are no reviews
    }
  
    // Calculate the sum of all ratings, ensuring that they are parsed as numbers
    const totalRating = reviews?.reduce((sum, review) => sum + parseFloat(review?.rating), 0);
  
    // Calculate the average rating by dividing the totalRating by the number of reviews
    const average = totalRating / reviews?.length;
  
    // Round the average to the nearest 0.5
    const roundedAverage = Math.round(average * 2) / 2;
  
    return roundedAverage;
  };
  
  // Use the calculateAverageRating function to get the average rating
  const averageRating = calculateAverageRating();


  return (
    <>
      <div className="w-36 h-60 lg:h-96 md:w-52 md:h-80 border bg-white rounded-md">
        <div
          className="relative"
          onMouseEnter={() => handleMouseEnter(showProduct)}
          onMouseLeave={handleMouseLeave}
        >
          <Link to={`/overView/${_id}`}>
            <figure>
              <img
                className="w-36 h-40 md:h-56 lg:h-64 md:w-52 rounded-md"
                src={image}
                alt={productTitle}
              />
            </figure>
          </Link>
          {hoveredProduct === showProduct && (
            <>
              {quantity > 0 ? (
                <div className="">
                  {alreadyAdded ? (
                    <button className="absolute bottom-0 left-1/2 transform -translate-x-1/2 -translate-y-0 flex justify-center items-center gap-2 lg:text-xl w-32 h-8 md:w-52 md:h-10 bg-accent text-white mx-auto">
                      <AiOutlineShoppingCart></AiOutlineShoppingCart>
                      <span className="">Added</span>
                    </button>
                  ) : (
                    <>

                    {/* TODO: Need to change or disable addToCart for admin and others */}
                    <button
                      // onClick={() => {["admin", "Order Manager", "Product Manager", "Delivery Partner"].includes(role) ? toast.error("You are not an user!") : handleAddToCart(showProduct, 1)}}
                      onClick={() => handleAddToCart(showProduct, 1)}
                      className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 -translate-y-0 flex justify-center items-center gap-2 lg:text-xl w-32 h-8 md:w-52 md:h-10 bg-accent text-white mx-auto ${
                        ["admin", "Order Manager", "Product Manager", "Delivery Partner"].includes(role)
                          ? "hidden"
                          : ""
                      }`}
                    >
                      <AiOutlineShoppingCart></AiOutlineShoppingCart>
                      <span className="">Add to Cart</span>
                    </button>
                    {/* <button
                        onClick={() => handleAddToWishList(showProduct, 1)}
                        className="absolute bottom-10 left-48 transform -translate-x-1/2 -translate-y-0 flex justify-center items-center gap-2 lg:text-xl w-32 h-8 md:w-52 md:h-10 mx-auto"
                      >
                        {inWishList ? (
                          <AiFillHeart className="text-red-600" />
                        ) : (
                          <AiOutlineHeart />
                        )}
                      </button> */}
                    </>
                  )}
                  
                </div>
              ) : (
                <button
                  className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 -translate-y-0 flex justify-center items-center gap-2 lg:text-xl w-32 h-8 md:w-52 md:h-10 bg-red-600 cursor-not-allowed text-white mx-auto ${
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
           </>
          )}
        </div>
        <hr className="mb-1" />
        <div className="border-t-2">
          <div className="my-1 text-center">
            <p className="text-gray-700 text-sm truncate text-ellipsis overflow-hidden px-3">
              {productTitle}
            </p>
            <p className="flex text-yellow-700 font-bold text-xs md:text-lg lg:text-xl justify-center lg:my-1">
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
              <div className="hidden md:flex justify-center">
              {averageRating ? (
                <ReactStars
                  count={5}
                  value={averageRating}
                  edit={false}
                  isHalf={true}
                  halfIcon={<i className="fa fa-star-half-alt"></i>}
                  fullIcon={<i className="fa fa-star"></i>}
                  size={20}
                  activeColor="#FB8C00"
                />
              ) : (
                <></>
              )}
            </div>
            }
            <div className="block md:hidden">
            {
              averageRating ? (<><p className="flex items-center justify-center gap-1 text-sm text-gray-700"><span className="text-accent text-lg"><IoMdStar /></span>{averageRating}/5<span>({reviews?.length})</span></p></>) : <></>
            }
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductCard;
