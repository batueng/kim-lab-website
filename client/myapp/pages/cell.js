import React, { useState } from "react";
import Modal from "react-modal";

// Set the app element for accessibility
Modal.setAppElement('#root');

function Cell({ cellData, x, y }) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const formatPoints = (points) => {
        return points.map(point => `${point[0] + x},${point[1] + y}`).join(' ');
    };

    const handlePolygonClick = () => {
        console.log(cellData.id);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const innerPoints = formatPoints(cellData.inner);
    const outerPoints = formatPoints(cellData.outer);

    return (
        <>
            <svg>
                <polygon
                    points={outerPoints}
                    style={{ fill: 'darkred', stroke: 'black', strokeWidth: 2 }}
                    onClick={handlePolygonClick} // Attach onClick event handler for outer polygon
                />
                <polygon
                    points={innerPoints}
                    style={{ fill: 'red', stroke: 'black', strokeWidth: 2 }}
                    onClick={handlePolygonClick} // Attach onClick event handler for inner polygon
                />
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
                <p>Ratio: {cellData.ratio}</p>
                <p>Inner diameter: [{cellData.inner_radii[0]}, {cellData.inner_radii[1]}]</p>
                <p>Outer diameter: [{cellData.outer_radii[0]}, {cellData.outer_radii[1]}]</p>
                <button onClick={closeModal}>Close</button>
            </Modal>
        </>
    );
}

export default Cell;

