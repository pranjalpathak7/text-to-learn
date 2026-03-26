// client/src/components/blocks/MCQBlock.tsx
import { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import type { MCQ } from '../../types';
import { CheckCircle2, XCircle } from 'lucide-react';

interface Props {
  questions: MCQ[];
}

export default function MCQBlock({ questions }: Props) {
  const { theme } = useTheme();
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showExplanations, setShowExplanations] = useState<Record<number, boolean>>({});

  if (!questions || questions.length === 0) return null;

  const isDark = theme === 'dark';

  const handleSelect = (qIndex: number, optIndex: number) => {
    if (showExplanations[qIndex]) return;
    setSelectedAnswers(prev => ({ ...prev, [qIndex]: optIndex }));
    setShowExplanations(prev => ({ ...prev, [qIndex]: true }));
  };

  return (
    <div className="my-10 space-y-6">
      {/* Changed from <h3> to <div> to escape index.css !important overrides */}
      <div className={`text-2xl font-bold border-b pb-2 ${isDark ? 'text-white border-gray-700' : 'text-gray-900 border-gray-200'}`}>
        Knowledge Check
      </div>

      {questions.map((q, qIndex) => {
        const isAnswered = showExplanations[qIndex];
        const isCorrect = selectedAnswers[qIndex] === q.answerIndex;

        return (
          <div 
            key={qIndex} 
            className={`rounded-xl shadow-sm border p-6 transition-colors ${
              isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            }`}
          >
            {/* Changed from <p> to <div> */}
            <div className={`text-lg font-medium mb-4 ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
              {qIndex + 1}. {q.question}
            </div>

            <div className="space-y-3">
              {q.options.map((opt, oIndex) => {
                const isSelected = selectedAnswers[qIndex] === oIndex;
                const isCorrectOption = oIndex === q.answerIndex;

                let btnClass = "w-full text-left p-4 rounded-lg border transition-all ";

                if (!isAnswered) {
                  btnClass += isDark 
                    ? 'bg-gray-900 border-gray-700 hover:bg-gray-700 text-gray-300' 
                    : 'bg-white border-gray-200 hover:bg-gray-50 text-gray-700';
                } else if (isCorrectOption) {
                  btnClass += isDark
                    ? 'bg-green-900/40 border-green-600 text-green-300 font-medium'
                    : 'bg-green-50 border-green-500 text-green-800 font-medium';
                } else if (isSelected && !isCorrectOption) {
                  btnClass += isDark
                    ? 'bg-red-900/40 border-red-600 text-red-300'
                    : 'bg-red-50 border-red-500 text-red-800';
                } else {
                  btnClass += isDark
                    ? 'bg-gray-900 border-gray-700 text-gray-500 opacity-50'
                    : 'bg-gray-50 border-gray-200 text-gray-400 opacity-50';
                }

                return (
                  <button
                    key={oIndex}
                    onClick={() => handleSelect(qIndex, oIndex)}
                    disabled={isAnswered}
                    className={btnClass}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>

            {isAnswered && (
              <div className={`mt-5 p-4 rounded-lg flex gap-3 border ${
                isCorrect 
                  ? (isDark ? 'bg-green-900/20 border-green-800/50 text-green-300' : 'bg-green-50 border-green-200 text-green-800')
                  : (isDark ? 'bg-red-900/20 border-red-800/50 text-red-300' : 'bg-red-50 border-red-200 text-red-800')
              }`}>
                <div className="mt-0.5">
                  {isCorrect ? <CheckCircle2 className={`w-5 h-5 ${isDark ? 'text-green-400' : 'text-green-500'}`} /> : <XCircle className={`w-5 h-5 ${isDark ? 'text-red-400' : 'text-red-500'}`} />}
                </div>
                <div>
                  {/* Changed from <p> to <div> */}
                  <div className="font-bold mb-1">
                    {isCorrect ? 'Correct!' : 'Incorrect'}
                  </div>
                  <div className="text-sm opacity-90">
                    {q.explanation}
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}