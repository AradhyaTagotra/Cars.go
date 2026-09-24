import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

function EditVehicle() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
        fetch(`/api/vehicles/${id}`)
            .then((res) => res.json())
            .then((data) => setFormData(data))
            .catch(() => setError("Failed to load vehicle"));
    }, [id]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        const token = localStorage.getItem("token");

        const updatedFields = {
            summary: formData.summary,
            description: formData.description,
            mileage: formData.mileage,
            price: formData.price,
        };

        try {
            const res = await fetch(`/api/vehicles/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(updatedFields),
            });

            if (!res.ok) {
                setError("Failed to update vehicle");
                return;
            }
            navigate("/admin/dashboard");
        }
        catch (err) {
            setError("Something went wrong while updating");
        }
    };
    if (!formData) return <p>Loading...</p>;

    return (
        <div className="edit-vehicle">
            <h2>Edit Vehicle</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Summary</label>
                    <input name="summary" value={formData.summary || ""} onChange={handleChange} />
                </div>
                <div>
                    <label>Description</label>
                    <input name="description" value={formData.description || ""} onChange={handleChange} />
                </div>
                <div>
                    <label>Mileage</label>
                    <input name="mileage" value={formData.mileage || ""} onChange={handleChange} />
                </div>
                <div>
                    <label>Price</label>
                    <input name="price" value={formData.price || ""} onChange={handleChange} />
                </div>
                {error && <p className="error-text">{error}</p>}
                <button type="submit">Save Changes</button>
            </form>
        </div>
    );
}

export default EditVehicle;