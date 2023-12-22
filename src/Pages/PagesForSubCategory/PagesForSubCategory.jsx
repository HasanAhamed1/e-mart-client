import React from "react";
import { useLoaderData } from "react-router-dom";
import TopLeftBanner from "../../Component/HomeLayout/TopBanner/TopLeftBanner";
import TopRightBanner from "../../Component/HomeLayout/TopBanner/TopRightBanner";
import TopBanner from "../../Component/HomeLayout/TopBanner/TopBanner";
import SlimBanner from "../../Component/SlimBanner";
import ThirdBanner from "../../Component/ThirdBanner";
import TrendingProducts from "../Shared/TrendingProducts";
import SubCategoryAllProducts from "./SubCategoryAllProducts";
import AutoBackToTop from "../../Component/AutoBackToTop";
import BackToTopButton from "../../Component/BackToTopButton";


const PagesForSubCategory = () => {
  const {subCategory, products} = useLoaderData();
  const { _id, name, slug, layout } = subCategory;
  //console.log(products);
  return (
    <>
    
      {layout === 1 && (
        <>
        {subCategory?.topBannerImage && <TopBanner images={subCategory?.topBannerImage}></TopBanner>}
        

        </>
      )}
      {layout === 2 && (
        <>
        <div className="bg-white">
        <div className="grid lg:flex justify-center md:gap-5 py-6">
          { subCategory?.topLeftBannerLayout2 && <TopLeftBanner images={subCategory?.topLeftBannerLayout2} />}
          {subCategory?.topRightBannerLayout2 && <TopRightBanner images={subCategory?.topRightBannerLayout2} />}
        </div>
        <div className="px-4 py-3">
            <SlimBanner slimBanners={subCategory?.slimBanners} ></SlimBanner>
            </div>
            </div>
            
        </>
      )}
      {layout === 3 && <p>Layout 3</p>}

     {
      products.length > 0 && (<div className="bg-white">
      <TrendingProducts products={products} />
      </div>)
     }
     {
      subCategory?.bottomBannerImage && (<div className="bg-white">
        <ThirdBanner images={subCategory.bottomBannerImage} />
      </div>)
    }
      
      {
        products.length > 0 && (<SubCategoryAllProducts products={products} />)
      }
      {/* <SecondBanner images={subCategory.secondBannerImage}></SecondBanner> */}
      {/* <SubCategories subcategory={subcategory}></SubCategories>
      <SecondBanner img={category.secondBannerImage}></SecondBanner>
      */}
      <AutoBackToTop />
      <BackToTopButton />
    </>
  );
};

export default PagesForSubCategory;
