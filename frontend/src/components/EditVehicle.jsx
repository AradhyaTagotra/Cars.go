import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

function EditVehicle() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState(null);
  const [lookups, setLookups] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`/api/vehicles/${id}`)
      .then((res) => res.json())
      .then((data) => setFormData(data))
      .catch(() => setError("Failed to load vehicle"));

    fetch("/api/lookups")
      .then((res) => res.json())
      .then((data) => setLookups(data))
      .catch(() => setError("Failed to load form options"));
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
      make: formData.make_id,
      model: formData.model,
      status: formData.status_id,
      gearbox_type: formData.gearbox_type_id,
      fuel_type: formData.fuel_type_id,
      body_type: formData.body_type_id,
      mileage: formData.mileage,
      price: formData.price,
    };

    try {
      const res = await fetch(`/api/vehicles/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedFields),
      });

      if (!res.ok) {
        setError("Failed to update vehicle");
        return;
      }

      navigate("/admin/dashboard");
    } catch (err) {
      setError("Something went wrong while updating");
    }
  };

  if (!formData || !lookups) return <p>Loading...</p>;

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
          <label>Make</label>
          <select name="make_id" value={formData.make_id || ""} onChange={handleChange} required>
            <option value="">Select make</option>
            {lookups.makes.map((m) => (
              <option key={m.id} value={m.id}>{m.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label>Model</label>
          <input name="model" value={formData.model || ""} onChange={handleChange} />
        </div>
        <div>
          <label>Status</label>
          <select name="status_id" value={formData.status_id || ""} onChange={handleChange} required>
            <option value="">Select status</option>
            {lookups.statuses.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label>Gearbox</label>
          <select name="gearbox_type_id" value={formData.gearbox_type_id || ""} onChange={handleChange} required>
            <option value="">Select gearbox</option>
            {lookups.gearboxTypes.map((g) => (
              <option key={g.id} value={g.id}>{g.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label>Fuel Type</label>
          <select name="fuel_type_id" value={formData.fuel_type_id || ""} onChange={handleChange} required>
            <option value="">Select fuel type</option>
            {lookups.fuelTypes.map((f) => (
              <option key={f.id} value={f.id}>{f.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label>Body Type</label>
          <select name="body_type_id" value={formData.body_type_id || ""} onChange={handleChange} required>
            <option value="">Select body type</option>
            {lookups.bodyTypes.map((b) => (
              <option key={b.id} value={b.id}>{b.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label>Mileage</label>
          <input name="mileage" type="number" value={formData.mileage || ""} onChange={handleChange} />
        </div>
        <div>
          <label>Price</label>
          <input name="price" type="number" value={formData.price || ""} onChange={handleChange} />
        </div>
        {error && <p className="error-text">{error}</p>}
        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
}

export default EditVehicle;