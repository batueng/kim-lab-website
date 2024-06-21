// src/components/File.js
import React, { useRef, useState } from "react";
import styles from '../styles/Home.module.css';
import Cell from './cell.js';

function File({ fileData, index}) {
    const imageRef = useRef(null);
    const [boundingRect, setBoundingRect] = useState({ left: 0, top: 0 });

    const handleImageLoad = () => {
        if (imageRef.current) {
            const rect = imageRef.current.getBoundingClientRect();
            setBoundingRect({ left: rect.left, top: rect.top });
        }
    };

    const imageURL = `http://127.0.0.1:8000/api/v1/files/${fileData.id}`;
    const results = fileData.results;
    const imageContainerStyle = {
        width: "640px",
        height: "640px", /* Full height for demonstration, adjust as needed */
        verticalAlign: "center",
        backgroundImage: `url(${imageURL})`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center center'
    }
    return (
        <div style={{
            display: "flex",
            width: "100%",
            height: "100%", /* Full height for demonstration, adjust as needed */
            justifyContent: "center",
            alignItems: "center"
        }}>
            <div id="image-container" style={imageContainerStyle} ref={imageRef} onLoad={handleImageLoad}>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    style={{
                        justifyContent: "center",
                        alignItems: "center",
                        width: '100%',
                        height: '100%',
                        pointerEvents: 'visible'
                    }}
                >
                    {results.map((result, index) => (
                        <Cell key={index} cellData={result} x={boundingRect.left} y={boundingRect.top} />
                    ))}
                </svg>
            </div>
        </div>
    );
}

export default File;