import React from 'react'

interface ButtonProps {
    text: string;
    onClick: () => Promise<void>;
    className?: string; // Optional
    disabled?: boolean; // Add this line
}


const Button: React.FC<ButtonProps> = ({ text, onClick, className }) => {
    return (
        <button
            onClick={onClick}
            className={` text-white block py-2 px-4 rounded ${className}`}
        >
            {text}
        </button>
    )
}

export default Button
