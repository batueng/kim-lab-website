// src/components/File.js
import React, { useRef, useState } from "react";
import styles from '../styles/Home.module.css';
import Cell from './cell.js';

function File({ fileData }) {
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
    return (
        <div id="image-container" className={styles.imageContainer}>
            <img
                src={imageURL}
                alt="file"
                ref={imageRef}
                onLoad={handleImageLoad}
                className={styles.image}
            />
            <div className={styles.overlay}>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
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