import { useState } from "react";

function ImageGallery({images}) {
    const[current, setCurrent] =useState(0);

    if(!images || images.length === 0){
        return <img src="https://placehold.co/600x400" alt="No image available" className="details-image" />;
    }

    return (
         <div className="gallery">
            <img src={images[current].imagepath} alt="car" className="details-image"/>
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