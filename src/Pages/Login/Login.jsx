import React, { useContext, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../../Contexts/AuthProvider";
import {
  GoogleAuthProvider,
  getAuth,
  sendPasswordResetEmail,
  signInWithPopup,
} from "firebase/auth";
import app from "../../firebase/firebase.config";
import SignUp from "../SignUp/SignUp";
import { Helmet } from "react-helmet-async";
import toast from "react-hot-toast";
import loginImage from "../../assets/login.png";
import Swal from "sweetalert2";
import useAxiosSecure from "../../Hooks/useAxiosSecure";

const Login = () => {
  const { axiosSecure } = useAxiosSecure();
  const auth = getAuth(app);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { logIn, loading, setLoading } = useContext(AuthContext);
  const [loginError, setLoginError] = useState("");
  const emailRef = useRef();

  const location = useLocation();
  const navigate = useNavigate();

  const from = location.state?.from?.pathname || "/";

  const handleLogin = (data) => {
    setLoginError("");
    logIn(data.email, data.password)
      .then((result) => {
        const user = result.user;
        setLoading(false)
        navigate(from, { replace: true });
      })
      .catch((error) => {
        setLoading(false);
        setLoginError(error.message);
        if (error.code === "auth/wrong-password") {
          //    console.log(error)
          setLoginError("Password Wrong");
          Swal.fire({
              title: 'Error!',
              text: "Your Password is Wrong",
              icon: 'error',
              confirmButtonText: 'OK'
          })

      } else if (error.code === "auth/user-not-found") {
          setLoginError("No User by this E-mail");
          
          Swal.fire({
              title: 'Error!',
              text:"No User by this E-mail",
              icon: 'error',
              confirmButtonText: 'OK'
          })
      } else {

          setLoginError("An error occurred during sign up. Please try again later.");
          Swal.fire({
              title: 'Error!',
              text: "An error occurred during sign up. Please try again later.",
              icon: 'error',
              confirmButtonText: 'OK'
          })
      }
    });
  
  };

  const provider = new GoogleAuthProvider();
  const handleGoogleSignIn = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        const user = result.user;
        const saveUser = { name: user.displayName, email: user.email };
        fetch(`${import.meta.env.VITE_SERVER_ADDRESS}/users`, {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify(saveUser),
        })
          .then((res) => res.json())
          .then(() => {
            navigate(from, { replace: true });
          });
      })
      .catch((error) => {
        console.error("error: ", error);
      });
  };

  const handleResetPassword = (event) => {
    const email = emailRef.current.value;
    if (!email) {
      toast.error("Please Provide Your Email Address to Reset Password");
    }
    sendPasswordResetEmail(auth, email)
      .then(() => {
        toast.success("Please Check Your Email");
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <>
      <Helmet>
        <title>E-Mart | Login</title>
      </Helmet>
      <div className="">
        <div className="md:grid md:grid-cols-3">
          <div className=" md:col-span-2">
            <div className="w-72 my-14 md:my-16 mx-auto bg-white p-5 md:p-10 rounded-lg shadow-xl">
              <p className="text-sm text-gray-600 mb-1">Welcome Back !!!</p>
              <h3 className="text-3xl font-bold">Sign in</h3>
              <form onSubmit={handleSubmit(handleLogin)}>
                <div className="form-control">
                  <br />
                  <input
                    type="email"
                    name="email"
                    ref={emailRef}
                    {...register("email", {
                      required: "Email Address is required",
                    })}
                    placeholder="email"
                    className="border-none bg-orange-50 rounded-lg w-full max-w-xs"
                  />
                  {errors.email && <p role="alert">{errors.email?.message}</p>}
                </div>
                <div className="form-control">
                  <br />
                  <input
                    type="password"
                    name="password"
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
                  {errors.password && (
                    <p role="alert">{errors.password?.message}</p>
                  )}
                  <label className="label">
                    <button
                      onClick={handleResetPassword}
                      className="label-text-alt link link-hover text-gray-500 hover:text-blue-600"
                    >
                      Forgot password?
                    </button>
                  </label>
                </div>
                <div className="form-control mt-6">
                  <input
                    type="submit"
                    className="bg-accent py-2 hover:bg-accent rounded-full text-white border-0 w-28 mx-auto cursor-pointer"
                    value="Sign in"
                  />
                </div>
                <div>{loginError && <p>{loginError}</p>}</div>
              </form>

              <div>
                <p className="text-sm font-light text-gray-400 text-center mt-5">
                  Don't have an account?{" "}
                  <span className="text-md font-bold text-accent cursor-pointer">
                    <Link to="/signUp" className="">
                      Sign Up
                    </Link>
                  </span>
                </p>
              </div>

              {/* <div className='mt-6 grid grid-cols-3 items-center max-w-xs'>
            <hr />
            <p className='text-center'>Or</p>
            <hr />
        </div> */}
              <div>
                <p className="text-center text-gray-500 flex items-center justify-center mt-3 gap-3">
                  Or Sign in with{" "}
                  <span>
                    <button
                      onClick={handleGoogleSignIn}
                      className="bg-accent p-2 text-white rounded-full border-0"
                    >
                      <svg
                      
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g clipPath="url(#clip0_3_103)">
                          <path
                            d="M0 12C0 5.3832 5.3832 0 12 0C14.6723 0 17.2017 0.859771 19.3147 2.4864L16.5262 6.1088C15.2197 5.10309 13.6545 4.57143 12 4.57143C7.90389 4.57143 4.57143 7.90389 4.57143 12C4.57143 16.0961 7.90389 19.4286 12 19.4286C15.2991 19.4286 18.1026 17.2671 19.0688 14.2857H12V9.71429H24V12C24 18.6168 18.6168 24 12 24C5.3832 24 0 18.6168 0 12Z"
                            fill="#ffffff"
                          />
                        </g>
                        <defs>
                          <clipPath id="clip0_3_103">
                            <rect width="24" height="24" fill="white" />
                          </clipPath>
                        </defs>
                      </svg>
                    </button>
                  </span>
                </p>
              </div>
            </div>
          </div>
          <div className="bg-orange-100 md:h-screen relative hidden md:block">
          <img
              className=" absolute bottom-10 -left-40 border-b-2 border-gray-300"
              src={loginImage}
              alt=""
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
