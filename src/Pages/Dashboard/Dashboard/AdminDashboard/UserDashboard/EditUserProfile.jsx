import React, { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { AuthContext } from "../../../../../Contexts/AuthProvider";
import axios from "axios";
import slugify from "slugify";
import Swal from "sweetalert2";
import { useQuery } from "@tanstack/react-query";
import useGeolocation from "../../../../../Hooks/useGeolocation";
import toast from "react-hot-toast";
import useProfile from "../../../../../Hooks/useProfile";
import { useNavigate } from "react-router-dom";
import UserTitle from "../../../../../Component/UserTitle";
import useAxiosSecure from "../../../../../Hooks/useAxiosSecure";
const EditUserProfile = () => {
  const navigate = useNavigate();
  const {axiosSecure} = useAxiosSecure();
  const { user } = useContext(AuthContext);
  const [selectedImage, setSelectedImage] = useState(null);
  const [city, setCity] = useState("");
  const [profile,profileLoading, refetch] = useProfile();


  useEffect(()=>{

    if(profile?.img){
      setSelectedImage(profile?.img)
    }

  },[profile])

  const { place, loading } = useGeolocation();

  const {
    data: places = []
  } = useQuery(["places"], async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_SERVER_ADDRESS}/address`);
      //console.log(res.data);
      return res?.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "An error occurred");
    }
  });

  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
    reset,
  } = useForm();

  const validateMobileNumber = (number) => {

    const regex = /^(?:\+88)?01[3-9][0-9]{8}$/;
  
    // Remove "+88" if it exists
    const formattedNumber = number.replace(/^\+88/, '');
  
    // Check if the formatted number matches the regex pattern
    return regex.test(formattedNumber);
  };

  const img_hosting_token = `${import.meta.env.VITE_IMAGE_TOKEN}`;

  const img_hosting_url = `https://api.imgbb.com/1/upload?key=${img_hosting_token}`;
  const onSubmit = (data) => {
    //console.log(data)
    if(!selectedImage){
      toast.error('You must select an image')
      return ;
    }
    const formData = new FormData();
    console.log(formData, "formData");
    // Check if a new image has been selected
    const isNewImageSelected = data.image[0] && data.image[0] !== profile?.img;

    if (isNewImageSelected) {
    formData.append("image", data?.image[0]);
    axios.post(img_hosting_url, formData).then((imgResponse) => {
      console.log(imgResponse);
      if (imgResponse?.data?.success) {
        const imgURL = imgResponse?.data?.data?.display_url;
        console.log(imgURL);
        const { name, email, image, address, phone, city } = data;
        setValue("img", image);
        const newProfile = {
          name,
          email,
          img: imgURL,
          address,
          city,
          phone,
          slug: slugify(name),
        };
        console.log(newProfile);

        axiosSecure
          .post(`${import.meta.env.VITE_SERVER_ADDRESS}/upload-profile`, newProfile, {
            withCredentials: true,
          })
          .then((data) => {
            console.log("new", data?.data);
            // reset();
            // setSelectedImage(null);

            Swal.fire({
              position: "top-end",
              icon: "success",
              title: "Done",
              showConfirmButton: false,
              timer: 1500,
            });
            refetch();
            navigate('/dashboard/user-profile')
          })
          .catch((e) => {
            console.log(e);
            if (e?.response?.status === 409) {
              //
            }
          });
      }
    });
  }
  else{
    const { name, email, image, address, phone, city } = data;
        setValue("img", image);
        const newProfile = {
          name,
          email,
          img: profile?.img,
          address,
          city,
          phone,
          slug: slugify(name),
        };
        console.log(newProfile);

        axiosSecure
          .post(`${import.meta.env.VITE_SERVER_ADDRESS}/upload-profile`, newProfile, {
            withCredentials: true,
          })
          .then((data) => {
            console.log("new", data?.data);
            // reset();
            // setSelectedImage(null);

            Swal.fire({
              position: "top-end",
              icon: "success",
              title: "Done",
              showConfirmButton: false,
              timer: 1500,
            });
            refetch();
            navigate('/dashboard/user-profile')
          })
          .catch((e) => {
            console.log(e);
            if (e?.response?.status === 409) {
              //
            }
          });
  }
  };

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setSelectedImage(URL.createObjectURL(e.target.files[0])); // Set selectedImage state with the URL
    }
  };


  // set city in state 
  useEffect(() => {
    if (place) {
      setCity(place?.address?.city)
    }
  }, [place])


  // if (loading || profileLoading) {
  //   return <>Loading...</>
  // }



  return (
    <>
      <div className="w-screen lg:w-[700px] mx-auto h-full">
        <UserTitle heading="Update Profile"></UserTitle>
        <div>
          <div>
            <form onSubmit={handleSubmit(onSubmit)}>
              {/* ------image---- */}
              
              <div
                className={`w-44 h-44 bg-[#EFEFEF] border-2 border-gray-300 flex items-center justify-center relative`}
              >
                {!selectedImage && (
                  <>
                    <div className="icon absolute top-5 right-6   ">
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
                      <p className="text-gray-500">200 x 200</p>
                      <p className="text-gray-500">place an .png image</p>
                    </div>
                  </>
                )}
                {selectedImage && (
                  <img
                    src={selectedImage}
                    alt="Uploaded"
                    className="w-44 h-44"
                  />
                )}

                <input
                  type="file"
                  className="opacity-0 w-full h-full absolute top-0 left-0 cursor-pointer"
                  {...register("image")}
                  onChange={handleImageChange}
                />
              </div>

              {/* ------Name------ */}
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text font-semibold">Name</span>
                </label>
                <input
                  type="name"
                  readOnly
                  value={user.displayName}
                  className="input input-bordered rounded-md read-only:cursor-not-allowed"
                  {...register("name", {})}
                />
              </div>

              {/* ------Email------ */}
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text font-semibold">Email</span>
                </label>
                <input
                  type="email"
                  readOnly
                  value={user.email}
                  className="input input-bordered rounded-md read-only:cursor-not-allowed"
                  {...register("email", {})}
                />
              </div>
              
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text font-semibold">City</span>
                </label>
                <select
                  {...register("city", {
                    value: (profile?.city  || place?.address?.city) || "", required: {
                      value: true,
                      message: "* select city",
                    },
                  })}
                  className="select select-bordered rounded-md"
                  onChange={(event) => setCity(event.target.value)}
                >
                  <option disabled value="" >
                    Select City
                  </option>
                  {places.map((p) => (
                    <option key={p._id} value={p.name}>
                      {p.name}
                    </option>
                  ))}
                </select>

                {errors.city?.type === "required" && (
                  <span className="label-text-alt text-red-500 mt-1">
                    {errors?.city?.message}
                  </span>
                )}

              </div>
                {/* -----Address----- */}

              

              {
                city && <>
                  <div className="form-control w-full">
                    <label className="label">
                      <span className="label-text font-semibold">
                        Address
                      </span>
                    </label>
                    <textarea id="message" className="input input-bordered rounded-md"
                      placeholder="Address here..."
                      defaultValue={profile?.address}
                      {...register("address", {
                        required: true,
                      })} ></textarea>

                    {
                      <span className="label-text-alt text-red-500 mt-1">
                        {errors?.address?.message}
                      </span>
                    }

                  </div>
                </>
              }



              {/* -------phone----- */}
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text font-semibold">
                    Contact Number
                  </span>
                </label>
                <input
                  type="tel"
                  placeholder="Contact Number"
                  className="bg-gray-50 border-gray-300 text-gray-900 text-sm  block w-full p-2.5 rounded-lg"
                  defaultValue={profile?.phone}
                  {...register("phone", {
                    required: {
                      value: true,
                      message: "* phone is Required",
                    },
                    validate: {
                      notPhone: (value) => validateMobileNumber(value)
                    },
                  })} />
                {errors.phone && errors.phone.type === "notPhone" && <p className='p-1 text-xs text-red-600'>*Invalid</p>}
                {
                  <span className="label-text-alt text-red-500 mt-1">
                    {errors?.phone?.message}
                  </span>
                }

              </div>
              <br />
              <input
                className="w-40 h-12 cursor-pointer bg-accent text-white hover:bg-slate-200 hover:text-primary font-bold rounded-md mt-2"
                type="submit"
                value="Submit"
              />
            </form>
            </div>
        </div>
      </div>
    </>
  );
};

export default EditUserProfile;
