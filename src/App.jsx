import { dummyCars } from "./data/dummyCars";
import CarCard from "./components/CarCard";
import "./components/CarCard.css";
import "./App.css";

function App() {
  const car = dummyCars[0];
  return (
    <div className="car-grid">
      {dummyCars.map(car => (
        <CarCard key={car.id} car={car}/>
      ))}
       
    </div>
  );
}

export default App;