import { useContext } from "react";
import { AuthContext } from "../Contexts/AuthProvider";
import useCart from "./useCart";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";
import Error from "../Pages/Shared/error/Error";

const useAddToCart = () => {

  const { user } = useContext(AuthContext);
  const [, refetch] = useCart();

  const navigate = useNavigate();
  const location = useLocation();

  const handleAddToCart = (featuredProduct, quantity) => {
    console.log(featuredProduct);
    if (user && user.email) {
      const cartProduct = {
        productId: featuredProduct._id,
        quantity : quantity,
        email: user.email,
        checked: false
      }
      // console.log(cartProduct);
      axios.post(`${import.meta.env.VITE_SERVER_ADDRESS}/add-to-cart`, cartProduct, { withCredentials: true } )
      .then((response) => {
        console.log(response);
        // Check if the response contains the updated cart data
        const updatedCart = response?.data?.cart;
        console.log('Updated Cart:', updatedCart);
          if (updatedCart) {
            //console.log(data.data)
            refetch();
            Swal.fire({
              icon: 'success',
              title: 'Product added on the Cart.',
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

  return handleAddToCart;

};

export default useAddToCart;