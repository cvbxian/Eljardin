import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import PrivateRoute from "./components/PrivateRoute";
import Home from "./pages/Home";
import Bookings from "./pages/Bookings";
import Menu from "./pages/Menu";
import Drinks from "./pages/Drinks";
import Cafe from "./pages/Cafe";
import Chefs from "./pages/Chefs";
import Login from "./pages/Login";
import Signup from "./components/Auth/SignupNew";
import Guests from "./pages/GuestsNew";
import Orders from "./pages/OrdersNew";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes - no Layout wrapper */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        
        {/* Protected routes with Layout wrapper */}
        <Route element={<PrivateRoute />}>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/bookings" element={<Bookings />} />
            <Route path="/menu" element={<Menu />} />
            <Route path="/drinks" element={<Drinks />} />
            <Route path="/cafe" element={<Cafe />} />
            <Route path="/chefs" element={<Chefs />} />
            <Route path="/guests" element={<Guests />} />
            <Route path="/orders" element={<Orders />} />
          </Route>
        </Route>
        
        {/* Redirect any unknown route to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;