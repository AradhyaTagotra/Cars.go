import { BrowserRouter, Routes, Route  } from "react-router-dom";
import CarListPage from "./components/CarListPage";
import CarDetailsPage from "./components/CarDetailsPage";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<CarListPage/>}/>
      <Route path="/car/:id" element={<CarDetailsPage/>}/>
    </Routes>
    </BrowserRouter>
  );
}

export default App;