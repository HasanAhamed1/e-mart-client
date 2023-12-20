import React, { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Layout1 from "../../../../../Component/HomeLayout/Layout1";
import Layout2 from "../../../../../Component/HomeLayout/Layout2";
import Layout3 from "../../../../../Component/HomeLayout/Layout3";
import axios from "axios";
import useAxiosSecure from "../../../../../Hooks/useAxiosSecure";

const HomePageLayout = () => {
  const { slug, type } = useParams();
  const { axiosSecure } = useAxiosSecure();
  const { layout } = useParams();
  // console.log(layout)
  const [activeContent, setActiveContent] = useState("content1");

  const handleContentSwitch = (contentId) => {
    setActiveContent(contentId);
  };

  const navigate = useNavigate();

  const handleLayoutSelect = async (selectedLayout) => {
    try {
      
      console.log("Selected Layout:", selectedLayout);
      const response = await axiosSecure.patch(
        `${import.meta.env.VITE_SERVER_ADDRESS}/${type}/${slug}/layout`,
        {layout: selectedLayout},
        { withCredentials: true }
      );

      // Debug: Log the response from the server
      console.log("Server Response:", response.data);

      // Handle the response if needed
      console.log("Category updated:", response.data.message);
      navigate(`/dashboard/upload/${type}/${slug}/home-page-layout/${selectedLayout}`)
    } catch (error) {
      // Debug: Log the error
      console.error("Error updating category:", error);

      // Handle errors if the request fails
      if (error.response) {
        console.error("Error response from server:", error.response.data);
      } else {
        console.error("Network error:", error.message);
      }
    }
  };

  console.log(slug);
  return (
    <>
      <div className="h-full mt-3 bg-white">
        <h1 className="text-center text-2xl font-bold text-primary my-10">
          LayOut
        </h1>

        <div className="flex justify-center gap-4 mb-4">
          <button
            className={`px-4 py-2 text-lg ${
              activeContent === "content1"
                ? "bg-primary text-white font-bold"
                : " bg-slate-200 text-primary font-bold"
            }`}
            onClick={() => handleContentSwitch("content1")}
          >
            LayOut 1
          </button>
          <button
            className={`px-4 py-2 text-lg ${
              activeContent === "content2"
                ? "bg-primary text-white font-bold"
                : " bg-slate-200 text-primary font-bold"
            }`}
            onClick={() => handleContentSwitch("content2")}
          >
            LayOut 2
          </button>
          <button
            className={`px-4 py-2 text-lg ${
              activeContent === "content3"
                ? "bg-primary text-white font-bold"
                : " bg-slate-200 text-primary font-bold"
            }`}
            onClick={() => handleContentSwitch("content3")}
          >
            LayOut 3
          </button>
        </div>

        <div className="p-4">
          {activeContent === "content1" && (
            <div>
              <button
                onClick={() => handleLayoutSelect(1)} // Pass the selected layout (1)
                className="w-36 h-10 text-gray-700 font-bold bg-slate-300 m-3"
              >
                Select Layout 1
              </button>
              <Layout1></Layout1>
            </div>
          )}

          {activeContent === "content2" && (
            <div>
              <button
                onClick={() => handleLayoutSelect(2)}
                className="w-36 h-10 text-gray-700 font-bold bg-slate-300 m-3"
              >
                Select Layout 2
              </button>

              <Layout2></Layout2>
            </div>
          )}

          {activeContent === "content3" && (
            <div>
              <button
                onClick={() => handleLayoutSelect(3)}
                className="w-36 h-10 text-gray-700 font-bold bg-slate-300 m-3"
              >
                Select Layout 3
              </button>
              <Layout3></Layout3>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default HomePageLayout;
