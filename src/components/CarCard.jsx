import "./CarCard.css";
function CarCard({car}){
    return(
        <div className="car-card">
         <img src={car.image} alt={`${car.make}`} className="car-image" />
         <div className="car-info">
            <h3 className="car-title">{car.make} ({car.year})</h3>
            <p className="car-price">£{car.price.toLocaleString()}</p>
            <p className="car-details">{car.mileage.toLocaleString()} km · {car.battery} · {car.doors} doors · {car.seats} seats</p>
         </div>
        </div>
    );  
}
export default CarCard;