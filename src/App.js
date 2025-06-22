import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/homePage";
import DefaultLayout from "./components/layout/default-layout";
import Pharmaciestlayout from "./components/layout/pharmaciest-layout";
import Drugs from "./pages/drugPage";
import AddDrug from "./pages/addDrugPage";
import Orders from "./pages/ordersPage";
import PharmacyList from "./pages/pharamcieslist";
import PharmacyPage from "./pages/PharmacyPage.js";
import PharmacyMapPage from "./pages/PharmacyMapPage.js";
import Checkout from "./pages/checkout.js";
import OrderSuccess from "./pages/ordersucess.js";
import {
  RequireAuth,
  RequireNoRole,
  RequireRole,
} from "./guards/authorization-guard.js";
// import Login from './pages/loginPage';
// import Register from './pages/registerPage';
// import Dashboard from './pages/dashboardPage';
// import Drugs from './pages/drugPage'
import LoginPage from "./pages/login.js";
import RegisterPage from "./pages/register.jsx";
import NotificationPage from "./components/notifications/notification-page.jsx";
import CartPage from "./pages/cart.js";
// import CartSyncer from './features/cartSlice.js
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setCredentials } from "./features/authSlice.js";
// import IconButton from './components/shared/iconButton';
function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    // [AMS] check if user is logged in and has role
    const user = JSON.parse(localStorage.getItem("user"));
    const accessToken = localStorage.getItem("access_token");
    const refreshToken = localStorage.getItem("refresh_token");
    // [AMS] if user is logged in, set user in redux store
    if (user && accessToken && refreshToken) {
      dispatch(
        setCredentials({
          user: user,
          accessToken: accessToken,
          refreshToken: refreshToken,
        })
      );
    }
  }, []);
  return (
    <>
     
      <Router>
        <Routes>
          <Route path="/cart" element={<CartPage />}></Route>
          <Route path="/checkout" element={<Checkout />}></Route>
          <Route path="/order-success" element={<OrderSuccess />}></Route>
          {/* [AMS] default layout for guest */}
          {/* <Route element={<RequireNoRole />}> */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* [AMS] this is default layout for guest / client */}
            <Route path="/" element={<DefaultLayout />}>
              {/*[AMS] any route here will have auto header and footer */}
              <Route path="" element={<Home/>} />
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
            <Route path="/pharmacy/drugs" element={<Drugs />} />
            <Route path="/pharmacy/drugs/add" element={<AddDrug />} />
            <Route path="/pharmacy/orders" element={<Orders />} />
            {/* [AMS] 🔔 notification page  */}
            <Route
              path="/pharmacy/notifications"
              element={<NotificationPage />}
            />
          </Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;