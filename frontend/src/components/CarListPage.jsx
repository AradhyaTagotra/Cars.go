import { useState, useEffect } from "react";
import CarCard from "./CarCard";
import { Link } from "react-router-dom";

function CarListPage() {
  const [cars, setCars] = useState([]);
  const [filters, setFilters] = useState({
    make: "",
    fuelType: "",
    bodyType: "",
    gearboxType: "",
    minPrice: "",
    maxPrice: "",
    minYear: "",
    maxYear: "",
  });

  useEffect ( () => {
    fetch("http://localhost:5000/api/vehicles")
    .then(res => res.json())
    .then(data => setCars(data))
    .catch(err => console.error("Failed to fetch vehicles:", err));
  }, []);

   const filteredCars = cars.filter(car =>
    (filters.make === "" || car.make === filters.make) &&
    (filters.fuelType === "" || car.fuel_type === filters.fuelType) &&
    (filters.bodyType === "" || car.body_type === filters.bodyType) &&
    (filters.gearboxType === "" || car.gearbox_type === filters.gearboxType) &&
    (filters.minPrice === "" || Number(car.price) >= Number(filters.minPrice)) &&
    (filters.maxPrice === "" || Number(car.price) <= Number(filters.maxPrice)) &&
    (filters.minYear === "" || car.first_registration_year >= Number(filters.minYear)) &&
    (filters.maxYear === "" || car.first_registration_year <= Number(filters.maxYear))
  );


  return (
    <div>
      <header className="site-header">
        <h1>CarFinder</h1>
        <p>Find your next car, quickly and simply</p>
      </header>
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

          <input
            type="number"
            placeholder="Min Price"
            value={filters.minPrice}
            onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
            onWheel={(e) => e.target.blur()}
          />
          <input
            type="number"
            placeholder="Max Price"
            value={filters.maxPrice}
            onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
            onWheel={(e) => e.target.blur()}
          />
          <input
            type="number"
            placeholder="Min Year"
            value={filters.minYear}
            onChange={(e) => setFilters({ ...filters, minYear: e.target.value })}
            onWheel={(e) => e.target.blur()}
          />
          <input
            type="number"
            placeholder="Max Year"
            value={filters.maxYear}
            onChange={(e) => setFilters({ ...filters, maxYear: e.target.value })}
            onWheel={(e) => e.target.blur()}
          />
        </div>}
      </div>

      <div className="car-grid">
        {filteredCars.length === 0 ? (
          <p>No cars match your filters.</p>
        ) : (
          filteredCars.map(car => (
            <Link key={car.id} to={`/car/${car.id}`} style={{ textDecoration: "none", color: "inherit" }}>
              <CarCard car={car} />
            </Link>
        ))
        )}
      </div>
    </div>
  );
}

export default CarListPage;