import { useParams, Link } from "react-router-dom";
import { dummyCars } from "../data/dummyCars";

function CarDetailsPage() {
    const {id} =useParams();
    const car = dummyCars.find(c => c.id ===Number(id));

    if(!car) return <p>Car not found</p>;

    return(
        <div>
            <Link to="/">&larr; Back to listings</Link>
            <img src={car.images[0].path} alt={`${car.make} ${car.model}`}/>
            <h2>{car.make} {car.model} ({car.firstRegistrationYear})</h2>
            <p>£{car.price.toLocaleString()}</p>
            <p>{car.mileage.toLocaleString()} miles {car.fuelType} {car.gearboxType}</p>
            <p>{car.noOfDoors} doors {car.noOfSeats} seats</p>
            <p>{car.summary}</p>
        </div>
    );
}

export default CarDetailsPage;