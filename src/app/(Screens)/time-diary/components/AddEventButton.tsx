import React from 'react'

interface AddEventButtonProps {
    onClick: () => void
}

const AddEventButton: React.FC<AddEventButtonProps> = ({onClick}) => {
    return (

        <button className="bg-primary text-white px-6 py-2 rounded-full items-center flex  space-x-3"
                onClick={onClick}>
        
            <span className='text-xl'>+</span>
            <span className='font-semibold'>Add Event</span>

        </button>
    )
}

export default AddEventButton
