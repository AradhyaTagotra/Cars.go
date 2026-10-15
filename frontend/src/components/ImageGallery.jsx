import { useState } from "react";

function ImageGallery({images, vehicleId, isAdmin, onChange}) {
    const[current, setCurrent] =useState(0);

    if(!images || images.length === 0){
        return <img src="https://placehold.co/600x400" alt="No image available" className="details-image" />;
    }

    const handleDelete = async () =>{
        if(!window.confirm("Delete this image permanently?")) return;
        const imageId = images[current].id;

        try{
            const res = await fetch(`/api/vehicles/${vehicleId}/image/${imageId}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}`},
            });
            const data = await res.json();
            if(!res.ok) throw new  Error(data.error || "Delete failed");
            setCurrent(0);
            onChange();
        }catch (err){
            alert(err.message);
        }
    };

    return (
         <div className="gallery">
            <img src={images[current].imagepath} alt="car" className="details-image"/>
            {isAdmin && <button onClick={handleDelete}>Delete this image</button>}
            <div className="gallery-thumbnails">
                {images.map((img, i) => (
                    <img 
                     key={img.id}
                     src={img.imagepath}
                     onClick={() => setCurrent(i)}
                     className={i === current? "thumb thumb-active" : "thumb"}
                     />
                ))}
            </div>
         </div>
    );
}

export default ImageGallery;