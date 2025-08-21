import './App.css';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from './auth/Login';
import Regiter from './auth/Register';
import HomePage from './pages/HomePage';
import Dashboard from './pages/Dashboard';
import Account from './pages/Account';
import ManageService from './pages/ManageService';

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Regiter />} />
          <Route path="/" element={<HomePage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/accounts" element={<Account />} />
          <Route path="/manage-service" element={<ManageService />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
