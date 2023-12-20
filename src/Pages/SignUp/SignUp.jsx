import React, { useContext } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../Contexts/AuthProvider";
import { Helmet } from "react-helmet-async";
import Swal from "sweetalert2";
import axios from "axios";
import { UserDataContext } from "../../Contexts/UserDataProvider";
import signUpImage from "../../assets/signup.png"



const SignUp = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const { createUser, updateUserProfile } = useContext(AuthContext);
  const navigate = useNavigate();
  const { userAllDataRefetch } = useContext(UserDataContext);

  const handleSignUp = (data) => {
    const saveUser = { name: data.name, email: data.email };
    console.log(saveUser);
    axios
      .post(`${import.meta.env.VITE_SERVER_ADDRESS}/users`, saveUser, { withCredentials: true })
      .then((res) => {
        
        if (res.data.insertedId) {
          console.log("email", data.email)
          console.log(data.password, "pass")
          createUser(data.email, data.password)
            .then((result) => {
              const user = result.user;
              console.log(user);
              updateUserProfile(data.name)
                .then(() => {
                  reset();
          Swal.fire({
            icon: "success",
            title: "User created successfully.",
            showConfirmButton: false,
            timer: 1500,
          });
          navigate("/");
                })
                .catch((error) => {console.log(error);
                  axios.delete(`${import.meta.env.VITE_SERVER_ADDRESS}/delete-for-firebase-error/${data?.email}`)
                });
            })
            .catch((error) => {console.log(error);
          axios.delete(`${import.meta.env.VITE_SERVER_ADDRESS}/delete-for-firebase-error/${data?.email}`)
        });
        }
      })
      .catch((error) => console.log(error));
  };

  return (
    <>
      <Helmet>
        <title>E-Mart | SignUp</title>
      </Helmet>
      <div className="grid md:grid-cols-3 items-center">
        <div className=" md:col-span-2">
      <div className="w-72 md:w-96 mx-auto my-16 bg-white p-5 md:p-10 rounded-xl shadow-xl">
      
              <h3 className="text-xl md:text-3xl font-bold mb-5 md:mb-10">Sign Up</h3>
        <form onSubmit={handleSubmit(handleSignUp)}>
          <div className="form-control"> 
            <input
              type="text"
              {...register("name", { required: "User name is required" })}
              placeholder="name"
              className="border-none bg-orange-50 rounded-lg w-full max-w-xs"
            />
            {errors.name && <p role="alert">{errors.name?.message}</p>}
          </div>
          <br />
          <div className="form-control">
            <input
              type="email"
              {...register("email", { required: "Email Address is required" })}
              placeholder="email"
              className="border-none bg-orange-50 rounded-lg w-full max-w-xs"
            />
            {errors.email && <p role="alert">{errors.email?.message}</p>}
          </div>
          <br />
          <div className="form-control">
            <input
              type="password"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Your Password Should At Least 6 Characters",
                },
              })}
              placeholder="password"
              className="border-none bg-orange-50 rounded-lg w-full max-w-xs"
            />
            {errors.password && <p role="alert">{errors.password?.message}</p>}
          </div>
          <br />
          <div className="form-control mt-6">
            <input
              type="submit"
              className="bg-accent py-2 hover:bg-accent rounded-full text-white border-0 w-28 mx-auto cursor-pointer"
              value="Sing Up"
            />
          </div>
        </form>
        <div>
                <p className="text-sm font-light text-gray-400 text-center mt-5">
                Already have an account !{" "}
                  <span className="text-md font-bold text-accent cursor-pointer">
                    <Link to="/login" className="">
                      Sign in
                    </Link>
                  </span>
                </p>
              </div>
      </div>
      </div>
      <div className="bg-orange-100 h-screen relative hidden md:block">
        <img className=" absolute bottom-10 md:-left-20 lg:-left-52" src={signUpImage} alt="" />
      </div>
      </div>
    </>
  );
};

export default SignUp;
