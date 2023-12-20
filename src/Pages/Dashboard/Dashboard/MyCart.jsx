import { useContext, useEffect, useState } from "react";
import useCart from "../../../Hooks/useCart";
import { AiOutlineDelete } from "react-icons/ai";
import Swal from "sweetalert2";
import axios from "axios";
import { AuthContext } from "../../../Contexts/AuthProvider";
import CartComponent from "../../../Component/CartComponent/CartComponent";
import { Link, useNavigate, useParams } from "react-router-dom";
import Error from "../../Shared/error/Error";
import { set } from "react-hook-form";
import { cartDataContext } from "../../../Contexts/CartDataProvider";
import toast from "react-hot-toast";
import UserTitle from "../../../Component/UserTitle";
import { TbCurrencyTaka } from "react-icons/tb";

const MyCart = () => {
  const { setSelectedOrderItems } = useContext(cartDataContext);
  const navigate = useNavigate()
  const { user } = useContext(AuthContext);
  const [, refetch] = useCart();
  //const {quantityArray} = useParams();
  const [total, setTotal] = useState(0.0);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrders, setSelectedOrders] = useState([]);
  useEffect(() => {
    axios.get(`${import.meta.env.VITE_SERVER_ADDRESS}/get-cart?email=${user?.email}`, {
      withCredentials: true,
    })
      .then((data) => {
         console.log(data.data);
        setCart(data.data.cart);
      })
      .catch((e) => {
        <Error />;
      })
      .finally(() => {
        setLoading(false);
      });
  }, [user]);


  useEffect(() => {
    // console.log(cart);
    setSelectedOrders(cart.filter(temp => temp?.checked === true))
  }, [cart])
  useEffect(() => {
    setTotal(
      selectedOrders.reduce((sum, product) => product.price * product.quantity + sum, 0)
    );

  }, [selectedOrders]);
  // console.log(total)


  const handleRemoveFromSelectedOrders = (product) => {
    setSelectedOrders(selectedOrders.filter((item) => item._id !== product?._id))
  };

  const handleAddToSelectedOrders = (product) => {
    setSelectedOrders([...selectedOrders, product])
  };

  // const updateQuantity = ({ _id, Updatedquantity }) => {
  //   setCart((prevCart) => {
  //     const updatedCart = prevCart.map((product) => {
  //       if (product._id === _id) {
  //         return { ...product, quantity: Updatedquantity };
  //       }
  //       return product;
  //     });

  //     return updatedCart;
  //   });
  //   setSelectedOrders((prevCart) => {
  //     const updatedCart = prevCart.map((product) => {
  //       if (product._id === _id) {
  //         return { ...product, quantity: Updatedquantity };
  //       }
  //       return product;
  //     });

  //     return updatedCart;
  //   });
  //   updateInDB(_id, Updatedquantity);
  // };

  const updateQuantityAndChecked = (_id, Updatedquantity, isChecked) => {
    setCart((prevCart) => {
      const updatedCart = prevCart.map((product) => {
        if (product._id === _id) {
          return { ...product, quantity: Updatedquantity, checked: isChecked };
        }
        return product;
      });

      return updatedCart;
    });

    setSelectedOrders((prevCart) => {
      const updatedCart = prevCart.map((product) => {
        if (product._id === _id) {
          return { ...product, quantity: Updatedquantity, checked: isChecked };
        }
        return product;
      });

      return updatedCart;
    });

    // Call a function to update this change in the database (you need to implement this).
    updateInDB(_id, Updatedquantity, isChecked);
  };


  const updateInDB = (_id, Updatedquantity, isChecked) => {
    // console.log(_id, Updatedquantity, isChecked);
    const updatedCart = { email: user?.email, productId: _id, quantity: Updatedquantity, checked: isChecked }
    // console.log(updatedCart)


    axios.put(`${import.meta.env.VITE_SERVER_ADDRESS}/update-cart-product/${user?.email}`, updatedCart, { withCredentials: true })
      .then((response) => {
        // Handle success
        // console.log('Cart updated in the database', response.data);
        // Optionally, you can also update the local cart state if needed
        refetch();
      })
      .catch((error) => {
        // Handle error
        console.e('Error updating cart in the database', error);
      });


  };

  // function to delete an item of cart
  const handleDeleteCartItem = (_id) => {
    setCart(cart.filter((item) => item._id !== _id));
    setSelectedOrders(selectedOrders.filter((item) => item._id !== _id));

    const data = {
      _id
    };
    console.log(data)
    axios.delete(`${import.meta.env.VITE_SERVER_ADDRESS}/remove-from-cart/${user.email}/${_id}`, {
      data,
      withCredentials: true,
    })
      .then(() => {
        refetch();
      })
      .catch((e) => {
        console.error('error', e)
        navigate("/not-found");
      });
  };

  const handleCheckOut = () => {
    setSelectedOrderItems(selectedOrders, total);
    if (selectedOrders.length >= 0) {
      navigate('/dashboard/check-out')
    }

  }

  //   

  return (
    <>
      <>
        {loading ? (
          <p>loading....</p>
        ) : (
          <div className="w-full h-full p-5 md:p-10 user-select-none">
            <div className="">
            <UserTitle heading={`My Cart (${cart.length} Products)`} />
            </div>
            <div className="grid lg:grid-cols-3 gap-5">
              <div className="bg-white col-span-2 md:p-5">
                <div className="grid grid-cols-4 md:grid-cols-5 lg:text-lg font-bold items-center justify-items-center">
                  <p className="md:col-span-2">Item</p>
                  <p>Price</p>
                  <p>Quantity</p>
                  <p>Total</p>
                </div>
                {cart.map((product, _idx) => (
                  <CartComponent
                    key={_idx}
                    product={product}
                    handleAddToSelectedOrders={handleAddToSelectedOrders}
                    handleRemoveFromSelectedOrders={
                      handleRemoveFromSelectedOrders
                    }
                    updateQuantityAndChecked={updateQuantityAndChecked}
                    handleDeleteCartItem={handleDeleteCartItem}
                  ></CartComponent>
                ))}
              </div>
              <div className=" bg-white p-5 h-40 mt-10">
                <div className="grid grid-cols-3">
                  <div className="col-span-2">
                    <p className="font-bold">Total Price:</p>
                    
                  </div>
                  <div>
                    <p className="flex items-center"><TbCurrencyTaka />{total.toFixed(2)}</p>
                    
                  </div>
                </div>


                <button onClick={selectedOrders.length <= 0 ? () => { toast.error("You must select an item") } : handleCheckOut} className={` w-full h-10 focus:ring focus:ring-3 ring-yellow-300  bg-accent text-white text-lg font-bold rounded-sm mt-8 disabled:cursor-not-allowed`}>
                  Check Out
                </button>
                {/* {
                    selectedOrders.length <= 0 && <p className="text-sm text-red-600 text-center">You must select an item</p>
                  } */}


              </div>
            </div>
          </div>
        )}
      </>
    </>
  );
};

export default MyCart;
