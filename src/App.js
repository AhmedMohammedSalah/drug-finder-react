import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/homePage';
import DefaultLayout from './components/layout/default-layout';   
import Pharmaciestlayout from './components/layout/pharmaciest-layout';
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

        <Route path="/pharmacy" element={<Pharmaciestlayout />}>
          <Route path="/pharmacy/drugs" element={<Drugs />}/>
          <Route path="/pharmacy/orders" element={<Orders />}/>
        </Route>
        
      </Routes>
    </Router>
  );
}

export default App;
