import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import ImageGallery from "./ImageGallery";
import "./CarDetailsPage.css";

function CarDetailsPage() {
  const { id } = useParams();
  const [car, setCar] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  const loadCar = () => {
    fetch(`/api/vehicles`)
      .then(res => res.json())
      .then(data => {
        const found = data.find(c => c.id === Number(id));
        setCar(found);
      });
  };

  useEffect(() => {
    loadCar();
  }, [id]);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if(!file) return;

    const formData = new FormData();
    formData.append("image", file);

    setUploading(true);
    setMessage("");

    try{
      const res = await fetch(`/api/vehicles/${id}/image`, {
        method: "POST",
        headers: {Authorization : `Bearer ${localStorage.getItem("token")}`},
        body: formData,
      });
      const data = await res.json();
      if(!res.ok) throw new Error(data.error || "Upload failed");
      setMessage("Image uploaded successfully");
      loadCar();
    }catch (err){
      setMessage(err.message);
    }finally{
      setUploading(false);
      e.target.value = "";
    }
  };

  if (!car) return <p>Loading...</p>;

  return (
    <div className="details-page">
      <div className="breadcrumbs">
        <Link to="/">Home</Link> / <span>{car.make} {car.model}</span>
      </div>
      <Link to="/" className="details-back-link">&larr; Back to listings</Link>
     <ImageGallery images={car.images}/>
     <input type="file" accept="image/*" onChange={handleUpload} disabled={uploading}/>
     {message && <p>{message}</p>}
      <h2 className="details-title">{car.make} {car.model} ({car.first_registration_year})</h2>
      <p className="details-price">£{Number(car.price).toLocaleString()}</p>
      <p className="details-meta">{car.mileage.toLocaleString()} miles · {car.fuel_type} · {car.gearbox_type}</p>
      <p className="details-meta">{car.no_of_doors} doors · {car.no_of_seats} seats</p>
      <p className="details-summary">{car.summary}</p>
    </div>
  );
}

export default CarDetailsPage;