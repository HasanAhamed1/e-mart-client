import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../../../../Contexts/AuthProvider";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import UserTitle from "../../../../../Component/UserTitle";

const UserProfile = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  //const [, profileLoading] = useProfile();

  // Fetch the user's profile
  const {
    data: profile = {},
    isLoading,
    isError,
  } = useQuery(["profile"], async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_SERVER_ADDRESS}/get-profile/${user?.email}`,
        { withCredentials: true }
      );
      console.log(res.data);
      return res?.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "An error occurred");
    }
  });

  return (
    <>
      <div className="w-screen max-w-5xl mx-auto min-h-screen mt-5 p-5">
        <UserTitle heading="Profile"></UserTitle>
        {/* image  */}

        <div className="flex items-center justify-center max-w-[300px] mx-auto relative">
          <label className="flex flex-col items-center justify-center w-44 h-44 border-2 border-gray-300 border-dashed rounded-lg  bg-gray-50 hover:bg-gray-100 ">
            {profile?.img ? (
              <img
                src={profile?.img}
                alt=""
                className="w-full h-full rounded"
              />
            ) : (
              <>
                <span className="font-medium text-gray-100 ">
                  {profile?.name &&
                    profile?.name
                      .split(" ")
                      .map((i) => i.charAt(0).toUpperCase())
                      .join("")}
                </span>
              </>
            )}
          </label>
        </div>
        <div className="mt-6 grid gap-6 mb-6 md:grid-cols-2">
          {/* name  */}
          <div>
            <label
              htmlFor="first_name"
              className="block mb-2 text-sm font-medium text-gray-900 "
            >
              Name
            </label>
            <p className="bg-gray-50 border-b border-gray-300 text-gray-900 text-sm  block w-full p-2.5  ">
              {profile?.name}
            </p>
          </div>
          <div>
            <label
              htmlFor="last_name"
              className="block mb-2 text-sm font-medium text-gray-900 "
            >
              Coin
            </label>
            <p className="bg-gray-50 border-b border-gray-300 text-gray-900 text-sm  block w-full p-2.5  ">
              {profile?.coin || 0}
            </p>
          </div>

          <div>
            <label
              htmlFor="email"
              className="block mb-2 text-sm font-medium text-gray-900 "
            >
              Email address
            </label>
            <p className="bg-gray-50 border-b border-gray-300 text-gray-900 text-sm  block w-full p-2.5  ">
              {profile?.email}
            </p>
          </div>

          {/* phone  */}
          <div>
            <label
              htmlFor="phone"
              className="block mb-2 text-sm font-medium text-gray-900 "
            >
              Phone number
            </label>
            <p className="bg-gray-50 border-b border-gray-300 text-gray-900 text-sm  block w-full p-2.5  ">
              {profile?.phone || "N/A"}
            </p>
          </div>
        </div>
        <div className="mb-6">
          <label
            htmlFor="address"
            className="block mb-2 text-sm font-medium text-gray-900 "
          >
            Address
          </label>
          <p className="bg-gray-50 border-b border-gray-300 text-gray-900 text-sm  block w-full p-2.5  ">
            {profile?.address || "N/A"} {profile?.city && ","} {profile?.city}
          </p>
        </div>
        <div className="mb-6 flex justify-center">
          <button
            onClick={() => navigate("/dashboard/edit-user-profile")}
            className="text-white  bg-accent focus:ring-4 focus:outline-none font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center "
          >
            Update Profile
          </button>
        </div>
      </div>
    </>
  );
};

export default UserProfile;
