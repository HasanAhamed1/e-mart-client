import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import useRole from "../../../../../../Hooks/useRole";
import useAxiosSecure from "../../../../../../Hooks/useAxiosSecure";
import { MdOutlineReviews } from "react-icons/md";
import useProfile from "../../../../../../Hooks/useProfile";


const ShowDeliveredOrder = () => {
  const {role, email} = useRole();
  const [profile, profileLoading] = useProfile();
  const {type} = useParams();
  const { axiosSecure } = useAxiosSecure();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchSize, setSearchSize] = useState(15);
  const [currentPage, setCurrentPage] = useState(0);

  // Assuming profile is an object with an _id property
const profileId = profile?._id;
//console.log(profileId)

  const {
    refetch,
    data: orderedProducts = {},
    isLoading,
  } = useQuery({
    queryKey: ["orderedProducts", searchQuery, searchSize, currentPage, type, role, email],
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/orders/${type}?q=${searchQuery}&size=${searchSize}&currentPage=${currentPage}&role=${role}&email=${email}`
      );
        //console.log(res.data)
      return res.data;
    },
  });

  //const pages = Math.ceil
  const handleInputChange = (e) => {
    setCurrentPage(0)
    setSearchQuery(e.target.value);
  };



  return (
    <section className="h-full mt-5 py-7 px-4 bg-white max-w-5xl mx-auto">
      {/* table  */}
      <div>
        <div className="flex  justify-between items-center">
          <p className="text-xl font-bold text-accent mt-5">Delivered Orders</p>
        </div>
        <div className="divider"></div>
      </div>

      {
        isLoading ? <>Loading</> : <>

          <table className="w-full min-w-[700px] text-sm text-left text-gray-500 select-none">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 ">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Order Id
                </th>
                <th scope="col" className="px-6 py-3">
                  Status
                </th>
                <th scope="col" className="px-6 py-3">
                  Placed On
                </th>
                <th scope="col" className="px-6 py-3">
                  Phone
                </th>
                <th scope="col" className="px-6 py-3">
                  Details
                </th>
              </tr>
            </thead>
            <tbody>
              {orderedProducts &&
                Array.isArray(orderedProducts?.orders) &&
                orderedProducts?.orders.map((i, count) => (
                  <tr key={i?._id} className="bg-white border-b  hover:bg-gray-50 ">
                    <td className={`px-6 py-4 ${i?.status === "Cancelled" && "text-red-500 font-medium"}`}>#{i?._id.slice(-6)}</td>
                    <td className={`px-6 py-4 ${i?.status === "Cancelled" && "text-red-500 font-medium"}`}>
                    {i?.status === "Cancelled" ? "Cancelled" :
                      i?.orderStatus[i?.orderStatus.length - 1]?.name}
                    </td>
                    <td className="px-6 py-4 text-sm">

                      {new Intl.DateTimeFormat("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      }).format(new Date(i?.orderStatus[0]?.time))}
                      <br />

                      {new Date(i?.orderStatus[0]?.time).toLocaleTimeString(
                        "en-US"
                      )}

                    </td>
                    <td className="px-2 py-4">{i?.userPhone}</td>
                    <td className="px-6 py-4">
                      <Link
                        to={`/dashboard/add-review/${type}/${i?._id}`}
                        className="flex items-center font-medium text-accent hover:underline"
                      >
                        <MdOutlineReviews />
                    Add Review
                      </Link>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </>
      }
    </section>
  );
};

export default ShowDeliveredOrder;
