import { dummyCars } from "./data/dummyCars";
import CarCard from "./components/CarCard";
import "./components/CarCard.css";
import "./App.css";

function App() {
  const car = dummyCars[0];
  return (
    //   <div>
    //     <h1>Car Listings</h1>
    //     {dummyCars.map(car => (
    // <p key={car.id}>{car.make} {car.mileage} {car.battery} ({car.year}) - £{car.price}</p>
    //   ))}
    //   </div>
    <div className="car-grid">
      {dummyCars.map(car => (
        <CarCard key={car.id} car={car}/>
      ))}
       
    </div>
  );
}

export default App;