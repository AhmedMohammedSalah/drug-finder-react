import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Toaster } from "react-hot-toast";

// Layouts
import DefaultLayout from "./components/layout/default-layout";
import Pharmaciestlayout from "./components/layout/pharmaciest-layout";
import ClientLayout from './components/layout/client-layout';
import DashboardLayout from "./components/layout/admin-layout";

// Pages
import Home from "./pages/homePage";
import Drugs from "./pages/drugPage";
import AddDrug from "./pages/addDrugPage";
import Orders from "./pages/ordersPage";
import PharmacyList from "./pages/pharamcieslist";
import PharmacyPage from "./pages/PharmacyPage";
import PharmacyMapPage from "./pages/PharmacyMapPage";
import PharmacistProfile from './pages/pharmacist_pages/PharmacistProfile';
import Users from "./pages/usersAdminPage";
import Medicines from "./pages/medicineAdminPage";
import Stores from "./pages/storesAdminPage";
import Requests from "./pages/admin/PharmacistRequestsPage";
import OrdersAd from "./pages/ordersAdminPage";
import Checkout from "./pages/checkout";
import OrderSuccess from "./pages/ordersucess";
import LoginPage from "./pages/login";
import RegisterPage from "./pages/register";
import NotificationPage from "./components/notifications/notification-page";
import CartPage from "./pages/cart";

// Guards and Services
import {
  RequireAuth,
  RequireNoRole,
  RequireRole,
} from "./guards/authorization-guard";
import { setCredentials } from "./features/authSlice";
import { fetchNotifications } from "./features/notificationSlice";
import apiEndpoints from "./services/api";

function App() {
  
  return (
    <Router>
      <Toaster position="top-right" reverseOrder={false} />
      
      <Routes>
        {/* Auth */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Guest */}
        <Route path="/" element={<DefaultLayout />}>
          <Route index element={<Home />} />
          <Route path="pharmacies" element={<PharmacyList />} />
          <Route path="PharmacyPage" element={<PharmacyPage />} />
          <Route path="PharmacyMapPage" element={<PharmacyMapPage />} />
        </Route>

        {/* Client */}
        <Route path="/client" element={<ClientLayout />}>
          <Route path="cart" element={<CartPage />} />
          <Route path="notifications" element={<NotificationPage />} />
        </Route>

        {/* Pharmacist */}
        <Route path="/pharmacy" element={<Pharmaciestlayout />}>
          <Route path="drugs" element={<Drugs />} />
          <Route path="drugs/add" element={<AddDrug />} />
          <Route path="orders" element={<Orders />} />
          <Route path="profile" element={<PharmacistProfile />} />
          <Route path="notifications" element={<NotificationPage />} />
        </Route>

        {/* Admin */}
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