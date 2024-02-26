'use client'
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { questions } from '@/types/questions'; // Asegúrate de que la ruta de importación sea correcta
import { profileMessages } from '@/types/profileMessages'; // Asegúrate de que la ruta de importación sea correcta

export default function Test() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [scores, setScores] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(false);
  const [resultMessage, setResultMessage] = useState<string | null>(null);

  const handleAnswer = (points: Record<string, number>) => {
    setScores((currentScores) => {
      const updatedScores = { ...currentScores };
      Object.keys(points).forEach((profile) => {
        updatedScores[profile] = (updatedScores[profile] || 0) + points[profile];
      });
      return updatedScores;
    });

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setLoading(true);
      setTimeout(() => {
        calculateAndShowResults(scores);
      }, 1000); // Simula un tiempo de carga
    }
  };

  const goBackToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const calculateAndShowResults = (finalScores: Record<string, number>) => {
    const sortedProfiles = Object.keys(finalScores).sort((a, b) => finalScores[b] - finalScores[a]);
    const dominantProfile = sortedProfiles[0];
    const message = profileMessages[dominantProfile];
    setResultMessage(message);
    setLoading(false);
  };

  const questionAnimation = {
    hidden: { x: -200, opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { duration: 0.2 } },
    exit: { x: 200, opacity: 0, transition: { duration: 0.2 } },
  };

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex justify-center items-center max-h-[100dvh]"
      >
        Procesando tu resultado...
      </motion.div>
    );
  }

  if (resultMessage) {
    return (
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="flex flex-col justify-center items-center max-h-[100dvh] p-4"
      >
        <p className="text-lg">{resultMessage}</p>
      </motion.div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center max-h-[100dvh] p-4">
      <AnimatePresence mode='wait'>
        <motion.div
          key={currentQuestionIndex}
          variants={questionAnimation}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="w-full max-w-xl"
        >
          <h2 className="text-2xl font-bold mb-6">{questions[currentQuestionIndex].questionText}</h2>
          {questions[currentQuestionIndex].options.map((option, index) => (
            <motion.button
              key={index}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="text-white border border-amber-500 hover:bg-amber-500 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 w-full"
              onClick={() => handleAnswer(option.points)}
            >
              {option.text}
            </motion.button>
          ))}
          {currentQuestionIndex > 0 && (
            <button
              className="mt-4 bg-amber-500 hover:bg-amber-700 text-white font-bold py-2 px-4 rounded"
              onClick={goBackToPreviousQuestion}
            >
              Volver a la pregunta anterior
            </button>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
