import axios from "axios";
import React, { useContext, useEffect, useRef, useState } from "react";
import { BsSearch } from "react-icons/bs";
import { Link } from "react-router-dom";
import { AuthContext } from "../../../Contexts/AuthProvider";
import useCart from "../../../Hooks/useCart";
import useProfile from "../../../Hooks/useProfile";
import { MdShoppingCart } from "react-icons/md";
import useRole from "../../../Hooks/useRole";
import img from "../../../assets/emart.png";
import { GiShoppingCart } from "react-icons/gi";
import { LuMenu } from "react-icons/lu";

const Navbar = () => {
  const { user, logOut } = useContext(AuthContext);
  const [cart] = useCart();
  const [profile] = useProfile();
  const { role, name } = useRole();

  const handleLogOut = () => {
    logOut()
      .then(() => {})
      .catch((err) => console.log(err));
  };

  const menuItem = (
    <>
      <li>
        <Link
          className="text-black hover:text-accent font-bold text-xs hover:bg-white uppercase"
          aria-current="page"
          to="/"
        >
          Home
        </Link>
      </li>
      <li>
        <Link
          className="text-black hover:text-accent font-bold text-xs hover:bg-white uppercase"
          to="/about-us"
        >
          About
        </Link>
      </li>
      {/* <li>
        <Link className="text-accent hover:text-accent font-semibold text-lg hover:bg-white uppercase" to="/reviews">Reviews</Link>
      </li> */}
      {user?.uid ? (
        <li>
          {/* <button className="text-accent hover:text-accent font-semibold text-lg hover:bg-white uppercase" onClick={handleLogOut}>LogOut</button> */}
        </li>
      ) : (
        <li>
          <Link
            className="text-black hover:text-accent font-bold text-xs hover:bg-white uppercase"
            to="/login"
          >
            Login
          </Link>
        </li>
      )}
    </>
  );

  const subMenuItem = (
    <>
      {role === "admin" ? (
        <li>
          <Link
            className="block text-left hover:text-white text-sm text-gray-700 hover:bg-accent font-semibold uppercase"
            to="/dashboard/admin-home"
          >
            Dashboard
          </Link>
        </li>
      ) : role === "Product Manager" ? (
        <li>
          <Link to="/dashboard/upload/upload-category">Dashboard</Link>
        </li>
      ) : role === "Order Manager" ? (
        <li>
          <Link to="/dashboard/add-coupon">Dashboard</Link>
        </li>
      ) : role === "Delivery Partner" ? (
        <li>
          <Link to="/dashboard/orders/current">Dashboard</Link>
        </li>
      ) : (
        <li>
          <Link
            className="block text-left hover:text-white text-sm text-gray-700 hover:bg-accent font-semibold uppercase"
            to="/dashboard/user-profile"
          >
            Dashboard
          </Link>
        </li>
      )}

      {user?.uid ? (
        <li>
          <button
            className="block text-left hover:text-white text-sm text-gray-700 hover:bg-accent font-semibold uppercase"
            onClick={handleLogOut}
          >
            LogOut
          </button>
        </li>
      ) : (
        <li>
          <Link
            className="block px-4 py-2 hover:text-white text-sm text-gray-700 hover:bg-accent font-semibold uppercase"
            to="/login"
          >
            Login
          </Link>
        </li>
      )}
    </>
  );

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  // Add a state to track whether search results are closed
  const [isSearchResultsClosed, setIsSearchResultsClosed] = useState(false);
  const [loading, setLoading] = useState(false);

  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Check if the user has scrolled past a certain threshold (e.g., 100px)
      if (window.scrollY > 100) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const searchRef = useRef(null);

  // Add a click event listener to the document to close search results
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        // Click occurred outside of the search navbar, close search results
        setSearchResults([]);
       // setIsSearchResultsClosed(true);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const handleSearch = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_ADDRESS}/search`,
        {
          query: searchQuery,
        }
      );
      setSearchResults(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error searching for products:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (searchQuery) {
      handleSearch();
    } else {
      // Clear search results when the input field is empty
      setSearchResults([]);
    }
  }, [searchQuery]);
  return (
    <>
      <div
        // className="fixed w-full z-20 top-0 left-0  bg-orange-50"
        className={`${
          isSticky ? "fixed top-0 w-full " : "relative "
        } z-10 bg-orange-50`}
      >
        <div className="navbar">
          <div className="navbar-start lg:ml-8">
          <div className="dropdown">
              <label tabIndex={0} className="lg:hidden">
                <LuMenu className="m-1 text-2xl"></LuMenu>
              </label>
              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content mt-3 px-2 shadow rounded-box w-32 bg-white"
              >
                {menuItem}
              </ul>
            </div>
            <div
            // className={`${isSticky ? "md:block" : "hidden"} md:mx-5`}
            >
              <Link to="/" className="hidden md:block">
                {/* <p>
                <span className="text-white text-2xl lg:text-5xl font-extrabold">E</span>
                <span className="text-lg lg:text-2xl font-semibold">Mart</span>
              </p> */}
                <div className="w-20">
                  <img src={img} alt="" />
                </div>
                {/* <GiShoppingCart className="text-3xl lg:text-6xl text-white" /> */}
              </Link>
            </div>
            
          </div>
          <div className="navbar-center flex" ref={searchRef}>
            <div className="">
              <div className="flex items-center border-2 rounded-lg mx-auto bg-white">
                <input
                  type="text"
                  placeholder="Search"
                  className="w-32 md:w-96 lg:w-[600px] rounded-lg border-none"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button
                  className="p-1 md:px-4 mx-1 hover:bg-slate-100 bg-accent text-white hover:text-gray-800 font-semibold text-lg rounded-md"
                  onClick={handleSearch}
                >
                  <div className="flex justify-items-center items-center">
                    <BsSearch />
                  </div>
                </button>
              </div>
            </div>
            {/* Display search results */}
            <div>
              {loading && <></>}
              {
                !loading && searchResults.length > 0 && (
                  <ul className="fixed right-0 left-0 bg-white w-60 md:w-[500px] mx-96 mt-6 rounded-md p-2 md:p-5 text-xs md:text-base md:font-bold">
                    {searchResults.slice(0, 8).map((product) => (
                      <li key={product._id} className="my-1 hover:underline">
                        {/* Link to the product overview route */}
                        <Link to={`/overview/${product._id}`}>
                          {product.productTitle}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )
                //  :
                // (
                //   <ul className="fixed right-0 left-0 bg-white w-60 md:w-[500px] mx-96 mt-6 rounded-md p-2 md:p-5 text-xs md:text-base md:font-bold">

                //       <li className="my-1 hover:underline">

                //       </li>

                //   </ul>
                // )
              }
              {!loading && searchQuery && searchResults.length === 0 && (
                <div className="fixed right-0 left-0 bg-white w-60 md:w-[500px] mx-96 mt-6 rounded-md p-2 md:p-5 text-xs md:text-base md:font-bold">
                  <p>No results found</p>
                </div>
              )}
            </div>
          </div>
          <div className="navbar-end m:mr-5">
            <div className="hidden lg:flex ">
              <ul className="menu menu-horizontal">{menuItem}</ul>
            </div>
            <div className="flex justify-items-center md:gap-3">
              {role === "user" && (
                <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
                  <Link to="/dashboard/myCart">
                    <div className="indicator">
                      <MdShoppingCart className="text-3xl"></MdShoppingCart>
                      <span className="badge badge-sm indicator-item bg-white text-black">
                        {cart?.length || 0}
                      </span>
                    </div>
                  </Link>
                </label>
              )}
              {user && (
                <div className="dropdown dropdown-end">
                  <label
                    tabIndex={0}
                    className="btn btn-ghost btn-circle avatar"
                  >
                    <div className="w-10 rounded-full">
                      {profile?.img ? (
                        <img
                          className="w-8 h-8 md:w-10 md:h-10 rounded-full"
                          src={profile?.img}
                          alt={name}
                        />
                      ) : (
                        <div className="relative inline-flex items-center justify-center w-10 h-10 overflow-hidden bg-accent rounded-full ">
                          <span className="font-medium text-white text-xl ">
                            {name &&
                              name
                                .split(" ")
                                .map((i) => i.charAt(0).toUpperCase())
                                .join("")}
                          </span>
                        </div>
                      )}
                    </div>
                  </label>
                  <ul
                    tabIndex={0}
                    className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-slate-100 w-40 rounded-lg hover:rounded-none"
                  >
                    {subMenuItem}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
