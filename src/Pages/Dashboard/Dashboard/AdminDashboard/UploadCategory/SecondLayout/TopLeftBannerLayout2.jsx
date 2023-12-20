import axios from "axios";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { AiOutlineDelete } from "react-icons/ai";
import { useLoaderData, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../../../../Hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";


const TopLeftBannerLayout2 = () => {
  const {type, slug} = useParams();
  const { axiosSecure } = useAxiosSecure();
  const { refetch, data: banners = [], isLoading, isError } = useQuery({
    queryKey: ["topLeft", type, slug],
    queryFn: async () => {
      const res = await axiosSecure.get(`/${type}/${slug}/upload-top-left-banner-layout2`);
      console.log(res.data);
      return res?.data;
    },
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm();

  const img_hosting_token = `${import.meta.env.VITE_IMAGE_TOKEN}`;

  const img_hosting_url = `https://api.imgbb.com/1/upload?key=${img_hosting_token}`;

  const onSubmit = (data) => {
    //console.log(data);

    const formData = new FormData();
    formData.append("image", data.image[0]);
    fetch(img_hosting_url, {
      method: "POST",
      body: formData,
    })
      .then((res) => res.json())
      .then((imgResponse) => {
        console.log(imgResponse);
        if (imgResponse.success) {
          const imgURL = imgResponse?.data?.display_url;
          const { image } = data;
          setValue("topLeftBannerLayout2", image);
          console.log(imgURL);

          const updatedCategory = { topLeftBannerLayout2: imgURL };
          console.log(updatedCategory);
          axios
            .patch(`${import.meta.env.VITE_SERVER_ADDRESS}/${type}/${slug}`, updatedCategory, {
              withCredentials: true,
            })
            .then((data) => {
              console.log("updated", data.data);
              if (data?.data?.result?.modifiedCount === 1) {
                reset();
                setSelectedImage(null);
                refetch();
                //setBanners([...banners, imgURL]);
                Swal.fire({
                  icon: "success",
                  title: "Image uploaded successfully",
                  showConfirmButton: false,
                  timer: 1500,
                });
              }
            });
        }
      });
  };

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setSelectedImage(URL.createObjectURL(e.target.files[0])); // Set selectedImage state with the URL
    }
  };

  if(isLoading){
    return <><p>Loading image</p></>
  }

  if(isError){
    return <><p>Error</p></>
  }

  return (
    <>
      <div className="h-full">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div
            className={`w-full h-40 md:w-[700px] md:h-[400px] rounded-2xl bg-[#EFEFEF] border-2 border-gray-300 flex items-center justify-center relative `}
          >
            {!selectedImage && (
              <>
                <div className="icon absolute top-3 right-3">
                  <svg
                    width="28"
                    height="28"
                    viewBox="0 0 33 33"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M11.8466 13.3963C13.5582 13.3963 14.9457 12.0088 14.9457 10.2973C14.9457 8.58573 13.5582 7.19824 11.8466 7.19824C10.135 7.19824 8.74756 8.58573 8.74756 10.2973C8.74756 12.0088 10.135 13.3963 11.8466 13.3963Z"
                      stroke="#434343"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M18.0448 1H11.8467C4.09905 1 1 4.09905 1 11.8467V21.1438C1 28.8914 4.09905 31.9905 11.8467 31.9905H21.1438C28.8914 31.9905 31.9905 28.8914 31.9905 21.1438V13.3962"
                      stroke="#434343"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M27.5586 1.91414L21.9338 7.5389C21.7169 7.75584 21.5 8.17421 21.469 8.48411L21.1591 10.638C21.0506 11.4127 21.5929 11.955 22.3677 11.8466L24.5215 11.5367C24.8159 11.4902 25.2498 11.2888 25.4667 11.0718L31.0915 5.44705C32.0677 4.47085 32.5171 3.35519 31.0915 1.92963C29.6505 0.473079 28.5348 0.937936 27.5586 1.91414Z"
                      stroke="#434343"
                      strokeWidth="2"
                      strokeMiterlimit="10"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M26.7533 2.71973C27.2336 4.4242 28.5662 5.75679 30.2707 6.23714"
                      stroke="#434343"
                      strokeWidth="2"
                      strokeMiterlimit="10"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M2.03809 27.2643L9.67724 22.1353C10.9014 21.3141 12.6678 21.4071 13.7679 22.3523L14.2793 22.8016C15.4879 23.8398 17.4403 23.8398 18.6489 22.8016L25.095 17.2698C26.3036 16.2317 28.256 16.2317 29.4646 17.2698L31.9903 19.4392"
                      stroke="#434343"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <p className="text-gray-500">700 x 400</p>
                  <p className="text-gray-500">place an .png image</p>
                </div>
              </>
            )}
            {selectedImage && (
              <img
                src={selectedImage}
                alt="Uploaded"
                className="w-full h-40 md:w-[700px] md:h-[400px] rounded-2xl"
              />
            )}
            <input
              type="file"
              accept="image/*"
              className="opacity-0 w-full h-full absolute top-0 left-0 cursor-pointer"
              {...register("image", { required: true })}
              onChange={handleImageChange}
            />
          </div>
          <input
            type="submit"
            className="cursor-pointer w-full h-10 bg-primary text-white font-bold rounded-md mt-5"
            value="New Banner"
          />
        </form>

        <div className="md:w-96 mx-auto mt-10">
          <table className="table">
            
            <tbody>
              {banners?.map((image, index) => (
                <tr key={index}>
                  <td>
                    
                        <img src={image} alt={`Banner ${index}`} className="w-48 h-28"/>
                      
                  </td>
                  <th>
                    <button className="btn btn-ghost text-red-700 text-2xl">
                      <AiOutlineDelete />
                    </button>
                  </th>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default TopLeftBannerLayout2;
