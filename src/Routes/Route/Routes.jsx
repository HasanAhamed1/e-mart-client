import { createBrowserRouter } from "react-router-dom";
import Main from "../../Layout/Main";
import Home from "../../Pages/Home/Home/Home";
import Login from "../../Pages/Login/Login";
import SignUp from "../../Pages/SignUp/SignUp";
import PagesForCategory from "../../Pages/PagesForCategory/PagesForCategory";
import PrivateRoutes from "../PrivateRoute/PrivateRoutes";
import MyCart from "../../Pages/Dashboard/Dashboard/MyCart";
import AllProducts from "../../Pages/AllProducts/AllProducts";
import Dashboard from "../../Layout/Dashboard/Dashboard";
import ProductOverView from "../../Pages/OverView/ProductOverView";
import AllUsers from "../../Pages/Dashboard/Dashboard/AdminDashboard/AllUsers";
import AdminRoute from "../AdminRoute/AdminRoute";
import AddProduct from "../../Pages/Dashboard/Dashboard/AdminDashboard/AddProduct";
import HomePageLayout from "../../Pages/Dashboard/Dashboard/AdminDashboard/UploadCategory/HomePageLayout";
import UpdateTopBanner from "../../Pages/Dashboard/Dashboard/AdminDashboard/UploadCategory/UpdateTopBanner";
import UpdateSecondBanner from "../../Pages/Dashboard/Dashboard/AdminDashboard/UploadCategory/UpdateSecondBanner";
import UpdateBottomBanner from "../../Pages/Dashboard/Dashboard/AdminDashboard/UploadCategory/UpdateBottomBanner";
import ManageProduct from "../../Pages/Dashboard/Dashboard/AdminDashboard/UploadCategory/ManageProduct";
import UserHome from "../../Pages/Dashboard/Dashboard/UserDashboard/UserHome";
import AdminHome from "../../Pages/Dashboard/Dashboard/AdminDashboard/AdminHome/AdminHome";
import UpdateBottomSecondBanner from "../../Pages/Dashboard/Dashboard/AdminDashboard/UploadCategory/UpdateBottomSecondBanner";
import AllCategories from "../../Pages/Dashboard/Dashboard/AdminDashboard/AllCategories";
import Error from "../../Pages/Shared/error/Error";
import SelectLayout from "../SelectLayout/SelectLayout";
import TopRightBannerLayout2 from "../../Pages/Dashboard/Dashboard/AdminDashboard/UploadCategory/SecondLayout/TopRightBannerLayout2";
import TopLeftBannerLayout2 from "../../Pages/Dashboard/Dashboard/AdminDashboard/UploadCategory/SecondLayout/TopLeftBannerLayout2";
import UploadSlimBanner from "../../Pages/Dashboard/Dashboard/AdminDashboard/UploadCategory/UploadSlimBanner";
import SelectType from "../../Pages/SelectType/SelectType";
import CheckOut from "../../Pages/Dashboard/Dashboard/CheckOut";
import UserProfile from "../../Pages/Dashboard/Dashboard/AdminDashboard/UserDashboard/UserProfile";
import EditUserProfile from "../../Pages/Dashboard/Dashboard/AdminDashboard/UserDashboard/EditUserProfile";
import AddCoupon from "../../Pages/Dashboard/Dashboard/AdminDashboard/CouponCode/AddCoupon";
import DeliveryCharge from "../../Pages/Dashboard/Dashboard/AdminDashboard/DeliveryCharge/DeliveryCharge";
import Coupon from "../../Pages/Dashboard/Dashboard/AdminDashboard/CouponCode/Coupon";
import Payment from "../../Pages/Dashboard/Dashboard/Payment/Payment";
import CheckoutForm from "../../Pages/Dashboard/Dashboard/Payment/CheckoutForm";
import PaymentHistory from "../../Pages/Dashboard/Dashboard/Payment/PaymentHistory";
import PaymentMethods from "../../Pages/Dashboard/Dashboard/Payment/PaymentMethods";
import OrderDetails from "../../Pages/Dashboard/Dashboard/AdminDashboard/UserDashboard/OrderDetails/OrderDetails";
import WishList from "../../Pages/Dashboard/Dashboard/AdminDashboard/UserDashboard/WishList";
import OrderedProducts from "../../Pages/Dashboard/Dashboard/AdminDashboard/OrderedProducts/OrderedProducts";
import OrderDetailsView from "../../Pages/Dashboard/Dashboard/AdminDashboard/UserDashboard/OrderDetails/OrderDetailsView";
import BlockLogin from "../PrivateRoute/BlockLogin";
import BlockAdmin from "../PrivateRoute/BlockAdmin";
import AllowAdmin from "../PrivateRoute/AllowAdmin";
import AdminOrderDetail from "../../Pages/Dashboard/Dashboard/AdminDashboard/OrderedProducts/AdminOrderDetail/AdminOrderDetail";
import PagesForSubCategory from "../../Pages/PagesForSubCategory/PagesForSubCategory";
import HomeTopBanner from "../../Pages/Dashboard/Dashboard/AdminDashboard/HomeEdit/HomeTopBanner";
import HomeSecondBannerUpload from "../../Pages/Dashboard/Dashboard/AdminDashboard/HomeEdit/HomeSecondBannerUpload";
import HomeBottomBannerUpload from "../../Pages/Dashboard/Dashboard/AdminDashboard/HomeEdit/HomeBottomBannerUpload";
import ManageSubCategories from "../../Pages/Dashboard/Dashboard/AdminDashboard/ManageSubCategories";
import ShowDeliveredOrder from "../../Pages/Dashboard/Dashboard/AdminDashboard/UserDashboard/UserReview/ShowDeliveredOrder";
import DeliveredOrderDetails from "../../Pages/Dashboard/Dashboard/AdminDashboard/UserDashboard/UserReview/DeliveredOrderDetails";
import NoProfileWarning from "../PrivateRoute/NoProfileWarning";
import EditProduct from "../../Pages/Dashboard/Dashboard/AdminDashboard/UploadCategory/EditProduct";
import AboutUs from "../../Pages/Shared/AboutUs/AboutUs";
import UploadPrescription from "../../Pages/Prescription/UploadPrescription";



