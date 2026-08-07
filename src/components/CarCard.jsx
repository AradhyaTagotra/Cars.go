import "./CarCard.css";
function CarCard({ car }) {
    return (
        <div className="car-card">
            <img src={car.images[0].path} alt={`${car.make} ${car.model}`} className="car-image" />
            <div className="car-info">
                <h3 className="car-title">{car.make} {car.model} ({car.firstRegistrationYear})</h3>
                <p className="car-price">£{car.price.toLocaleString()}</p>
                <p className="car-details">
                    {car.mileage.toLocaleString()} km · {car.fuelType} · {car.gearboxType} · {car.noOfDoors} doors · {car.noOfSeats} seats
                </p>
            </div>
        </div>
    );
}
export default CarCard;