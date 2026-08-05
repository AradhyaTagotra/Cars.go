import { dummyCars } from "./data/dummyCars";
import CarCard from "./components/CarCard";
import "./components/CarCard.css";
import "./App.css";
import { useState } from "react";

function App() {
  const [query, setQuery] = useState("");
  const [filteredCars, setFilteredCars] = useState(dummyCars);

  const handleSearch = () => {
    const results = dummyCars.filter(car =>
      car.make.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredCars(results);
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Search by make"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button onClick={handleSearch}>Search</button>
      
      <div className="car-grid">
        {dummyCars.map(car => (
          <CarCard key={car.id} car={car} />
        ))}

      </div>
    </div>

  );
}

export default App;