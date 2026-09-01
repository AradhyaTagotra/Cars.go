import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import ImageGallery from "./ImageGallery";
import "./CarDetailsPage.css";

function CarDetailsPage() {
  const { id } = useParams();
  const [car, setCar] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:5000/api/vehicles`)
      .then(res => res.json())
      .then(data => {
        const found = data.find(c => c.id === Number(id));
        setCar(found);
      });
  }, [id]);

  if (!car) return <p>Loading...</p>;

  return (
    <div className="details-page">
      <Link to="/" className="details-back-link">&larr; Back to listings</Link>
     <ImageGallery images={car.images}/>
      <h2 className="details-title">{car.make} {car.model} ({car.first_registration_year})</h2>
      <p className="details-price">£{Number(car.price).toLocaleString()}</p>
      <p className="details-meta">{car.mileage.toLocaleString()} miles · {car.fuel_type} · {car.gearbox_type}</p>
      <p className="details-meta">{car.no_of_doors} doors · {car.no_of_seats} seats</p>
      <p className="details-summary">{car.summary}</p>
    </div>
  );
}

export default CarDetailsPage;