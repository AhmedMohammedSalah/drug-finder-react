import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/homePage';
import Drugs from './pages/drugPage';
import PharmacyList from './pages/pharamcieslist';

// import Login from './pages/loginPage';
// import Register from './pages/registerPage';
// import Dashboard from './pages/dashboardPage';
// import Drugs from './pages/drugPage'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />}/>
        {/* <Route path="/login" element={Login}/> */}
        {/* <Route path="/register" element={Register}/> */}
        {/* <Route path="/dashboard" element={Dashboard}/> */}
        <Route path="/Drugs" element={<Drugs />}/>
        <Route path="/pharmacies" element={<PharmacyList />}/>
      </Routes>
    </Router>
  );
}

export default App;
