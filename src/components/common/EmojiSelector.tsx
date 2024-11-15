import React from 'react'

interface EmojiSelectorProps {
    options: string[]
    onSelect: (emoji: string) => void
}

const EmojiSelector: React.FC<EmojiSelectorProps> = ({options, onSelect}) => {
    return (
        <div className="flex space-x-4">
            {options.map((emoji, idx) => (
                <button
                    key={idx}
                    onClick={() => onSelect(emoji)}
                    className="text-4xl"
                >
                    {emoji}
                </button>
            ))}
        </div>
    )
}

export default EmojiSelector
