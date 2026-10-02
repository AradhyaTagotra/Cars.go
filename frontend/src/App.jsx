import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import CarListPage from "./components/CarListPage";
import CarDetailsPage from "./components/CarDetailsPage";
import "./App.css";
import LoginPage from "./components/LoginPage";
import AdminDashboard from "./components/AdminDashboard";
import EditVehicle from "./components/EditVehicle";
import AddVehicle from "./components/AddVehicle";
import CreateAdmin from "./components/CreateAdmin";


function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/admin/login" replace />;
}

function App() {
  return (
    <BrowserRouter>
      <nav className="navbar">
        <div className="navbar-logo">Car Finder</div>
        <div className="navbar-links">
          <a href="/">Browse Cars</a>
          <a href="/admin/login">Admin Login</a>
        </div>
      </nav>
      <Routes>
        <Route path="/" element={<CarListPage />} />
        <Route path="/car/:id" element={<CarDetailsPage />} />
        <Route path="/admin/login" element={<LoginPage />} />
        <Route path="/admin/dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/edit/:id" element={<ProtectedRoute><EditVehicle /></ProtectedRoute>} />
        <Route path="/admin/add" element={<ProtectedRoute><AddVehicle /></ProtectedRoute>} />
        <Route path="/admin/create-admin" element={<ProtectedRoute><CreateAdmin /></ProtectedRoute>} />
      </Routes>
      <footer className="site-footer">
        <p>&copy; 2026 CarFinder. All rights reserved.</p>
      </footer>
    </BrowserRouter>
  );
}

export default App;