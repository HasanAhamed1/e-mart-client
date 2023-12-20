import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../../../../Contexts/AuthProvider";
// import useWishList from "../../../../../Hooks/useWishList";
import UserTitle from "../../../../../Component/UserTitle";
import { AiOutlineDelete } from "react-icons/ai";
import { BsCartPlus } from "react-icons/bs";
import { TbCurrencyTaka } from "react-icons/tb";
import useAddToCart from "../../../../../Hooks/useAddToCart";
import useProduct from "../../../../../Hooks/useProduct";
import Swal from "sweetalert2";
import axios from "axios";

const WishList = () => {
  const navigate = useNavigate()
  const { user } = useContext(AuthContext);

// const [wishList, refetch] = useWishList();
// console.log(wishList)

const handleAddToCart = useAddToCart();

const [product] = useProduct();

// function to delete an item of cart
const handleDelete = (wish) => {
  if(wish.productId){
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(`${import.meta.env.VITE_SERVER_ADDRESS}/remove-from-wish-list/${wish.productId}`, {
          method: "DELETE", // Use DELETE request
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.success) { // Assuming your backend responds with a success field
              // refetch();
              Swal.fire("Deleted!", "Your file has been deleted.", "success");
            } else {
              Swal.fire("Error!", "Item not found or server error.", "error");
            }
          });
      }
    });
  }
  else {
    console.error("productId is undefined in the wish object");
  }
};


  return (
    <>
      <>
          {/* <div className="h-full md:p-10 user-select-none">
            <div className="">
            <UserTitle heading={`Your Cart (${wishList.length} Products)`} />
            </div>
            <div>
            <div className="">
          
          <table className="table">
            <tbody>
              {wishList.map((wish) => (
                <tr key={wish._id} wish={wish}>
                 

                  <td>
                    <div className="flex items-center space-x-3">
                      <div className="avatar">
                        <div className="mask mask-squircle w-24 h-24">
                          <img
                            src={wish.image}
                            alt="Avatar Tailwind CSS Component"
                          />
                        </div>
                      </div>
                      <div>
                        <p className="text-gray-700 text-sm truncate text-ellipsis overflow-hidden">
                          {wish.productTitle}
                        </p>
                        <div className="flex items-center"><TbCurrencyTaka />{wish.price}</div>
                      </div>
                    </div>
                  </td>
                  <td></td>
                  <td>
                  <button onClick={() => handleDelete(wish)} className="bg-red-600 text-xl py-2 px-5 rounded-md text-white">
                            <AiOutlineDelete />
                          </button>
                  </td>
                  <td></td>
                  <td>
                  <button onClick={() => handleAddToCart(wish, 1)} className="bg-accent text-xl py-2 px-5 rounded-md">
                            <BsCartPlus />
                          </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
            </div>
          </div> */}
      </>
    </>
  );
};

export default WishList;
