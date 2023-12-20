import React, { useEffect, useState } from "react";
import ProductCard from "../Shared/ProductCard";
import axios from "axios";
import ProductCardLoading from "../Shared/ProductCardLoading";

const ShowAllProducts = () => {
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
      // Shuffle the products before setting them in state
      const shuffledProducts = shuffle(response.data);
      setProducts(shuffledProducts);
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
      // Shuffle the new products before combining with existing products
      const shuffledNewProducts = shuffle(newProducts);
      setProducts((prevProducts) => [...prevProducts, ...shuffledNewProducts]);
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
    const scrolledToBottom =
      window.innerHeight + document.documentElement.scrollTop + 100 >=
      document.documentElement.offsetHeight;
  
    if (scrolledToBottom) {
      setPage((prevPage) => prevPage + 1);
    }
  };
  

  // Fisher-Yates shuffle algorithm
  const shuffle = (array) => {
    let currentIndex = array.length,
      randomIndex;

    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex],
        array[currentIndex],
      ];
    }

    return array;
  };

  return (
    <>
      <div className="py-12">
        {/* Your existing code here */}
        <div className="w-[300px] md:w-[700px] lg:w-[1200px] mx-auto mt-10 relative">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 mt-10 gap-8">
            {products.map((product) => (
              <ProductCard key={product._id} showProduct={product} />
            ))}
          </div>
        </div>
        {isLoading && (
          <>
          <div className="w-[300px] md:w-[700px] lg:w-[1200px] mx-auto mt-10 relative">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 mt-10 gap-8">
          {
              products.map(productLoading => (
                <ProductCardLoading key={productLoading._id} />
              ))
            }
          </div>
        </div>    
          </>
        )}
      </div>
    </>
  );
};

export default ShowAllProducts;
