import React from "react";
import { Link, useLoaderData } from "react-router-dom";
import SecondBanner from "../../Component/SecondBanner";
import TopLeftBanner from "../../Component/HomeLayout/TopBanner/TopLeftBanner";
import TopRightBanner from "../../Component/HomeLayout/TopBanner/TopRightBanner";
import TopBanner from "../../Component/HomeLayout/TopBanner/TopBanner";
import SlimBanner from "../../Component/SlimBanner";
import ThirdBanner from "../../Component/ThirdBanner";
import SubCategories from "../../Component/SubCategory/SubCategories";
import TrendingProducts from "../Shared/TrendingProducts";
import SubCategoryAllProducts from "../PagesForSubCategory/SubCategoryAllProducts";
import AutoBackToTop from "../../Component/AutoBackToTop";
import BackToTopButton from "../../Component/BackToTopButton";



const PagesForCategory = () => {
  const {category, subcategory, products} = useLoaderData();
  const { _id, name, slug, layout } = category;
  //console.log(products);
  return (
    <>
    
      {layout === 1 && (
        <>
        {category?.topBannerImage && <TopBanner images={category.topBannerImage}></TopBanner>}

        </>
      )}
      {layout === 2 && (
        <>
        <div className="bg-white">
        <div className="grid lg:flex justify-center md:gap-5 py-6">
          { category?.topLeftBannerLayout2 && <TopLeftBanner images={category?.topLeftBannerLayout2} />}
          {category?.topRightBannerLayout2 && <TopRightBanner images={category?.topRightBannerLayout2} />}
        </div>
        <div className="px-4 py-3">
            <SlimBanner slimBanners={category?.slimBanners} ></SlimBanner>
            </div>
            </div>
            
        </>
      )}
      {layout === 3 && (
        <div>
          <div className="grid lg:flex justify-center md:gap-5 py-6">
          { category?.topLeftBannerLayout2 && <TopLeftBanner images={category?.topLeftBannerLayout2} />}
          {category?.topRightBannerLayout2 && <TopRightBanner images={category?.topRightBannerLayout2} />}
        </div>
        </div>
      )}
      {
        category.name==="medicine" && (<><Link to="/upload-prescription">Upload your prescription</Link></>)
      }
      {
        subcategory.length > 0 && (<SubCategories subcategory={subcategory}></SubCategories>)
      }
      {
        category?.secondBannerImage && (<div className="bg-white">
          <SecondBanner images={category.secondBannerImage}></SecondBanner>
        </div>)
      }
      {
      products.length > 0 && (
      <div className="">
      <TrendingProducts products={products} />
     </div>
     )
    }
    {
      category?.bottomBannerImage && (<div className="bg-white">
        <ThirdBanner images={category.bottomBannerImage} />
      </div>)
    }
      
      {
        products.length > 0 && (<SubCategoryAllProducts products={products} />)
      }
    <AutoBackToTop />
    <BackToTopButton />
    </>
  );
};

export default PagesForCategory;
