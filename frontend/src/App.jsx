import { BrowserRouter, Routes, Route  } from "react-router-dom";
import CarListPage from "./components/CarListPage";
import CarDetailsPage from "./components/CarDetailsPage";
import "./App.css";
import LoginPage from "./components/LoginPage";
import AdminDashboard from "./components/AdminDashboard";

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
      <Route path="/" element={<CarListPage/>}/>
      <Route path="/car/:id" element={<CarDetailsPage/>}/>
      <Route path="/admin/login" element={<LoginPage/>}/>
      <Route path="/admin/dashboard" element={<AdminDashboard/>}/>
    </Routes>
    <footer className="site-footer">
     <p>&copy; 2026 CarFinder. All rights reserved.</p>
    </footer>
    </BrowserRouter>
  );
}

export default App;