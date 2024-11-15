import React from 'react'

interface ModalProps {
    isOpen: boolean
    onClose: () => void
    children: React.ReactNode
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null

    const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
        // Close the modal if the overlay is clicked
        if (e.currentTarget === e.target) {
            onClose();
        }
    };

    return (
        <div 
            className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center"
            onClick={handleOverlayClick} // Add this to close modal on overlay click
        >
            <div className="bg-white p-6 rounded-2xl shadow-lg max-w-md w-5/6">
                {children}
            </div>
        </div>
    )
}

export default Modal;
