import React from 'react';

/**
 * Clean Card wrapper with subtle smooth hover lift and shadows (no jarring 3D tilt)
 */
export const ThreeDCard = ({
    children,
    className = '',
}) => {
    return (
        <div
            className={`transition-all duration-300 ease-out hover:-translate-y-1.5 hover:shadow-warm-md ${className}`}
        >
            {children}
        </div>
    );
};

export default ThreeDCard;
