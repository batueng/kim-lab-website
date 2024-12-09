import React, { useState } from "react";
import Modal from "react-modal";

// Set the app element for accessibility
Modal.setAppElement('#root');

function Cell({ cellData, x, y, deleteCell }) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const formatPoints = (points) => {
        return points.map(point => `${point[0] + x},${point[1] + y}`).join(' ');
    };

    const calculateCenter = (points) => {
        const totalPoints = points.length;
        const sum = points.reduce(
            (acc, point) => {
                acc.x += point[0];
                acc.y += point[1];
                return acc;
            },
            { x: 0, y: 0 }
        );
        return { x: sum.x / totalPoints + x, y: sum.y / totalPoints + y };
    };

    const handlePolygonClick = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const handleDeleteCell = () => {
        deleteCell(cellData.id);
        closeModal();
    };

    const innerPoints = formatPoints(cellData.inner);
    const outerPoints = formatPoints(cellData.outer);

    const center = calculateCenter(cellData.outer);

    return (
        <>
            <svg>
                <polygon
                    points={outerPoints}
                    style={{ fill: 'darkred', stroke: 'black', strokeWidth: 2 }}
                    onClick={handlePolygonClick}
                />
                <polygon
                    points={innerPoints}
                    style={{ fill: 'red', stroke: 'black', strokeWidth: 2 }}
                    onClick={handlePolygonClick}
                />
                {/* Add cell ID as a text element */}
                <text
                    x={center.x}
                    y={center.y}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize="12"
                    fill="white"
                    style={{ pointerEvents: 'none' }} // Ensure text doesn't block interactions
                >
                    {cellData.id}
                </text>
            </svg>
            <Modal
                isOpen={isModalOpen}
                onRequestClose={closeModal}
                contentLabel="Cell Details"
                style={{
                    content: {
                        top: '50%',
                        left: '50%',
                        right: 'auto',
                        bottom: 'auto',
                        marginRight: '-50%',
                        transform: 'translate(-50%, -50%)'
                    }
                }}
            >
                <h2>Cell Details</h2>
                <p>Id: {cellData.id}</p>
                <p>Ratio: {cellData.ratio}</p>
                <p>Inner diameter: {cellData.inner_diameter}</p>
                <p>Outer diameter: {cellData.outer_diameter}</p>
                <button onClick={closeModal}>Close</button>
                <button onClick={handleDeleteCell}>Delete Cell</button>
            </Modal>
        </>
    );
}

export default Cell;
