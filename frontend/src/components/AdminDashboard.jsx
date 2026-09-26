import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function AdminDashboard() {
    const [vehicles, setVehicles] = useState([]);
    const [error, setError] =useState("");
    const navigate = useNavigate();

    useEffect(() =>{
        const token  = localStorage.getItem("token");
        if(!token){
            navigate("/admin/login");
            return;
        }    
            fetch("/api/vehicles")
              .then((res) => res.json())
              .then((data) => setVehicles(data))
              .catch(() => setError("Failed to load vehicles"));
        }, [navigate]);

        const handleDelete = async (id) =>{
            const confirmDelete = window.confirm("Delete this vehicle?");
            if(!confirmDelete) return;

            const token = localStorage.getItem("token");

            try {
                const res =  await fetch(`/api/vehicles/${id}`, {
                    method: "DELETE",
                    headers: {Authorization : `Bearer ${token}`}
                });
                if(!res.ok){
                    setError("Failed to delete vehicles");
                    return;
                }
                setVehicles(vehicles.filter((v) => v.id !== id));
            }
                catch(err){
                    setError("Something went wrong while deleting");
                }
            };
            const handleLogout = () => {
                localStorage.removeItem("token");
                localStorage.removeItem("role");
                navigate("/admin/login");
            };

            return (
                <div className="admin-dashboard">
                    <div style={{display: "flex", justifyContent: "space-between", alignItems:"center"}} >
                    <h2>Admin Dashboard</h2>
                    <button onClick={handleLogout}>Log Out</button>
                    <button onClick={() => navigate("/admin/add")}>Add new vehicle</button>
                    </div>
                    {error && <p className="error-text">{error}</p>}

                    <table border="1" cellPadding="8" style={{width: "100%", borderCollapse:"collapse", marginTop:"16px"}}>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Summary</th>
                                <th>Make</th>
                                <th>Model</th>
                                <th>Price</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {vehicles.map((v) => (
                                <tr key={v.id}>
                                    <td>{v.id}</td>
                                    <td>{v.summary}</td>
                                    <td>{v.make}</td>
                                    <td>{v.model}</td>
                                    <td>{v.price}</td>
                                    <td>
                                        <button onClick={() => navigate(`/admin/edit/${v.id}`)}>Edit</button>
                                        <button onClick={() => handleDelete(v.id)}>Delete</button>
                                    </td>
                                </tr>
                            ))}

                        </tbody>
                    </table>
                </div>
            );
    }
export default AdminDashboard;