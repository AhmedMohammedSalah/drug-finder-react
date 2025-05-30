import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/homePage';
import DefaultLayout from './components/layout/default-layout';   
import Drugs from './pages/drugPage';
import Orders from './pages/ordersPage';

function App() {
  return (
    <Router>
      <Routes>
        {/* [AMS] this is default layout for guest / client */}
        <Route path="/" element={<DefaultLayout />}>
          {/*[AMS] any route here will have auto header and footer */}
          <Route path="" element={<Home />} />
        </Route>
        <Route path="/drugs" element={<Drugs />}/>
        <Route path="/orders" element={<Orders />}/>
      </Routes>
    </Router>
  );
}

export default App;
