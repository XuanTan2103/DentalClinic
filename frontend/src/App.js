import './App.css';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import NotFound from './pages/NotFound';
import Login from './auth/Login';
import Regiter from './auth/Register';
import HomePage from './pages/HomePage';
import Dashboard from './pages/Dashboard';
import Account from './pages/Account';
import ManageService from './pages/ManageService';
import Messenger from './pages/Messenger';
import ChangePassword from './auth/ChangePassword';
import ChangePasswordFirstLogin from './auth/ChangePasswordFirstLogin';
import Profile from './pages/Profile';
import About from './pages/About';
import ForgotPassword from './pages/ForgotPassword';
import DentistWorkingTime from './pages/DentistWorkingTime';
import Appointment from './pages/Appointment';
import ManageMedicine from './pages/ManageMedicine';

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Regiter />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/accounts" element={<Account />} />
          <Route path="/manage-service" element={<ManageService />} />
          <Route path="/messenger" element={<Messenger />} />
          <Route path="/change-password" element={<ChangePassword />} />
          <Route path="/change-pasword-first-login" element={<ChangePasswordFirstLogin />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/about" element={<About />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/dentist-working-time" element={<DentistWorkingTime />} />
          <Route path="/appointment" element={<Appointment />} />
          <Route path="/manage-medicine" element={<ManageMedicine />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
