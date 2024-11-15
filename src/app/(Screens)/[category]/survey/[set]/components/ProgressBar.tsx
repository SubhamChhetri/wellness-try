import React from "react";

interface ProgressBarProps {
    currentStep: number;
    totalSteps: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ currentStep, totalSteps }) => {
    return (
        <div className="flex justify-center space-x-2 mb-4">
            {Array(totalSteps).fill(null).map((_, index) => (
                <div
                    key={index}
                    className={`h-2 rounded-full ${
                        index <= currentStep ? "bg-primary w-8" : "bg-gray-300 w-4"
                    }`}
                />
            ))}
        </div>
    );
};

export default ProgressBar;
