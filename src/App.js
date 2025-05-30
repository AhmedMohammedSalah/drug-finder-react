import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/homePage';
import Drugs from './pages/drugPage';
import PharmacyList from './pages/pharamcieslist.js';
import PharmacyPage from './pages/PharmacyPage.js';

// import Login from './pages/loginPage';
// import Register from './pages/registerPage';
// import Dashboard from './pages/dashboardPage';
// import Drugs from './pages/drugPage'
import DefaultLayout from './components/layout/default-layout';
// import IconButton from './components/shared/iconButton';     


function App() {
  return (
    <Router>
      <Routes>
        {/* [AMS] this is default layout for guest / client */}
        <Route path="/" element={<DefaultLayout />}>
          {/*[AMS] any route here will have auto header and footer */}
          <Route path="" element={<Home />} />
        </Route>
        <Route path="/Drugs" element={<Drugs />}/>
        <Route path="/pharmacies" element={<PharmacyList />}/>
        <Route path="/PharmacyPage" element={<PharmacyPage />}/>
      </Routes>
    </Router>
  );
}

export default App;
