import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/homePage';
// import Login from './pages/loginPage';
// import Register from './pages/registerPage';
// import Dashboard from './pages/dashboardPage';
import DefaultLayout from './components/layout/default-layout';
// import IconButton from './components/shared/iconButton';     
import Drugs from './pages/drugPage'

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
      </Routes>
    </Router>
  );
}

export default App;
