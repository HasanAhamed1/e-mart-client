import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import React from 'react';
import { AiOutlineDelete } from 'react-icons/ai';
import Swal from 'sweetalert2';

const Coupon = () => {
  const { data: coupons = [], refetch } = useQuery(["coupon"], async () => {
    const res = await axios.get(`${import.meta.env.VITE_SERVER_ADDRESS}/get-coupon`, {
      withCredentials: true,
    });
    console.log(res.data);
    return res.data;
  });

  const handleDelete = (coupon) => {
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
        axios.delete(`${import.meta.env.VITE_SERVER_ADDRESS}/delete-coupon/${coupon?._id}`, {
          withCredentials: true
        })
          .then((data) => {
            if (data?.data?.deletedCount > 0) {
              refetch();
              Swal.fire("Deleted!", "Your file has been deleted.", "success");
            }
          });
      }
    });
  };
  return (
    <>
     <div className='p-10 w-full'>
     <div className="">
        <table className="table text-center">
          {/* head */}
          <thead>
            <tr>

              <th>Coupon Code</th>
              <th>Percentage</th>
              <th>Minimum Order Amount</th>
              <th>Maximum Discount Limit</th>
              <th>start date</th>
              <th>End Date</th>
              <th>Number Of Use</th>
              <th>Action</th>

            </tr>
          </thead>
          <tbody>
            {/* row 1 */}
            {coupons.map((coupon, index) => 
              <tr key={coupon?._id}  className=" user-select-none text-center border-b hover:bg-slate-100/75 ">

                <td className='font-bold'>{coupon?.couponCode}</td>
                <td>{coupon?.percentage}</td>
                <td>{coupon?.minimumOrderAmount}</td>
                <td>{coupon?.maximumDiscountLimit}</td>
                <td>{new Date(coupon?.start_Date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</td>
                <td>{new Date(coupon?.end_Date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</td>

                <td>{coupon?.numberOfUse}</td>
                <td>
                  <button onClick={() => handleDelete(coupon)}>
                    <AiOutlineDelete />

                  </button>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
     </div>
    </>
  );
};

export default Coupon;