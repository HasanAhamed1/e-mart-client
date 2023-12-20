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

  const deliveredProducts = orderedProducts.filter(order => order?.status === 'delivered' && profile?.email === email);

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
          <button  onClick={refetch} 
          type="button"
           className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 ">Reload</button>
        </div>
        <div className="divider"></div>
      </div>

      <div className="relative mt-5 flex justify-between items-center mb-3">
        <div>
          <select
            value={searchSize}
            onChange={(e) => {
              setSearchSize(parseInt(e.target.value));
            }}
            className="block w-full py-2 px-1 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none  "
          >
            <option value="15">15</option>
            <option value="30">30</option>
            <option value="50">50</option>
            <option value="100">100</option>
            <option value="500">500</option>
          </select>
        </div>
        <div>
          <label htmlFor="table-search" className="sr-only">
            Search
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <svg
                className="w-5 h-5 text-gray-500"
                aria-hidden="true"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={handleInputChange}
              placeholder="Search By Phone"
              className="block p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 "
            />
          </div>
        </div>
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
              {deliveredProducts &&
                Array.isArray(deliveredProducts?.orders) &&
                deliveredProducts?.orders.map((i, count) => (
                  <tr key={i?._id} className="bg-white border-b  hover:bg-gray-50 ">
                    {/* <td className="px-6 py-4">
                                      <img className="w-10 h-10 rounded-full" src={i?.image} alt={i?.name} />

                                  </td> */}
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

      <nav
        className="w-full flex justify-center mt-5 select-none pb-5"
        aria-label="Page navigation example"
      >
        <ul className="inline-flex -space-x-px text-sm">

          {!isLoading && [
            ...Array(Math.ceil(orderedProducts?.count / searchSize)).keys(),
          ].map((number) => (
            <li
              key={number}
              className={`${currentPage === number
                ? "bg-slate-400 text-white"
                : "text-gray-500 bg-white"
                } flex items-center justify-center px-3 h-8 leading-tight  border border-gray-300 first:rounded-l-lg last:rounded-r-lg hover:bg-gray-100 hover:text-gray-700`}
            >
              <button
                onClick={() => {
                  setCurrentPage(number);
                }}
              >
                {number + 1}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </section>
  );
};

export default ShowDeliveredOrder;
