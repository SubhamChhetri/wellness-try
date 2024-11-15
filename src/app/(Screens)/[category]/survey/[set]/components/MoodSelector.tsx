import React from "react";

interface MoodSelectorProps {
    selectedMood: string | null;
    onMoodSelect: (mood: string) => void;
    highlightBorder?: boolean; // Prop to indicate border highlight
}

const moods = ["Happy", "Sad", "Okay"];

const MoodSelector: React.FC<MoodSelectorProps> = ({
    selectedMood,
    onMoodSelect,
    highlightBorder,
}) => {
    return (
        <div className="grid grid-cols-3 gap-5 mb-8 px-10">
            {moods.map((mood) => (
                <button
                    key={mood}
                    onClick={() => onMoodSelect(mood)}
                    className={`bg-white/40 rounded-lg p-4 flex flex-col items-center transition-all duration-200 ease-in-out ${selectedMood === mood ? "ring-4 ring-primary" : highlightBorder ? "ring-4 ring-red-500" : ""
                        }`}
                >
                    <span className="text-4xl mb-2">
                        {mood === "Happy" ? "😇" : mood === "Sad" ? "😔" : "😌"}
                    </span>
                    <span className="text-gray-800 font-semibold text-sm">{mood}</span>
                </button>
            ))}
        </div>
    );
};

export default MoodSelector;
