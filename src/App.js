import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Toaster } from "react-hot-toast";
import { Bot } from "lucide-react";

// Layouts
import DefaultLayout from "./components/layout/default-layout";
import Pharmaciestlayout from "./components/layout/pharmaciest-layout";
import ClientLayout from "./components/layout/client-layout.jsx";
import DashboardLayout from "./components/layout/admin-layout";

// Pages
import Home from "./pages/homePage";
import Drugs from "./pages/drugPage";
import AddDrug from "./pages/addDrugPage";
import Orders from "./pages/ordersPage";
import PharmacyList from "./pages/pharamcieslist.js";
import PharmacyPage from "./pages/PharmacyPage.js";
import PharmacyMapPage from "./pages/PharmacyMapPage.js";
import PharmacistProfile from "./pages/pharmacist_pages/PharmacistProfile.jsx";
import Users from "./pages/admin/usersAdminPage.js";
import Medicines from "./pages/admin/medicineAdminPage.js";
import Stores from "./pages/admin/storesAdminPage.js";
import Requests from "./pages/admin/PharmacistRequestsPage.jsx";
import OrdersAd from "./pages/admin/ordersAdminPage.js";
import Checkout from "./pages/checkout.js";
import OrderSuccess from "./pages/ordersucess.js";
import OrderHistory from "./pages/orderhistory.js";
import AI_ChatPage from "./pages/Ai_chatpage.js";
import MedicineSearchPage from "./pages/MedicineSearchPage.js";
import LoginPage from "./pages/login.js";
import RegisterPage from "./pages/register.jsx";
import NotificationPage from "./components/notifications/notification-page.jsx";
import CartPage from "./pages/cart.js";
import { setCredentials } from "./features/authSlice.js";
import ProfilePage from "./pages/ClientProfilePage.js";
import apiEndpoints from "./services/api.js";
// import IconButton from './components/shared/iconButton';
import PharmacistStoreProfilePage from "./pages/pharmacist_pages/StoreProfilePage.jsx";
import ChatBox from "./pages/AI_chatBox.js";
import UnauthorizedPage from "./pages/unauthorized.js";
import NotFoundPage from "./pages/Notfound.js";
import ClientProfilePage from "./pages/ClientProfilePage.js";
import EditClientProfilePage from "./pages/EditClientProfilePage.js";
import ClientStoreProfile from "./pages/pharmacist_pages/ClientStoreProfile.jsx";
import SharedLoadingComponent from "./components/shared/medicalLoading.js";

// Guards
import {
  RequireAuth,
  RequireRole,
  RequireNoRole,
} from "./guards/authorization-guard.js";

// Services

function App() {
  const [showChat, setShowChat] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    const accessToken = localStorage.getItem("access_token");
    const refreshToken = localStorage.getItem("refresh_token");
    if (accessToken && refreshToken) {
      apiEndpoints.users
        .getCurrentUser()
        .then((response) => {
          dispatch(
            setCredentials({
              user: response.data,
              access: accessToken,
              refresh: refreshToken,
            })
          );
        })
        .catch(() => {
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
        });
    }
  }, [dispatch]);

  return (
    <Router>
      <Toaster position="top-right" reverseOrder={false} />

      {/* Floating Chat Button */}
      <div className="fixed bottom-6 right-6 z-50">
        {showChat ? (
          <div className="w-[380px] h-[600px] bg-white rounded-xl shadow-2xl flex flex-col border border-gray-200 overflow-hidden">
            <ChatBox onClose={() => setShowChat(false)} />
          </div>
        ) : (
          <button
            onClick={() => setShowChat(true)}
            className="bg-white text-blue-600 w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition-all border border-gray-200"
          >
            <Bot size={24} />
          </button>
        )}
      </div>

      <Routes>
        {/* Public Routes */}
        <Route element={<RequireNoRole />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>

        
        <Route path="test" element={<SharedLoadingComponent />} />
        <Route path="order-success" element={<OrderSuccess />}></Route>

        {/* Guest Routes (No auth required) */}
        <Route path="/" element={<DefaultLayout />}>
          <Route index element={<Home />} />
          <Route path="pharmacies" element={<PharmacyList />} />
          {/* <Route path="pharmacy/:id" element={<PharmacyPage />} /> [SENU] ANOTHER WRONG PATH */}
          <Route path="PharmacyMapPage" element={<PharmacyMapPage />} />
        </Route> 


        {/*===========================================================*/}

          <Route path="/profile" element={<ClientProfilePage/>} />
  <Route path="/profile/edit" element={<EditClientProfilePage/>} />
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
          <Route path="MedicineSearchPage" element={<MedicineSearchPage />} />
        </Route>

        {/* Client Routes */}
        <Route element={<RequireRole allowedRoles={["client"]} />}>
          <Route path="/client" element={<ClientLayout />}>
            <Route index element={<PharmacyMapPage />} />
            <Route path="cart" element={<CartPage />} />
            <Route path="checkout" element={<Checkout />} />
            <Route path="pharmacies" element={<PharmacyList />} />
            <Route
              path="pharmacies/:storeId"
              element={<ClientStoreProfile />}
            />
            <Route path="PharmacyPage" element={<PharmacyPage />} />{" "}
            <Route path="notifications" element={<NotificationPage />} />
            <Route path="MedicineSearchPage" element={<MedicineSearchPage />} />
            <Route path="order" element={<OrderHistory />} />
            <Route path="profile" element={<ProfilePage />} />
            {/* <Route path="pharmacy/:id" element={<PharmacyPage />} /> [SENU]  WRGON PATH */}
            <Route path="PharmacyMapPage" element={<PharmacyMapPage />} />
          </Route>
          <Route path="order-success" element={<OrderSuccess />} />
        </Route>

        {/* Pharmacist Routes */}
        <Route element={<RequireRole allowedRoles={["pharmacist"]} />}>
          <Route path="/pharmacy" element={<Pharmaciestlayout />}>
            {/* <Route index element={<Drugs />} /> */}
            <Route path="store" element={<PharmacistStoreProfilePage />} />
            {/* <Route path="drugs" element={<Drugs />} /> */}
            <Route path="drugs/add" element={<AddDrug />} />
            <Route path="orders" element={<Orders />} />
            <Route path="profile" element={<PharmacistProfile />} />
            <Route path="notifications" element={<NotificationPage />} />
          </Route>
        </Route>

        {/* Admin Routes */}
        <Route element={<RequireRole allowedRoles={["admin"]} />}>
          <Route path="/admin" element={<DashboardLayout />}>
            <Route index element={<Requests />} />
            <Route path="requests" element={<Requests />} />
            <Route path="users" element={<Users />} />
            <Route path="medicines" element={<Medicines />} />
            <Route path="stores" element={<Stores />} />
            <Route path="orders" element={<OrdersAd />} />
          </Route>
        </Route>

        {/* Authenticated Routes (Any role) */}
        <Route element={<RequireAuth />}>
          <Route path="/chat" element={<AI_ChatPage />} />
        </Route>
        {/* Utility Routes */}
        <Route path="/test" element={<SharedLoadingComponent />} />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}

export default App;
