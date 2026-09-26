import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function AddVehicle() {
    const navigate = useNavigate();
    const [lookups, setLookups] = useState();
    const [error, setError] = useState("");
    const [formData, setFormData] = useState({
        summary: "",
        description: "",
        make: "",
        model: "",
        status: "",
        gearbox_type: "",
        fuel_type: "",
        body_type: "",
        mileage: "",
        price: "",
        no_of_seats: "",
        no_of_doors: "",
        first_registration_year: "",
    });

    useEffect(() => {
        fetch("/api/lookups")
            .then((res) => res.json())
            .then((data) => setLookups(data))
            .catch(() => setError("Failed to load form options"));
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        const token = localStorage.getItem("token");


        try {
            const res = await fetch("/api/vehicles", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(formData),
            });
            if (!res.ok) {
                setError("Failed to create vehicle");
                return;
            }
            navigate("/admin/dashboard");
        } catch (err) {
            setError("Something went rong while creating the vehicle");
        }
    };
    if (!lookups) return <p>Loading...</p>;

    return (
        <div className="add-vehicle">
            <h2>Add new vehicle</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Summary</label>
                    <input name="summary" value={formData.summary} onChange={handleChange} required />
                </div>
                <div>
                    <label>Description</label>
                    <input name="description" value={formData.description} onChange={handleChange} />
                </div>
                <div>
                    <label>Make</label>
                    <select name="make" value={formData.make} onChange={handleChange} required>
                        <option value="">Select make</option>
                        {lookups.makes.map((m) => (
                            <option key={m.id} value={m.id}>{m.name}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label>Model</label>
                    <input name="model" value={formData.model} onChange={handleChange} required />
                </div>
                <div>
                    <label>Status</label>
                    <select name="status" value={formData.status} onChange={handleChange} required>
                        <option value="">Select status</option>
                        {lookups.statuses.map((s) => (
                            <option key={s.id} value={s.id}>{s.name}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label>Gearbox</label>
                    <select name="gearbox_type" value={formData.gearbox_type} onChange={handleChange} required>
                        <option value="">Select gearbox</option>
                        {lookups.gearboxTypes.map((g) => (
                            <option key={g.id} value={g.id}>{g.name}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label>Fuel Type</label>
                    <select name="fuel_type" value={formData.fuel_type} onChange={handleChange} required>
                        <option value="">Select fuel type</option>
                        {lookups.fuelTypes.map((f) => (
                            <option key={f.id} value={f.id}>{f.name}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label>Body Type</label>
                    <select name="body_type" value={formData.body_type} onChange={handleChange} required>
                        <option value="">Select body type</option>
                        {lookups.bodyTypes.map((b) => (
                            <option key={b.id} value={b.id}>{b.name}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label>Mileage</label>
                    <input name="mileage" value={formData.mileage} onChange={handleChange} required/>
                </div>
                <div>
                    <label>Price</label>
                    <input name="price" value={formData.price} onChange={handleChange} required/>
                </div>
                <div>
                    <label>Seats</label>
                    <input name="no_of_seats" value={formData.no_of_seats} onChange={handleChange} required />
                </div>
                <div>
                    <label>Doors</label>
                    <input name="no_of_doors" value={formData.no_of_doors} onChange={handleChange} required />
                </div>
                <div>
                    <label>First Registration Year</label>
                    <input name="first_registration_year" value={formData.first_registration_year} onChange={handleChange} required/>
                </div>
                {error && <p className="error-text">{error}</p>}
                <button type="submit">Add Vehcile</button>
            </form>
        </div>
    );
}
export default AddVehicle;