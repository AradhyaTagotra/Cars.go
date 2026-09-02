import { BrowserRouter, Routes, Route  } from "react-router-dom";
import CarListPage from "./components/CarListPage";
import CarDetailsPage from "./components/CarDetailsPage";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
    <nav className="navbar">
      <div className="navbar-logo">Car Finder</div>
      <div className="navbar-links">
        <a href="/">Browse Cars</a>
        <a href="/admin">Admin Login</a>
      </div>
    </nav>
    <Routes>
      <Route path="/" element={<CarListPage/>}/>
      <Route path="/car/:id" element={<CarDetailsPage/>}/>
    </Routes>
    <footer className="site-footer">
     <p>&copy; 2026 CarFinder. All rights reserved.</p>
    </footer>
    </BrowserRouter>
  );
}

export default App;