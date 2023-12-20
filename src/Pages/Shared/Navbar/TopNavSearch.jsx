import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const TopNavSearch = () => {
    const [searchText, setSearchText] = useState('');
  const [products, setProducts] = useState([]);
  const [selectedProductIndex, setSelectedProductIndex] = useState(-1);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      if (selectedProductIndex >= 0 && selectedProductIndex < products.length) {
        const selectedProduct = products[selectedProductIndex];
        navigate(`/product/${selectedProduct.slug_name}`);
        setSearchText('');
      } else {
        const searchTerm = inputRef.current.value;
        navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
        setSearchText('');
        setProducts([]);
        setSelectedProductIndex(-1);
      }
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setSelectedProductIndex((prevIndex) =>
        prevIndex > 0 ? prevIndex - 1 : products.length - 1
      );
    } else if (event.key === 'ArrowDown') {
      event.preventDefault();
      setSelectedProductIndex((prevIndex) =>
        prevIndex < products.length - 1 ? prevIndex + 1 : 0
      );
    }
  };
  
  const handleInputChange = () => {
    const searchTerm = inputRef.current.value;
    setSearchText(searchTerm);
    setSelectedProductIndex(-1);
  };

  const handleProductClick = (product) => {
    navigate(`/product/${product.slug_name}`);
    setSearchText('');
  };

  const closeSearchResults = () => {
    setSearchText('');
    setProducts([]);
    setSelectedProductIndex(-1);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_ADDRESS}/search?q=${searchText}`
        );
        if (response.status === 200) {
          setProducts(response.data);
          setSelectedProductIndex(-1);
        }
      } catch (error) {
        // console.error('Error fetching data:', error);
      }
    };

    if (searchText) {
      fetchData();
    } else {
      setProducts([]);
      setSelectedProductIndex(-1);
    }
  }, [searchText]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        inputRef.current &&
        !inputRef.current.contains(event.target) &&
        document.getElementById('search-result') &&
        !document.getElementById('search-result').contains(event.target)
      ) {
        closeSearchResults();
      }
    };

    window.addEventListener('click', handleClickOutside);

    return () => {
      window.removeEventListener('click', handleClickOutside);
    };
  }, []);
    return (
        <>
      <div className="w-full xl:w-[52rem] relative">
        <form className="w-full">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9.8055 17.296C13.9424 17.296 17.296 13.9424 17.296 9.80549C17.296 5.66862 13.9424 2.31503 9.8055 2.31503C5.66863 2.31503 2.31503 5.66862 2.31503 9.80549C2.31503 13.9424 5.66863 17.296 9.8055 17.296Z"
                stroke="#A9A9A9"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M15.0153 15.4043L17.9519 18.3333"
                stroke="#A9A9A9"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="sr-only">Search icon</span>
          </div>
          <input
            type="search"
            id="search"
            ref={inputRef}
            value={searchText}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            autoComplete="off"
            name="q"
            className="input-field block w-full h-10 p-2 pl-10 text-base rounded-md bg-white md:bg-light-100"
            placeholder="Search..."
          />
        </form>
        {products.length > 0 && (
          <div
            id="search-result"
            className="absolute top-full w-full bg-white rounded-b-xl shadow-md transform translate-y-2"
          >
            {products.slice(0, 8).map((product, index) => (
              <div
                key={index}
                className={`${index === selectedProductIndex ? 'bg-slate-100' : ''
                  } ${index !== products.length - 1 ? 'border-b' : ''
                  } p-3 hover:bg-slate-100 hover:cursor-pointer flex gap-2 items-center`}
                onClick={() => handleProductClick(product)}
                tabIndex={0}
              >
                <div className="">
                  <img src={product?.img} alt="" className="w-6 h-6 object-cover" />
                </div>
                <p className="text-base">{product?.name}</p>
                <p className="text-sm">{product?.size}</p>
              </div>
            ))}
          </div>
        )}


      </div>
    </>
    );
};

export default TopNavSearch;