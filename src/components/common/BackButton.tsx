import {useRouter} from 'next/router'
import React from 'react'

const BackButton: React.FC = () => {
    const router = useRouter()
    return (
        <button onClick={() => router.back()} className="text-blue-500 font-bold">
            ← Back
        </button>
    )
}

export default BackButton
