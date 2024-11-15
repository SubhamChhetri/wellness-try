// ScoreCard.tsx
import React from 'react';

interface ScoreCardProps {
    score: number | undefined;
    label: string;
}

const ScoreCard: React.FC<ScoreCardProps> = ({ score = 0, label }) => {
    return (
        <div className="flex flex-col items-start border-r border-gray-300 pr-4 last:border-r-0">
            <p className="text-xl font-bold text-primary">{score}</p>
            <p className="text-xs text-gray-500">{label}</p>
        </div>
    );
};

interface ScoreCardContainerProps {
    eventCount: number;
    moodCount: number;
    surveyCompleted: number | undefined;
}


const ScoreCardContainer: React.FC<ScoreCardContainerProps> = ({ eventCount, moodCount, surveyCompleted }) => {
    return (
        <div className="grid grid-cols-3 gap-4 text-left my-4">
            <ScoreCard score={surveyCompleted ?? 0} label={"Surveys Completed"} />
            <ScoreCard score={eventCount} label={"Time Diary Streak"} />
            <ScoreCard score={moodCount} label={"Emotion Log Streak"} />
        </div>
    );
};


export default ScoreCardContainer;
