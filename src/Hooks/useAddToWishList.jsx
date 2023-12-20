import { useContext } from "react";
import { AuthContext } from "../Contexts/AuthProvider";
import useCart from "./useCart";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";
import Error from "../Pages/Shared/error/Error";
// import useWishList from "./useWishList";

const useAddToWishList = () => {

  const { user } = useContext(AuthContext);
  // const [, refetch] = useWishList();

  const navigate = useNavigate();
  const location = useLocation();

  const handleAddToWishList = (featuredProduct, quantity) => {
    console.log(featuredProduct);
    if (user && user.email) {
      const WishListProduct = {
        productId: featuredProduct._id,
        quantity : quantity,
        email: user.email,
        checked: false
      }
      // console.log(cartProduct);
      axios.post(`${import.meta.env.VITE_SERVER_ADDRESS}/add-to-wish-list`, WishListProduct, { withCredentials: true } )
      .then((response) => {
        console.log(response);
        // Check if the response contains the updated cart data
        const updatedWishList = response?.data?.wishList;
        console.log('Updated Wish List:', updatedWishList);
          if (updatedWishList) {
            //console.log(data.data)
            refetch();
            Swal.fire({
              position: 'top-end',
              icon: 'success',
              title: 'Product added on the Wish List.',
              showConfirmButton: false,
              timer: 1500
            })
          }
        })
        .catch((e) => {
          console.error(e);
          // <Error />;
        });
    }
    else {
      Swal.fire({
        title: 'Please login to order the product',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Login Now!'
      }).then((result) => {
        if (result.isConfirmed) {
          navigate('/login', { state: { from: location } })
        }
      })
    }
  }

  return handleAddToWishList;

};

export default useAddToWishList;