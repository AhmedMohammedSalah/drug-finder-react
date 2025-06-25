import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/homePage";
import DefaultLayout from "./components/layout/default-layout";
import Pharmaciestlayout from "./components/layout/pharmaciest-layout";
import Drugs from "./pages/drugPage";
import AddDrug from "./pages/addDrugPage";
import Orders from "./pages/ordersPage";
import PharmacyList from "./pages/pharamcieslist.js";
import PharmacyPage from "./pages/PharmacyPage.js";
import PharmacyMapPage from "./pages/PharmacyMapPage.js";

// [SENU]: ADDED
import PharmacistProfile from './pages/pharmacist_pages/PharmacistProfile.jsx';
import ClientLayout from './components/layout/client-layout.jsx';

// [SENU]: SARA ADDED THEM
import DashboardLayout from "./components/layout/admin-layout";
import Users from "./pages/usersAdminPage.js";
import Medicines from "./pages/medicineAdminPage.js";
import Stores from "./pages/storesAdminPage.js";
import Requests from "./pages/admin/PharmacistRequestsPage.jsx";
import OrdersAd from "./pages/ordersAdminPage.js";

import Checkout from "./pages/checkout.js";
import OrderSuccess from "./pages/ordersucess.js";

import OrderHistory from "./pages/orderhistory.js";

import {
  RequireAuth,
  RequireNoRole,
  RequireRole,
} from "./guards/authorization-guard.js";

import LoginPage from "./pages/login.js";
import RegisterPage from "./pages/register.jsx";
import NotificationPage from "./components/notifications/notification-page.jsx";
import CartPage from "./pages/cart.js";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setCredentials } from "./features/authSlice.js";
import ProfilePage from "./pages/profilePage.js";
import apiEndpoints from "./services/api.js";
// import IconButton from './components/shared/iconButton';
import { Toaster } from "react-hot-toast";
import PharmacistStoreProfilePage from "./pages/pharmacist_pages/StoreProfilePage.jsx";

function App() {
  const dispatch = useDispatch();

  
  useEffect(() => {
    const accessToken = localStorage.getItem("access_token");
    const refreshToken = localStorage.getItem("refresh_token");
    const user = localStorage.getItem("user");
    if (accessToken && refreshToken) {
      // Fetch user data
      // apiEndpoints.users
      //   .getCurrentUser()
      //   .then((response) => {
      //     dispatch(
      //       setCredentials({
      //         user: response.data,
      //         access: accessToken,
      //         refresh: refreshToken,
      //       })
      //     );
      //   })
      // .catch(() => {
      //   localStorage.removeItem("access_token");
      //   localStorage.removeItem("refresh_token");
      // });
      dispatch(
        setCredentials({
          user: user,
          access: accessToken,
          refresh: refreshToken,
        })
      );
    }
  }, []);

  return (
    <Router>
      {/* Toast Notifications */}
      <Toaster position="top-right" reverseOrder={false} />

      <Routes>
        {/* Auth */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/*===========================================================*/}
          
          
        {/* Guest */}
        <Route path="/" element={<DefaultLayout />}>
          <Route index element={<Home />} />
        </Route>

        {/*===========================================================*/}

          
          {/*[OKS] order success page */}
          <Route path="order-success" element={<OrderSuccess />}></Route>

        {/*===========================================================*/}

          
          {/* CLIENT*/}
          <Route path="/client" element={<ClientLayout />}>
            <Route index  element={<PharmacyMapPage />} />
            <Route path="cart" element={<CartPage />}></Route>
            <Route path="checkout" element={<Checkout />}></Route> 
            <Route path="pharmacies" element={<PharmacyList />} />
            <Route path="PharmacyPage" element={<PharmacyPage />} />{" "}
            <Route path="notifications" element={<NotificationPage />} /> {/* [AMS] 🔔 notification page  */}
            {/* <Route path="PharmacyPage" element={<PharmacyPage />} /> */}
            <Route path="PharmacyMapPage" element={<PharmacyMapPage />} />
            <Route path="order" element={<OrderHistory />} /> {/* [OKS] Order History Page */}
          </Route>
          
        {/*===========================================================*/}


        {/* PHARMACIST */}
        <Route path="/pharmacy" element={<Pharmaciestlayout />}> 
          <Route path="drugs" element={<Drugs />} />                     
          <Route path="drugs/add" element={<AddDrug />} />              
          <Route path="orders" element={<Orders />} />                    
          <Route path="profile" element={<PharmacistProfile/>} />
          <Route path="notifications" element={<NotificationPage />} /> {/* [AMS] 🔔 notification page  */}
        </Route>
 
         {/*===========================================================*/}

          
        {/* GUEST: with header and footer */}
        {/* <Route path="/" element={<DefaultLayout />}>
          <Route index element={<Home />} />
          <Route path="pharmacies" element={<PharmacyList />} />
          <Route path="PharmacyPage" element={<PharmacyPage />} />
          <Route path="notifications" element={<NotificationPage />} />
          <Route path="PharmacyMapPage" element={<PharmacyMapPage />} />
        </Route> */}
        

       {/*===========================================================*/}

        <Route path="MyProfile" element={<ProfilePage />} />
        {/* PHARMACY DASHBOARD */}
        <Route path="/cart" element={<CartPage />}></Route>
        {/* [AMS] default layout for guest */}
        {/* <Route element={<RequireNoRole />}> */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* [AMS] this is default layout for guest / client */}
        <Route path="/" element={<DefaultLayout />}>
          {/*[AMS] any route here will have auto header and footer */}
          <Route path="" element={<Home />} />
          <Route path="/pharmacies" element={<PharmacyList />} />
          <Route path="/PharmacyPage" element={<PharmacyPage />} />{" "}
          {/* [AMS] 🔔 notification page  */}
          <Route path="/notifications" element={<NotificationPage />} />
          <Route path="/pharmacies" element={<PharmacyList />} />
          <Route path="/PharmacyPage" element={<PharmacyPage />} />
          <Route path="/PharmacyMapPage" element={<PharmacyMapPage />} />
        </Route>
        {/* </Route> */}

        <Route path="/pharmacy" element={<Pharmaciestlayout />}>
          <Route path="create-store" element={<PharmacistStoreProfilePage />} />
          <Route path="drugs" element={<Drugs />} />
          <Route path="drugs/add" element={<AddDrug />} />
          <Route path="orders" element={<Orders />} />
          <Route path="profile" element={<PharmacistProfile />} />
          <Route path="notifications" element={<NotificationPage />} />
        </Route>
        {/*===========================================================*/}
        {/* CLIENT */}
        {/* <Route path="/client" element={<ClientLayout />}> */}
          {/* <Route path="cart" element={<CartPage />} /> */}
          {/* <Route path="pharmacies" element={<PharmacyList />} /> */}
          {/* <Route path="PharmacyPage" element={<PharmacyPage />} /> */}
          {/* <Route path="notifications" element={<NotificationPage />} /> */}
          {/* <Route path="PharmacyMapPage" element={<PharmacyMapPage />} /> */}
        {/*=======================================================================================*/}
        {/* </Route> */}

        {/*===========================================================*/}
        
        {/* ADMIN */}
        <Route path="/admin" element={<DashboardLayout />}>
          <Route index element={<Requests />} />
          <Route path="requests" element={<Requests />} />
          <Route path="users" element={<Users />} />
          <Route path="medicines" element={<Medicines />} />
          <Route path="stores" element={<Stores />} />
          <Route path="orders" element={<OrdersAd />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;