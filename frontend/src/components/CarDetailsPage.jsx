import "./CarDetailsPage.css";
import { useParams, Link } from "react-router-dom";
import { dummyCars } from "../data/dummyCars";

function CarDetailsPage() {
  const { id } = useParams();
  const car = dummyCars.find(c => c.id === Number(id));

  if (!car) return <p>Car not found</p>;

  return (
    <div className="details-page">
      <Link to="/" className="details-back-link">&larr; Back to listings</Link>
      <img src={car.images[0].path} alt={`${car.make} ${car.model}`} className="details-image" />
      <h2 className="details-title">{car.make} {car.model} ({car.firstRegistrationYear})</h2>
      <p className="details-price">£{car.price.toLocaleString()}</p>
      <p className="details-meta">{car.mileage.toLocaleString()} miles · {car.fuelType} · {car.gearboxType}</p>
      <p className="details-meta">{car.noOfDoors} doors · {car.noOfSeats} seats</p>
      <p className="details-summary">{car.summary}</p>
    </div>
  );
}

export default CarDetailsPage;