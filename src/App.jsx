import { dummyCars } from "./data/dummyCars";
import CarCard from "./components/CarCard";
import "./components/CarCard.css";

function App() {
  const car = dummyCars[0];
  return (
  //   <div>
  //     <h1>Car Listings</h1>
  //     {dummyCars.map(car => (
  // <p key={car.id}>{car.make} {car.mileage} {car.battery} ({car.year}) - £{car.price}</p>
  //   ))}
  //   </div>
  
    <CarCard car={car}/>
  );
}

export default App;