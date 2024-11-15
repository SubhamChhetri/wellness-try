import React from 'react'

interface DatePickerProps {
    value: string
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

const DatePicker: React.FC<DatePickerProps> = ({value, onChange}) => {
    return (
        <input
            type="date"
            value={value}
            onChange={onChange}
            className="border border-gray-300 rounded-lg px-3 py-2 w-full"
        />
    )
}

export default DatePicker
