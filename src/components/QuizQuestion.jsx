// src/components/QuizQuestion.jsx
import React, { useEffect, useState } from 'react';

const QuizQuestion = ({
  quiz,
  question,
  questionIndex,
  totalQuestions,
  progress,
  score,
  selectedAnswer,
  timeLeft,
  isTimedMode,
  onAnswerSelect,
  onNextQuestion,
  onBack
}) => {
  const [showHint, setShowHint] = useState(false);
  
  const getTimeDisplay = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <section id="quiz" className="section">
      <div className="row mb-4">
        <div className="col-12">
          <button 
            className="btn btn-outline-secondary mb-3"
            onClick={onBack}
          >
            <i className="fas fa-arrow-left me-2"></i>
            Exit Quiz
          </button>
          <h2 className="fw-bold section-title">{quiz.title}</h2>
          <div className="d-flex align-items-center justify-content-between flex-wrap gap-3 mb-3">
            <p className="text-muted mb-0">
              Question {questionIndex + 1} of {totalQuestions}
            </p>
            <div className="d-flex gap-3 align-items-center">
              {isTimedMode && timeLeft !== null && (
                <div className={`badge ${timeLeft < 60 ? 'bg-danger' : 'bg-warning'} px-3 py-2`}>
                  <i className="fas fa-clock me-2"></i>
                  {getTimeDisplay(timeLeft)}
                </div>
              )}
              <span className="badge bg-primary px-3 py-2">
                <i className="fas fa-star me-2"></i>
                Score: {score}/{questionIndex}
              </span>
            </div>
          </div>
          <div className="progress mt-2" style={{ height: '8px' }}>
            <div 
              className="progress-bar bg-primary"
              role="progressbar"
              style={{ width: `${progress}%` }}
              aria-valuenow={progress}
              aria-valuemin="0"
              aria-valuemax="100"
            ></div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-lg-8 mx-auto">
          <div className="card shadow-lg">
            <div className="card-body p-4 p-md-5">
              {/* Question Header */}
              <div className="mb-4">
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <div>
                    <span className="badge bg-secondary mb-2">
                      {question.partOfSpeech || question.part_of_speech || 'Vocabulary'}
                    </span>
                    {question.questionType && (
                      <span className="badge bg-info ms-2">
                        {question.questionType.replace('-', ' ')}
                      </span>
                    )}
                  </div>
                  <button
                    className="btn btn-sm btn-outline-info"
                    onClick={() => setShowHint(!showHint)}
                    disabled={selectedAnswer !== null}
                  >
                    <i className="fas fa-lightbulb me-1"></i>
                    Hint
                  </button>
                </div>
                
                {showHint && !selectedAnswer && (
                  <div className="alert alert-info mb-3">
                    <i className="fas fa-info-circle me-2"></i>
                    <strong>Hint:</strong> {question.word} is a {question.partOfSpeech || question.part_of_speech}. 
                    Think about its most common usage in context.
                  </div>
                )}
                
                <h3 className="fw-bold mb-4">{question.question}</h3>
                
                {question.word && (
                  <div className="mb-3">
                    <span className="text-muted">Vocabulary Word:</span>
                    <span className="badge bg-dark ms-2 fs-6">{question.word}</span>
                  </div>
                )}
              </div>

              {/* Answer Options */}
              <div className="d-grid gap-3 mb-4">
                {question.options.map((option, index) => {
                  let optionClass = 'quiz-option';
                  let isSelected = selectedAnswer === option;
                  let isCorrect = option === question.correctAnswer;
                  
                  if (selectedAnswer !== null) {
                    if (isCorrect) {
                      optionClass += ' correct';
                    } else if (isSelected) {
                      optionClass += ' incorrect';
                    }
                  } else if (isSelected) {
                    optionClass += ' selected';
                  }
                  
                  return (
                    <div
                      key={index}
                      className={optionClass}
                      onClick={() => selectedAnswer === null && onAnswerSelect(option)}
                      style={{ 
                        cursor: selectedAnswer !== null ? 'default' : 'pointer',
                        opacity: selectedAnswer !== null && !isCorrect && !isSelected ? 0.6 : 1
                      }}
                    >
                      <div className="d-flex align-items-center w-100">
                        <span className="badge bg-primary rounded-circle me-3 d-flex align-items-center justify-content-center"
                          style={{ width: '40px', height: '40px', minWidth: '40px' }}>
                          {String.fromCharCode(65 + index)}
                        </span>
                        <span className="flex-grow-1 fs-5">{option}</span>
                        {selectedAnswer !== null && isCorrect && (
                          <i className="fas fa-check-circle text-success fs-3 ms-2"></i>
                        )}
                        {selectedAnswer !== null && isSelected && !isCorrect && (
                          <i className="fas fa-times-circle text-danger fs-3 ms-2"></i>
                        )}
                        {selectedAnswer === null && (
                          <i className="fas fa-chevron-right text-muted ms-2"></i>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Feedback and Navigation */}
              <div className="mt-4 d-flex justify-content-between align-items-center">
                <div style={{ flex: 1 }}>
                  {selectedAnswer !== null && (
                    <div className={`alert ${selectedAnswer === question.correctAnswer ? 'alert-success' : 'alert-danger'} mb-0`}>
                      <div className="d-flex align-items-center">
                        <i className={`fas ${selectedAnswer === question.correctAnswer ? 'fa-check-circle' : 'fa-times-circle'} me-2 fs-4`}></i>
                        <div>
                          <strong>
                            {selectedAnswer === question.correctAnswer ? 'Correct!' : 'Incorrect!'}
                          </strong>
                          {selectedAnswer !== question.correctAnswer && (
                            <div className="mt-1">
                              The correct answer is: <strong className="text-success">{question.correctAnswer}</strong>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                <button
                  className="btn btn-primary px-4 py-2 ms-3"
                  onClick={onNextQuestion}
                  disabled={selectedAnswer === null}
                  style={{ minWidth: '180px' }}
                >
                  {questionIndex < totalQuestions - 1 ? (
                    <>
                      Next Question <i className="fas fa-arrow-right ms-2"></i>
                    </>
                  ) : (
                    <>
                      View Results <i className="fas fa-chart-bar ms-2"></i>
                    </>
                  )}
                </button>
              </div>

              {/* Question Progress */}
              {selectedAnswer !== null && questionIndex < totalQuestions - 1 && (
                <div className="mt-4 text-center">
                  <small className="text-muted">
                    Next question in <span className="countdown">3</span> seconds...
                  </small>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Side Panel for Additional Info */}
      <div className="row mt-4">
        <div className="col-12">
          <div className="card">
            <div className="card-body py-3">
              <div className="row">
                <div className="col-md-4 text-center">
                  <div className="mb-2">
                    <span className="badge bg-success fs-6 px-3 py-2">
                      Accuracy: {questionIndex > 0 ? Math.round((score / questionIndex) * 100) : 0}%
                    </span>
                  </div>
                  <small className="text-muted">Current Accuracy</small>
                </div>
                <div className="col-md-4 text-center">
                  <div className="mb-2">
                    <span className="badge bg-info fs-6 px-3 py-2">
                      {totalQuestions - questionIndex - 1} Remaining
                    </span>
                  </div>
                  <small className="text-muted">Questions Left</small>
                </div>
                <div className="col-md-4 text-center">
                  <div className="mb-2">
                    <span className="badge bg-warning fs-6 px-3 py-2">
                      {Math.round(progress)}% Complete
                    </span>
                  </div>
                  <small className="text-muted">Quiz Progress</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default QuizQuestion;