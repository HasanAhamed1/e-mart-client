import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useEffect, useState } from "react";
import useAxiosSecure from "./useAxiosSecure";

const useProduct = () => {
    // const {axiosSecure} = useAxiosSecure();
    // const { refetch, data: product = [] } = useQuery({
    //     queryKey: ['products'],
    //     queryFn: async () => {
    //         const res = await axiosSecure.get(`/products`)
    //         // console.log(res.data)
    //         return res.data;
    //     },
    //       });
    const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [NotReachedToTheEnd, setNotReachedToTheEnd] = useState(true);

  useEffect(() => {
    fetchProducts();
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    if (page > 1) {
      fetchNextPageProducts();
    }
  }, [page]);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_ADDRESS}/api/products?page=${page}`
      );
      setProducts(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching products:", error);
      setIsLoading(false);
    }
  };

  const fetchNextPageProducts = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_ADDRESS}/api/products?page=${page}`
      );
      const newProducts = response.data;
      setProducts((prevProducts) => [...prevProducts, ...response.data]);
      if (newProducts.length > 0) {
        setNotReachedToTheEnd(true);
      } else {
        setNotReachedToTheEnd(false);
      }
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching next page products:", error);
    }
  };

  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop ===
      document.documentElement.offsetHeight
    ) {
      setPage((prevPage) => prevPage + 1);
    }
  };
    

    return [products, isLoading]
};

export default useProduct;