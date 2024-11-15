"use client";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Questionnaire from "@/app/(Screens)/[category]/survey/[set]/components/Questionnaire";

interface Questions {
    id: number,
    questionText: string,
    questionType: string,
    image: string; // Include the image property
}

// Define the Answer interface
interface Answer {
    id: number;
    mood: string;
}
const Set: React.FC<{ params: { set: string, category: string } }> = ({ params }) => {
    const { set, category } = params; // Get the dynamic route parameter
    const [questions, setQuestions] = useState<Questions[]>([]);
    const [, setLoading] = useState(true); // Loading state

    const backgroundImageStyle = {
        backgroundImage: 'url(/bg.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height: '100vh',
        width: '100%',
    };

    const router = useRouter();
    const [selectedMood, setSelectedMood] = useState<string | null>(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);

    const [answers, setAnswers] = useState<Answer[]>([]); // Initialize answers with the Answer type

    useEffect(() => {
        // Only fetch data if category is defined
        if (set) {
            const fetchData = async () => {
                try {
                    const response = await fetch(`/api/surveys/question/${set}`); // Adjust endpoint as needed
                    const result = await response.json();
                    setQuestions(result); // Set fetched data to state
                } catch (error) {
                    console.error('Error fetching data:', error);
                } finally {
                    setLoading(false); // Set loading to false
                }
            };

            fetchData();
        }
    }, [set]); // Dependency array to re-fetch data when category changes

    // Load answers from local storage when the component mounts
    useEffect(() => {
        const storedAnswers = localStorage.getItem('surveyAnswers');
        if (storedAnswers) {
            setAnswers(JSON.parse(storedAnswers));
        }
    }, []);

    // Save answers to local storage whenever they change
    useEffect(() => {
        localStorage.setItem('surveyAnswers', JSON.stringify(answers));
    }, [answers]);

    const handleMoodSelect = (mood: string) => {
        setSelectedMood(mood);
    };

    const handleNextQuestion = () => {
        if (questions.length === 0) return; // Guard clause for empty questions array

        const currentQuestionId = questions[currentQuestionIndex]?.id; // Use optional chaining

        if (currentQuestionId === undefined) return; // Guard clause for undefined id

        // Update the answers array
        const updatedAnswers = answers.filter(answer => answer.id !== currentQuestionId); // Remove previous answer if it exists
        updatedAnswers.push({ id: currentQuestionId, mood: selectedMood || "" }); // Add the current answer

        setAnswers(updatedAnswers); // Update state with new answers

        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
            // Load mood for the next question
            const nextQuestionMood = updatedAnswers.find(answer => answer.id === questions[currentQuestionIndex + 1]?.id)?.mood || null;
            setSelectedMood(nextQuestionMood);
        } else {
            handleCompleteQuestionnaire(updatedAnswers);
        }
    };


    const handleBackQuestion = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex((prevIndex) => prevIndex - 1);
            const previousQuestionId = questions[currentQuestionIndex - 1].id;
            // Load mood for the previous question
            const previousMood = answers.find(answer => answer.id === previousQuestionId)?.mood || null;
            setSelectedMood(previousMood);
        }
    };

    const handleCompleteQuestionnaire = async (updatedAnswers: Answer[]) => {
        try {
            const response = await fetch('/api/surveys/answers/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ answers: updatedAnswers }),
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }

            const data = await response.json();
            console.log(data.message); // Log success message

            // Here you can reset or navigate as needed
            router.back()
            // Reset or redirect logic can go here
        } catch (error) {
            console.error("Failed to submit answers:", error);
            // Optionally, handle the error with user feedback
        }
    };

    return (
        <div style={backgroundImageStyle} className="p-6">
            <div>
                <Link href="" onClick={() => router.back()}>
                    <button className="p-1 bg-primary rounded-md ">
                        <ChevronLeft className="w-8 h-8 text-white" />
                    </button>
                </Link>
            </div>

            <h1 className="text-2xl font-extrabold mb-8 text-gray-800 text-center">
                {category}
            </h1>

            <Questionnaire
                questions={questions}
                currentQuestionIndex={currentQuestionIndex}
                onNext={handleNextQuestion}
                onBack={handleBackQuestion}
                selectedMood={selectedMood}
                onMoodSelect={handleMoodSelect}
                answers={answers} // Pass down answers to the Questionnaire
                isFirstQuestion={currentQuestionIndex === 0} // Track if it is the first question
            />
        </div>
    );
};

export default Set;
