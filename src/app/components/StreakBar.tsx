import React from 'react';

interface StreakBarProps {
    streaks: string[];
}

const StreakBar: React.FC<StreakBarProps> = ({ streaks }) => {
    return (
        <div className="flex justify-center gap-2">
            {streaks.slice(0, 8).map((color, index) => {
                const isHexColor = color.startsWith('#');
                const className = `w-6 h-6 rounded-md border-2 ${!isHexColor ? color : ''}`;

                return (
                    <div
                        key={index}
                        className={className}
                        style={isHexColor ? { backgroundColor: color } : undefined}
                    ></div>
                );
            })}
        </div>
    );
};

export default StreakBar;
