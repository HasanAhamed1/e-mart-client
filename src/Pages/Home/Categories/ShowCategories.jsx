import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
// import required modules
import { Autoplay } from "swiper";
import { Link } from 'react-router-dom';

const ShowCategories = () => {
    const [category, setCategory] = useState([]);

    useEffect(() => {
        fetch(`${import.meta.env.VITE_SERVER_ADDRESS}/categories`)
        .then(res => res.json())
        .then(data => setCategory(data))
    }, [])

    return (
        <>
        <div className='py-8 lg:py-20 px-5 lg:px-16'>
            <div className='grid grid-cols-3 items-center gap-0'>
            <h3 className='text-lg md:text-2xl font-bold'>Categories</h3>
            <hr className='border'/>
            <hr className='border'/>
            </div>
        <div className='w-full md:w-[700px] lg:w-[1200px] mx-auto mt-3 lg:mt-10'>
        <Swiper
        slidesPerView={2}
        spaceBetween={5}
        autoplay={{
          delay: 2000,
          disableOnInteraction: false,
        }}
        breakpoints={{
          "@0.00": {
            slidesPerView: 2,
            spaceBetween: 5,
          },
          "@0.75": {
            slidesPerView: 2,
            spaceBetween: 5,
          },
          "@1.00": {
            slidesPerView: 3,
            spaceBetween: 5,
          },
          "@1.50": {
            slidesPerView: 5,
            spaceBetween: 5,
          },
        }}
        modules={[Autoplay]}
        className="mySwiper"
        
        
      >
        
          {
            category.map(categories => ( <SwiperSlide
                key={categories._id}>
            <div className="w-full h-36 md:w-44 md:h-44 lg:w-64 lg:h-64 hover:drop-shadow-xl">
            <Link to={`/categoryPages/${categories.slug}`}>
        <div className=''>
            <img src={categories.img} alt="" className='rounded-full w-24 h-24 md:w-36 md:h-36 lg:w-44 lg:h-44 mx-auto shadow-md' />
            <p className='lg:text-xl font-semibold text-center mt-3'>{categories.name}</p>
        </div>
        </Link>
      </div>
            </SwiperSlide>)
          )}
          
        </Swiper>
        </div>
        </div>
        </>
    );
};

export default ShowCategories;