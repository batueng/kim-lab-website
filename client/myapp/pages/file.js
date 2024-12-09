import React, { useRef, useState } from "react";
import styles from '../styles/Home.module.css';
import Cell from './cell.js';

function File({ fileData, index }) {
    const imageRef = useRef(null);
    const [boundingRect, setBoundingRect] = useState({ left: 0, top: 0 });
    const [cellToggle, setCellToggle] = useState(false);
    const [cells, setCells] = useState(fileData.results); // Initialize state with results

    const handleImageLoad = () => {
        if (imageRef.current) {
            const rect = imageRef.current.getBoundingClientRect();
            setBoundingRect({ left: rect.left, top: rect.top });
        }
    };

    const imageURL = `http://127.0.0.1:8000/api/v1/files/${fileData.id}`;
    const imageContainerStyle = {
        width: "640px",
        height: "640px",
        verticalAlign: "center",
        backgroundImage: `url(${imageURL})`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center center'
    }

    const handleClick = () => {
        setCellToggle(!cellToggle);
    };

    // Function to delete a cell by id
    const deleteCell = (id) => {
        setCells((prevCells) => prevCells.filter(cell => cell.id !== id));
    };

    return (
        <div>
            <u><h2>{fileData.filename}</h2></u>
            <p>
                Inner diameter average: {fileData.inner_average}<br />
                Outer diameter average: {fileData.outer_average}<br />
                Ratio average: {fileData.ratio_average}
            </p>

            <div style={{
                display: "flex",
                width: "100%",
                height: "100%",
                justifyContent: "center",
                alignItems: "center"
            }}>
                <button onClick={handleClick}>Toggle</button>
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
                        {cellToggle ? (
                            <>
                                {cells.map((result, index) => (
                                    <Cell
                                        key={index}
                                        cellData={result}
                                        x={boundingRect.left}
                                        y={boundingRect.top}
                                        deleteCell={deleteCell} // Pass deleteCell function
                                    />
                                ))}
                            </>
                        ) : null}
                    </svg>
                </div>
            </div>
        </div>
    );
}

export default File;
