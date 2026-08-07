import { useState } from "react";
import { dummyCars } from "./data/dummyCars";
import CarCard from "./components/CarCard";
import "./App.css";

function App() {
  const [filters, setFilters] = useState({
    make: "",
    fuelType: "",
    bodyType: "",
    gearboxType: "",
  });

  const filteredCars = dummyCars.filter(car =>
    (filters.make === "" || car.make === filters.make) &&
    (filters.fuelType === "" || car.fuelType === filters.fuelType) &&
    (filters.bodyType === "" || car.bodyType === filters.bodyType) &&
    (filters.gearboxType === "" || car.gearboxType === filters.gearboxType)
  );

  return (
    <div>
      <div className="filters">
        {<div className="filters">
          <select value={filters.make} onChange={(e) => setFilters({ ...filters, make: e.target.value })}>
            <option value="">All Makes</option>
            <option value="Honda">Honda</option>
            <option value="Audi">Audi</option>
            <option value="Hyundai">Hyundai</option>
            <option value="Toyota">Toyota</option>
            <option value="BMW">BMW</option>
            <option value="Mercedes-Benz">Mercedes-Benz</option>
          </select>

          <select value={filters.fuelType} onChange={(e) => setFilters({ ...filters, fuelType: e.target.value })}>
            <option value="">All Fuel Types</option>
            <option value="Petrol">Petrol</option>
            <option value="Diesel">Diesel</option>
            <option value="Electric">Electric</option>
            <option value="Hybrid">Hybrid</option>
            <option value="Other">Other</option>
          </select>

          <select value={filters.bodyType} onChange={(e) => setFilters({ ...filters, bodyType: e.target.value })}>
            <option value="">All Body Types</option>
            <option value="Saloon">Saloon</option>
            <option value="Hatchback">Hatchback</option>
            <option value="SUV">SUV</option>
            <option value="MPV">MPV</option>
          </select>

          <select value={filters.gearboxType} onChange={(e) => setFilters({ ...filters, gearboxType: e.target.value })}>
            <option value="">All Gearboxes</option>
            <option value="Automatic">Automatic</option>
            <option value="Manual">Manual</option>
          </select>
        </div>}
      </div>

      <div className="car-grid">
        {filteredCars.map(car => (
          <CarCard key={car.id} car={car} />
        ))}
      </div>
    </div>
  );
}

export default App;