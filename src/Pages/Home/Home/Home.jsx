import React from 'react';
import Banner from '../Banner/Banner';
import Swip from '../Banner/Swip';
import ShowCategories from '../Categories/ShowCategories';
import ShowAllProducts from '../../AllProducts/ShowAllProducts';
import Login from '../../Login/Login';
import SignUp from '../../SignUp/SignUp';
import { Helmet } from 'react-helmet-async';
import HomeSecondBanner from '../HomeSecondBanner';
import HomeTrendingProducts from '../HomeTrendingProducts';
import BackToTopButton from '../../../Component/BackToTopButton';
import { Toaster } from 'react-hot-toast';
import useRole from '../../../Hooks/useRole';
import HomeBottomBanner from '../HomeBottomBanner/HomeBottomBanner';
import AutoBackToTop from '../../../Component/AutoBackToTop';


const Home = () => {
   // const user = useRole();
    return (
        <>    
            <div className=''>
                <Helmet>
                    <title>E-Mart | Home</title>
                </Helmet>
                <Swip></Swip>
                <div className='bg-white'>
                <ShowCategories></ShowCategories>
                </div>
                <HomeSecondBanner></HomeSecondBanner>
                <HomeTrendingProducts></HomeTrendingProducts>
                <div className='bg-white'>
                <HomeBottomBanner />
                </div>
                <ShowAllProducts></ShowAllProducts>
                <AutoBackToTop />
                <BackToTopButton />
            </div>
        </>
    );
};

export default Home;