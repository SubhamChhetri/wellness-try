import React, { useState } from "react";
import Image from "next/image";
import ProgressBar from "./ProgressBar"; // Import ProgressBar component
import MoodSelector from "./MoodSelector"; // Import MoodSelector component

interface QuestionnaireProps {
    questions: { questionText: string; image: string }[]; // Array of questions with associated images
    currentQuestionIndex: number;
    onNext: () => void;
    onBack: () => void; // Add back function prop
    selectedMood: string | null;
    onMoodSelect: (mood: string) => void;
    answers: { id: number; mood: string }[]; // Array of answers (emojis)
    isFirstQuestion: boolean; // Track if it is the first question
}

const Questionnaire: React.FC<QuestionnaireProps> = ({
    questions,
    currentQuestionIndex,
    onNext,
    onBack,
    selectedMood,
    onMoodSelect,
    isFirstQuestion,
}) => {
    const [highlightMood, setHighlightMood] = useState(false); // Track if moods should be highlighted

    const handleNext = () => {
        if (!selectedMood) {
            setHighlightMood(true); // Highlight if no mood is selected
            // Remove highlight after a short duration
            setTimeout(() => setHighlightMood(false), 100); // 1 second duration
        } else {
            onNext(); // Proceed to the next question
        }
    };

    const handleMoodSelect = (mood: string) => {
        onMoodSelect(mood);
        setHighlightMood(false); // Remove highlight immediately when an emoji is selected
    };

    return (
        <div className="flex-col mt-32 space-y-10">
            {/* Display current question's image and text */}
            <div>
                <div className="rounded-lg mb-4 flex items-center justify-center mx-auto">
                    <Image
                        src={questions[currentQuestionIndex]?.image || "/placeholder.png"} // Dynamic image based on the question
                        alt={questions[currentQuestionIndex]?.questionText}
                        width={160}
                        height={160}

                    />
                </div>
                <h2 className="text-lg font-semibold mb-4 text-center text-gray-800 mx-16">
                    {questions[currentQuestionIndex]?.questionText} {/* Dynamic question text */}
                </h2>
            </div>

            {/* Mood selector for user to select their mood */}
            <MoodSelector
                selectedMood={selectedMood}
                onMoodSelect={handleMoodSelect} // Use handleMoodSelect
                highlightBorder={highlightMood} // Highlight only if no mood is selected
            />

            {/* Progress bar for question navigation */}
            <ProgressBar
                currentStep={currentQuestionIndex}
                totalSteps={questions.length}
            />

            {/* Buttons for navigation */}
            <div className="flex justify-between">
                {!isFirstQuestion && (
                    <button
                        onClick={onBack}
                        className="w-1/3 bg-gray-300 text-black py-3 rounded-full text-md font-semibold"
                    >
                        Back
                    </button>
                )}
                <button
                    onClick={handleNext} // Use handleNext for navigation
                    className="w-1/3 bg-primary text-white py-3 rounded-full text-md font-semibold"
                >
                    {currentQuestionIndex < questions.length - 1 ? "Next" : "Finish"}
                </button>
            </div>
        </div>
    );
};

export default Questionnaire;
