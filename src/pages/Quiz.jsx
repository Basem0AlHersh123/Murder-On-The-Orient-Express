// src/pages/Quiz.jsx - ENHANCED VERSION
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useVocab } from '../context/VocabContext';
import quizData from '../quiz.json';
import QuizResults from '../components/QuizResults';
import QuizQuestion from '../components/QuizQuestion';
import QuizSelection from '../components/QuizSelection';
import QuizPreview from '../components/QuizPreview';

// Utility functions
const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const shuffleQuestions = (questions) => {
  const shuffledQuestions = shuffleArray(questions);
  return shuffledQuestions.map(question => ({
    ...question,
    options: shuffleArray(question.options),
    id: question.id || Math.random().toString(36).substr(2, 9) // Ensure unique ID
  }));
};

const calculatePerformance = (percentage) => {
  if (percentage >= 90) return { message: 'Outstanding! 🌟', color: 'success', emoji: '🏆' };
  if (percentage >= 70) return { message: 'Great Job! 👏', color: 'primary', emoji: '🎯' };
  if (percentage >= 50) return { message: 'Good Effort! 👍', color: 'info', emoji: '📚' };
  return { message: 'Keep Practicing! 💪', color: 'warning', emoji: '🔥' };
};

const Quiz = () => {
  const { vocabulary, addQuizResult, updateMasteryByResult } = useVocab();
  
  // Quiz state
  const [selectedQuizId, setSelectedQuizId] = useState(null);
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [score, setScore] = useState(0);
  const [shuffledQuestions, setShuffledQuestions] = useState([]);
  const [quizStats, setQuizStats] = useState({
    startTime: null,
    endTime: null,
    timeSpent: 0
  });
  const [timeLeft, setTimeLeft] = useState(null);
  const [isTimedMode, setIsTimedMode] = useState(false);
  const [quizMode, setQuizMode] = useState('normal'); // 'normal', 'timed', 'mastery'

  // Get available quizzes with enhanced data
  const availableQuizzes = useMemo(() => {
    return (quizData.quizzes || []).map(quiz => ({
      ...quiz,
      stats: {
        attempts: localStorage.getItem(`quiz_${quiz.id}_attempts`) || 0,
        bestScore: localStorage.getItem(`quiz_${quiz.id}_best`) || 0,
        avgScore: localStorage.getItem(`quiz_${quiz.id}_avg`) || 0
      }
    }));
  }, []);

  const currentQuiz = useMemo(() => 
    availableQuizzes.find(q => q.id === selectedQuizId),
    [availableQuizzes, selectedQuizId]
  );

  const currentQuestion = useMemo(() => 
    shuffledQuestions[currentQuestionIndex],
    [shuffledQuestions, currentQuestionIndex]
  );

  // Timer effect for timed mode
  useEffect(() => {
    if (!isTimedMode || !quizStarted || quizCompleted) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          handleTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isTimedMode, quizStarted, quizCompleted]);

  // Start timer when quiz starts
  useEffect(() => {
    if (quizStarted && !quizStats.startTime) {
      setQuizStats(prev => ({
        ...prev,
        startTime: Date.now()
      }));
      
      if (quizMode === 'timed') {
        setIsTimedMode(true);
        setTimeLeft(600); // 10 minutes for entire quiz
      }
    }
  }, [quizStarted, quizMode]);

  const handleSelectQuiz = useCallback((quizId) => {
    setSelectedQuizId(quizId);
    setQuizStarted(false);
    setQuizCompleted(false);
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setScore(0);
    setSelectedAnswer(null);
    setShuffledQuestions([]);
    setQuizStats({ startTime: null, endTime: null, timeSpent: 0 });
    setTimeLeft(null);
    setIsTimedMode(false);
    setQuizMode('normal');
  }, []);

  const handleSelectMode = useCallback((mode) => {
    setQuizMode(mode);
  }, []);

  const handleStartQuiz = useCallback(() => {
    if (currentQuiz?.questions) {
      const shuffled = shuffleQuestions(currentQuiz.questions);
      setShuffledQuestions(shuffled);
    }
    
    setQuizStarted(true);
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setScore(0);
    setSelectedAnswer(null);
    setQuizCompleted(false);
    setQuizStats({ startTime: Date.now(), endTime: null, timeSpent: 0 });
  }, [currentQuiz]);

  const handleAnswerSelect = useCallback((answer) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(answer);
  }, [selectedAnswer]);

  const handleNextQuestion = useCallback(() => {
    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
    const newAnswers = [...answers, {
      question: currentQuestion.question,
      word: currentQuestion.word,
      selectedAnswer,
      correctAnswer: currentQuestion.correctAnswer,
      isCorrect,
      timeSpent: Date.now() - (quizStats.startTime || Date.now()) - answers.reduce((acc, a) => acc + (a.timeSpent || 0), 0)
    }];
    
    setAnswers(newAnswers);
    
    if (isCorrect) {
      setScore(prev => prev + 1);
    }
    
    // Update mastery for this word immediately
    if (currentQuestion.word) {
      updateMasteryByResult(currentQuestion.word, isCorrect);
    }

    if (currentQuestionIndex < shuffledQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
    } else {
      handleCompleteQuiz(newAnswers, isCorrect ? score + 1 : score);
    }
  }, [selectedAnswer, currentQuestion, answers, currentQuestionIndex, shuffledQuestions.length, score, quizStats.startTime, updateMasteryByResult]);

  const handleCompleteQuiz = useCallback((finalAnswers, finalScore) => {
    const endTime = Date.now();
    const timeSpent = Math.round((endTime - quizStats.startTime) / 1000);
    const percentage = Math.round((finalScore / shuffledQuestions.length) * 100);
    
    setQuizCompleted(true);
    setQuizStats(prev => ({ ...prev, endTime, timeSpent }));
    
    // Save quiz result to global context
    addQuizResult({
      quizId: selectedQuizId,
      score: finalScore,
      total: shuffledQuestions.length,
      timeSpent,
      answers: finalAnswers
    });
    
    // Also keep local stats for quiz card display
    const attempts = parseInt(localStorage.getItem(`quiz_${selectedQuizId}_attempts`) || 0) + 1;
    const bestScore = Math.max(percentage, parseInt(localStorage.getItem(`quiz_${selectedQuizId}_best`) || 0));
    const totalScore = (parseFloat(localStorage.getItem(`quiz_${selectedQuizId}_total`) || 0) + percentage);
    const avgScore = Math.round(totalScore / attempts);
    
    localStorage.setItem(`quiz_${selectedQuizId}_attempts`, attempts.toString());
    localStorage.setItem(`quiz_${selectedQuizId}_best`, bestScore.toString());
    localStorage.setItem(`quiz_${selectedQuizId}_total`, totalScore.toString());
    localStorage.setItem(`quiz_${selectedQuizId}_avg`, avgScore.toString());
  }, [selectedQuizId, shuffledQuestions.length, quizStats.startTime, addQuizResult]);

  const handleTimeUp = useCallback(() => {
    handleCompleteQuiz(answers, score);
  }, [answers, score, handleCompleteQuiz]);

  const handleRetakeQuiz = useCallback(() => {
    if (currentQuiz?.questions) {
      const shuffled = shuffleQuestions(currentQuiz.questions);
      setShuffledQuestions(shuffled);
    }
    
    setQuizStarted(true);
    setQuizCompleted(false);
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setScore(0);
    setSelectedAnswer(null);
    setQuizStats({ startTime: Date.now(), endTime: null, timeSpent: 0 });
    setTimeLeft(quizMode === 'timed' ? 600 : null);
  }, [currentQuiz, quizMode]);

  const handleBackToSelection = useCallback(() => {
    setSelectedQuizId(null);
    setQuizStarted(false);
    setQuizCompleted(false);
    setQuizMode('normal');
  }, []);

  // Loading state
  if (!vocabulary || vocabulary.length === 0) {
    return (
      <section id="quiz" className="section">
        <div className="text-center py-5">
          <div className="spinner-border text-primary" style={{ width: '3rem', height: '3rem' }} role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading quiz data...</p>
        </div>
      </section>
    );
  }

  // Quiz selection screen
  if (!selectedQuizId) {
    return <QuizSelection 
      quizzes={availableQuizzes}
      onSelectQuiz={handleSelectQuiz}
    />;
  }

  // Quiz completed - Results screen
  if (quizCompleted) {
    const percentage = Math.round((score / currentQuiz.questions.length) * 100);
    const performance = calculatePerformance(percentage);
    
    return (
      <QuizResults
        quiz={currentQuiz}
        score={score}
        percentage={percentage}
        performance={performance}
        answers={answers}
        timeSpent={quizStats.timeSpent}
        onRetake={handleRetakeQuiz}
        onBack={handleBackToSelection}
        onSelectAnother={() => setSelectedQuizId(null)}
      />
    );
  }

  // Quiz in progress
  if (quizStarted && currentQuestion) {
    const progress = ((currentQuestionIndex + 1) / shuffledQuestions.length) * 100;
    
    return (
      <QuizQuestion
        quiz={currentQuiz}
        question={currentQuestion}
        questionIndex={currentQuestionIndex}
        totalQuestions={shuffledQuestions.length}
        progress={progress}
        score={score}
        selectedAnswer={selectedAnswer}
        timeLeft={timeLeft}
        isTimedMode={isTimedMode}
        onAnswerSelect={handleAnswerSelect}
        onNextQuestion={handleNextQuestion}
        onBack={handleBackToSelection}
      />
    );
  }

  // Quiz selected but not started - Preview screen
  return (
    <QuizPreview
      quiz={currentQuiz}
      selectedMode={quizMode}
      onStartQuiz={handleStartQuiz}
      onBack={handleBackToSelection}
      onSelectMode={handleSelectMode}
    />
  );
};

export default Quiz;