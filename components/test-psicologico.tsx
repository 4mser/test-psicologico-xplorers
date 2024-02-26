'use client'
// pages/test.tsx
import { useState } from 'react';
import { motion } from 'framer-motion';
import { questions } from '@/types/questions'; // Asegúrate de que la ruta de importación sea correcta
import { profileMessages } from '@/types/profileMessages'; // Asegúrate de que la ruta de importación sea correcta

export default function Test() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [scores, setScores] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(false);
  const [resultMessage, setResultMessage] = useState<string | null>(null);

  const handleAnswer = (points: Record<string, number>) => {
    const updatedScores = { ...scores };
    Object.keys(points).forEach((profile) => {
      if (!updatedScores[profile]) {
        updatedScores[profile] = 0;
      }
      updatedScores[profile] += points[profile];
    });
    setScores(updatedScores);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setLoading(true);
      setTimeout(() => {
        calculateAndShowResults(updatedScores);
      }, 1000); // Simula un tiempo de carga
    }
  };

  const calculateAndShowResults = (finalScores: Record<string, number>) => {
    const sortedProfiles = Object.keys(finalScores).sort((a, b) => finalScores[b] - finalScores[a]);
    const dominantProfile = sortedProfiles[0];
    const message = profileMessages[dominantProfile];
    setResultMessage(message);
    setLoading(false);
  };

  if (loading) {
    return <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex justify-center items-center max-h-[100dvh]"
            >
              Procesando tu resultado...
            </motion.div>;
  }

  if (resultMessage) {
    return <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              className="flex flex-col justify-center items-center max-max-h-[100dvh] p-4"
            >
              <p className="text-lg">{resultMessage}</p>
            </motion.div>;
  }

  return (
    <div className="flex flex-col items-center justify-center max-h-[100dvh] p-4">
      <motion.div
        initial={{ opacity: 0, x: -100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-xl"
      >
        <h2 className="text-2xl font-bold mb-6">{questions[currentQuestionIndex].questionText}</h2>
        {questions[currentQuestionIndex].options.map((option, index) => (
          <motion.button
            key={index}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="text-white bg-blue-500 hover:bg-blue-700 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 w-full"
            onClick={() => handleAnswer(option.points)}
          >
            {option.text}
          </motion.button>
        ))}
      </motion.div>
    </div>
  );
}
