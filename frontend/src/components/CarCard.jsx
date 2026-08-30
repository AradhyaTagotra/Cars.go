import "./CarCard.css";

function CarCard({ car }) {
    return (
        <div className="car-card">
            {/* <img src={car.image} alt={`${car.make} ${car.model}`} className="car-image" /> */}
            <div className="car-info">
                <h3 className="car-title">{car.make} {car.model} ({car.first_registration_year})</h3>
                <p className="car-price">£{Number(car.price).toLocaleString()}</p>
                <p className="car-details">
                    {car.mileage.toLocaleString()} km · {car.fuel_type} · {car.gearbox_type} · {car.no_of_doors} doors · {car.no_of_seats} seats
                </p>
            </div>
        </div>
    );
}

export default CarCard;