const router = createBrowserRouter([
  
    {
      path: "/",
      element: <Main></Main>,
      children: [
        {
            path: "/",
            element: <Home></Home>
        },
        
        {
          path: "/login",
          element: <BlockLogin><Login></Login></BlockLogin>
        },
        {
          path: "/signUp",
          element: <BlockLogin><SignUp></SignUp></BlockLogin>
        },
        {
          path: "/overview/:id",
          element: <ProductOverView></ProductOverView>,
          loader: ({params}) => fetch(`${import.meta.env.VITE_SERVER_ADDRESS}/products/${params.id}`)
        },
        {
          path: "/allproducts",
          element: <AllProducts></AllProducts>
        },
        {
          path: "/categoryPages/:slug",
          element: <PagesForCategory></PagesForCategory>,
          loader: ({params}) => fetch(`${import.meta.env.VITE_SERVER_ADDRESS}/categories/${params.slug}`)
        },
        {
          path: "/sub-category-pages/:slug",
          element: <PagesForSubCategory />,
          loader: ({params}) => fetch(`${import.meta.env.VITE_SERVER_ADDRESS}/sub-categories/${params.slug}`)
        },
        {
          path: "/about-us",
          element: <AboutUs />
        },
        {
          path: "/upload-prescription",
          element: <UploadPrescription />
        },
        // {
        //   path: "/reviews",
        //   element: <Reviews />
        // },
        
      ]
    },
    {
      path: 'dashboard',
      element: <PrivateRoutes><Dashboard></Dashboard></PrivateRoutes>,
      children: [
        {
          path: "user-profile",
          element: <UserProfile />
        },
        {
          path: "edit-user-profile",
          element: <EditUserProfile />
        },
        
        {
          path: "myCart",
          element: <BlockAdmin><MyCart></MyCart></BlockAdmin>
        },
        // {
        //   path: "wish-list",
        //   element: <BlockAdmin><WishList /></BlockAdmin>
        // },
        {
          path: "check-out",
          element:<BlockAdmin><NoProfileWarning><CheckOut /></NoProfileWarning></BlockAdmin> 
        },
        {
          path: "payment-methods/:_OrderID",
          element: <BlockAdmin><NoProfileWarning><PaymentMethods /></NoProfileWarning></BlockAdmin>
        },
        {
          path: "payment/:_OrderID",
          element: <BlockAdmin><NoProfileWarning><Payment /></NoProfileWarning></BlockAdmin>
        },
        {
          path: "payment-history",
          element: <BlockAdmin><PaymentHistory /></BlockAdmin>
        },
        {
          path: "check-out-form",
          element: <BlockAdmin><NoProfileWarning><CheckoutForm /></NoProfileWarning></BlockAdmin>
        },
        {
          path: "order-details",
          element: <BlockAdmin><OrderDetails /></BlockAdmin>
        },
        {
          path: "order-details/:orderId",
          element: <BlockAdmin><OrderDetailsView /></BlockAdmin>
        },
        {
          path: 'add-review/:type',
          element: <NoProfileWarning><ShowDeliveredOrder /></NoProfileWarning>
        },
        {
          path: 'add-review/:type/:orderId',
          element: <DeliveredOrderDetails />
        },
        {
          path: "allUsers",
          element: <AllowAdmin allowedRoles={["admin"]}><AllUsers></AllUsers></AllowAdmin>
        },
        {
          path: "admin-home",
          element: <AdminRoute><AdminHome></AdminHome></AdminRoute>
        },
        {
          path: 'addProduct',
          element: <AllowAdmin allowedRoles={["admin", "Product Manager"]}><AddProduct></AddProduct></AllowAdmin>
        },
        {
          path: 'manageProduct',
          element: <AllowAdmin allowedRoles={["admin", "Product Manager"]}><ManageProduct /></AllowAdmin>
        },
        {
          path: 'edit-product/:id',
          element: <AllowAdmin allowedRoles={["admin", "Product Manager"]}><EditProduct /></AllowAdmin>,
          loader: ({params}) => fetch(`${import.meta.env.VITE_SERVER_ADDRESS}/products/${params.id}`)
        },
        {
          path: 'delivery-charge',
          element: <AdminRoute><DeliveryCharge /></AdminRoute>
        },
        {
          path: 'add-coupon',
          element: <AllowAdmin allowedRoles={["admin", "Order Manager"]}><AddCoupon /></AllowAdmin>
        },
        {
          path: 'manage-coupon',
          element: <AllowAdmin allowedRoles={["admin", "Order Manager"]}><Coupon /></AllowAdmin>
        },
        {
          path: 'orders/:type',
          element: <AllowAdmin allowedRoles={["admin", "Order Manager", "Delivery Partner"]}><OrderedProducts /></AllowAdmin>
        },
        {
          path: 'orders/:type/:orderId',
          element: <AllowAdmin allowedRoles={["admin", "Order Manager", "Delivery Partner"]}><AdminOrderDetail /></AllowAdmin>
        },
        {
          path: 'all-categories',
          element: <AllowAdmin allowedRoles={["admin", "Product Manager"]}><AllCategories /></AllowAdmin>
        },
        {
          path: 'manage-sub-categories',
          element: <AllowAdmin allowedRoles={["admin", "Product Manager"]}><ManageSubCategories /></AllowAdmin>
        },
        {
          path: 'upload/:type',
          element: <AllowAdmin allowedRoles={["admin", "Product Manager"]}><SelectType /></AllowAdmin>
        },
        {
          path: 'upload/:type/:slug/home-page-layout',
          element: <AllowAdmin allowedRoles={["admin", "Product Manager"]}><HomePageLayout /></AllowAdmin>
        },
        {
          
          path: 'upload/:type/:slug/home-page-layout/:layout',
          
          element: <AllowAdmin allowedRoles={["admin", "Product Manager"]}><SelectLayout /></AllowAdmin>
        },
        {
          path: 'home-top-banner',
          element: <AllowAdmin allowedRoles={["admin", "Product Manager"]}><HomeTopBanner /></AllowAdmin>,
          errorElement: <Error /> 
        },
        {
          path: 'home-second-banner',
          element: <AllowAdmin allowedRoles={["admin", "Product Manager"]}><HomeSecondBannerUpload /></AllowAdmin>,
          errorElement: <Error /> 
        },
        {
          path: 'home-bottom-banner',
          element: <AllowAdmin allowedRoles={["admin", "Product Manager"]}><HomeBottomBannerUpload /></AllowAdmin>,
          errorElement: <Error /> 
        },
        {
          path: 'upload/:type/:slug/upload-top-banner',
          element: <AllowAdmin allowedRoles={["admin", "Product Manager"]}><UpdateTopBanner /></AllowAdmin>,
          errorElement: <Error /> 
        },
        {
          path: 'upload/:type/:slug/upload-second-banner',
          element: <AllowAdmin allowedRoles={["admin", "Product Manager"]}><UpdateSecondBanner /></AllowAdmin>,
          errorElement: <Error></Error>
        },
        {
          path: 'upload/:type/:slug/upload-bottom-banner',
          element: <AllowAdmin allowedRoles={["admin", "Product Manager"]}><UpdateBottomBanner /></AllowAdmin>,
          errorElement: <Error />
        },
        {
          path: 'upload/:type/:slug/upload-bottom-second-banner',
          element: <AllowAdmin allowedRoles={["admin", "Product Manager"]}><UpdateBottomSecondBanner /></AllowAdmin>,
        },
        {
          path: 'upload/:type/:slug/upload-top-left-banner-layout2',
          element: <AllowAdmin allowedRoles={["admin", "Product Manager"]}><TopLeftBannerLayout2 /></AllowAdmin>,
          errorElement: <Error />
        },
        {
          path: 'upload/:type/:slug/upload-top-right-banner-layout2',
          element: <AllowAdmin allowedRoles={["admin", "Product Manager"]}><TopRightBannerLayout2 /></AllowAdmin>,
          errorElement: <Error />
        },
        {
          path: 'upload/:type/:slug/upload-slim-banner',
          element: <AllowAdmin allowedRoles={["admin", "Product Manager"]}><UploadSlimBanner /></AllowAdmin>,
          errorElement: <Error />
        },
        
      ]
    }
  ]);

export default router;