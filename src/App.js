import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Drugs from './pages/drugPage'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<div>Home Page</div>} exact/>
        <Route path="/login" element={<div>Login Page</div>} exact/>
        <Route path="/register" element={<div>Register Page</div>} exact/>
        <Route path="/dashboard" element={<div>Dashboard Page</div>} exact/>
        <Route path="/Drugs" element={Drugs} exact/>
      </Routes>
    </Router>
  );
}

export default App;
