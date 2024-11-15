import React from 'react'

interface InputFieldProps {
    label: string
    type: string
    value: string
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    className?: string  // Add className as an optional prop
}

const InputField: React.FC<InputFieldProps> = ({ label, type, value, onChange, className }) => {
    return (
        <div className={` ${className}`}>
            <label className="block text-xs font-light text-[#89A6CD] ">
                {label}
            </label>
            <input
                type={type}
                value={value}
                onChange={onChange}
                className="block w-full border border-[#89A6CD] rounded-lg px-3 py-2"
            />
        </div>
    )
}

export default InputField
