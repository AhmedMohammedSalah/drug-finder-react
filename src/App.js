import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/homePage';
import DefaultLayout from './components/layout/default-layout';   
import Pharmaciestlayout from './components/layout/pharmaciest-layout';
import Drugs from './pages/drugPage';
import Orders from './pages/ordersPage';
import PharmacyList from './pages/pharamcieslist';  
import PharmacyPage from './pages/PharmacyPage.js';
import LoginPage from './pages/login.js';     


function App() {
  return (
    <Router>
      <Routes>
        {/* [AMS] this is default layout for guest / client */}
        <Route path="/" element={<DefaultLayout />}>
          {/*[AMS] any route here will have auto header and footer */}
          <Route path="" element={<Home />} />
          <Route path="/pharmacies" element={<PharmacyList />}/>
          <Route path="/PharmacyPage" element={<PharmacyPage />}/>
          {/* [SENU: FOR TEST: LOGIN] */}
          <Route path="/login" element={<LoginPage />}/>        
        </Route>

        <Route path="/pharmacy" element={<Pharmaciestlayout />}>
          <Route path="/pharmacy/drugs" element={<Drugs />}/>
          <Route path="/pharmacy/orders" element={<Orders />}/>
          {/* [SENU: FOR TEST: LOGIN] */}
          <Route path="/login" element={<LoginPage />}/>        
        </Route>
        
        <Route path="/Drugs" element={<Drugs />}/>
        <Route path="/pharmacies" element={<PharmacyList />}/>
        <Route path="/PharmacyPage" element={<PharmacyPage />}/>
      </Routes>
    </Router>
  );
}

export default App;
