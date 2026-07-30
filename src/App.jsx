import { dummyCars } from "./data/dummyCars";

function App() {
  const car = dummyCars[0];
  return (
    <div>
      <h1>Car Listings</h1>
      {dummyCars.map(car => (
  <p key={car.id}>{car.make} {car.mileage} {car.battery} ({car.year}) - £{car.price}</p>
    ))}
    </div>
  );
}

export default App;