// src/components/QuizResults.jsx
import React, { useState } from 'react';

const QuizResults = ({
  quiz,
  score,
  percentage,
  performance,
  answers,
  timeSpent,
  onRetake,
  onBack,
  onSelectAnother
}) => {
  const [showAllAnswers, setShowAllAnswers] = useState(false);
  const [filter, setFilter] = useState('all'); // 'all', 'correct', 'incorrect'
  
  const filteredAnswers = answers.filter(answer => {
    if (filter === 'correct') return answer.isCorrect;
    if (filter === 'incorrect') return !answer.isCorrect;
    return true;
  });

  const displayAnswers = showAllAnswers ? filteredAnswers : filteredAnswers.slice(0, 5);

  const getTimeString = (seconds) => {
    if (seconds < 60) return `${seconds} seconds`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  const saveToMastered = () => {
    const masteredWords = answers
      .filter(answer => answer.isCorrect && answer.word)
      .map(answer => answer.word);
    
    localStorage.setItem('mastered_words', JSON.stringify([
      ...JSON.parse(localStorage.getItem('mastered_words') || '[]'),
      ...masteredWords
    ]));
    
    alert(`${masteredWords.length} words added to mastered list!`);
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
            Back to Quiz Selection
          </button>
          <h2 className="fw-bold section-title">Quiz Results</h2>
          <p className="text-muted">{quiz.title}</p>
        </div>
      </div>

      {/* Performance Summary */}
      <div className="row mb-4">
        <div className="col-md-8 mx-auto">
          <div className={`card border-${performance.color} shadow-lg`}>
            <div className={`card-header bg-${performance.color} text-white text-center py-4`}>
              <h1 className="mb-3">{performance.emoji}</h1>
              <h2 className="mb-2">{performance.message}</h2>
              <div className="display-2 fw-bold">{percentage}%</div>
              <p className="mb-0 fs-5">
                You got {score} out of {quiz.questions.length} questions correct
              </p>
              {timeSpent > 0 && (
                <p className="mb-0 mt-2">
                  <i className="fas fa-clock me-1"></i>
                  Time: {getTimeString(timeSpent)}
                </p>
              )}
            </div>
            <div className="card-body">
              <div className="row text-center">
                <div className="col-md-4 mb-3">
                  <div className="p-3">
                    <div className="fs-1 fw-bold text-primary">{score}</div>
                    <div className="text-muted">Correct Answers</div>
                  </div>
                </div>
                <div className="col-md-4 mb-3">
                  <div className="p-3">
                    <div className="fs-1 fw-bold text-danger">{quiz.questions.length - score}</div>
                    <div className="text-muted">Incorrect Answers</div>
                  </div>
                </div>
                <div className="col-md-4 mb-3">
                  <div className="p-3">
                    <div className="fs-1 fw-bold text-success">{percentage}%</div>
                    <div className="text-muted">Accuracy Rate</div>
                  </div>
                </div>
              </div>
              
              <div className="d-flex justify-content-center gap-3 flex-wrap">
                <button
                  className="btn btn-primary px-4 py-3"
                  onClick={onRetake}
                >
                  <i className="fas fa-redo me-2"></i>
                  Retake Quiz
                </button>
                <button
                  className="btn btn-outline-primary px-4 py-3"
                  onClick={onSelectAnother}
                >
                  <i className="fas fa-list me-2"></i>
                  Choose Another Quiz
                </button>
                {percentage >= 70 && (
                  <button
                    className="btn btn-success px-4 py-3"
                    onClick={saveToMastered}
                  >
                    <i className="fas fa-star me-2"></i>
                    Save to Mastered
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Results */}
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5 className="mb-0">
                <i className="fas fa-clipboard-check me-2"></i>
                Detailed Results
              </h5>
              <div className="d-flex gap-2">
                <div className="btn-group btn-group-sm">
                  <button
                    className={`btn ${filter === 'all' ? 'btn-primary' : 'btn-outline-primary'}`}
                    onClick={() => setFilter('all')}
                  >
                    All ({answers.length})
                  </button>
                  <button
                    className={`btn ${filter === 'correct' ? 'btn-success' : 'btn-outline-success'}`}
                    onClick={() => setFilter('correct')}
                  >
                    Correct ({answers.filter(a => a.isCorrect).length})
                  </button>
                  <button
                    className={`btn ${filter === 'incorrect' ? 'btn-danger' : 'btn-outline-danger'}`}
                    onClick={() => setFilter('incorrect')}
                  >
                    Incorrect ({answers.filter(a => !a.isCorrect).length})
                  </button>
                </div>
                <button
                  className="btn btn-sm btn-outline-info"
                  onClick={() => setShowAllAnswers(!showAllAnswers)}
                >
                  {showAllAnswers ? 'Show Less' : 'Show All'}
                </button>
              </div>
            </div>
            <div className="card-body">
              {displayAnswers.length === 0 ? (
                <div className="text-center py-5">
                  <i className="fas fa-filter text-muted fs-1 mb-3"></i>
                  <p className="text-muted">No answers match the selected filter</p>
                </div>
              ) : (
                <div className="row">
                  {displayAnswers.map((answer, index) => (
                    <div key={index} className="col-md-6 mb-3">
                      <div 
                        className={`p-3 h-100 rounded border-start border-5 ${
                          answer.isCorrect 
                            ? 'border-success bg-success bg-opacity-10' 
                            : 'border-danger bg-danger bg-opacity-10'
                        }`}
                      >
                        <div className="d-flex align-items-start justify-content-between">
                          <div className="flex-grow-1">
                            <div className="d-flex align-items-center mb-2">
                              <span className="badge bg-dark me-2">Q{index + 1}</span>
                              <h6 className="fw-bold mb-0 text-truncate">
                                {answer.word || 'Vocabulary Word'}
                              </h6>
                              <span className="badge bg-secondary ms-2">
                                {answer.isCorrect ? 'Correct' : 'Incorrect'}
                              </span>
                            </div>
                            <p className="mb-2 text-dark">{answer.question}</p>
                            <div className="mb-2">
                              <strong className={answer.isCorrect ? 'text-success' : 'text-danger'}>
                                Your answer:
                              </strong> 
                              <span className="ms-2">{answer.selectedAnswer}</span>
                            </div>
                            {!answer.isCorrect && (
                              <div className="mt-2">
                                <strong className="text-success">Correct answer:</strong> 
                                <span className="ms-2">{answer.correctAnswer}</span>
                              </div>
                            )}
                            {answer.timeSpent && (
                              <div className="mt-2 small text-muted">
                                <i className="fas fa-clock me-1"></i>
                                Time spent: {Math.round(answer.timeSpent / 1000)}s
                              </div>
                            )}
                          </div>
                          <div className="ms-3">
                            {answer.isCorrect ? (
                              <i className="fas fa-check-circle text-success fs-3"></i>
                            ) : (
                              <i className="fas fa-times-circle text-danger fs-3"></i>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {!showAllAnswers && filteredAnswers.length > 5 && (
                <div className="text-center mt-3">
                  <button
                    className="btn btn-outline-primary"
                    onClick={() => setShowAllAnswers(true)}
                  >
                    <i className="fas fa-chevron-down me-2"></i>
                    Show All {filteredAnswers.length} Answers
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Improvement Tips */}
      {percentage < 70 && (
        <div className="row mt-4">
          <div className="col-12">
            <div className="card border-warning">
              <div className="card-header bg-warning text-dark">
                <h5 className="mb-0">
                  <i className="fas fa-exclamation-triangle me-2"></i>
                  Areas for Improvement
                </h5>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-4 mb-3">
                    <div className="text-center p-3">
                      <i className="fas fa-book text-primary fs-1 mb-3"></i>
                      <h6>Review Vocabulary</h6>
                      <p className="small text-muted">
                        Study the words you missed in the vocabulary list
                      </p>
                    </div>
                  </div>
                  <div className="col-md-4 mb-3">
                    <div className="text-center p-3">
                      <i className="fas fa-redo text-success fs-1 mb-3"></i>
                      <h6>Retake Quiz</h6>
                      <p className="small text-muted">
                        Practice with the same questions to reinforce learning
                      </p>
                    </div>
                  </div>
                  <div className="col-md-4 mb-3">
                    <div className="text-center p-3">
                      <i className="fas fa-question-circle text-info fs-1 mb-3"></i>
                      <h6>Try Other Quizzes</h6>
                      <p className="small text-muted">
                        Different question formats can help understanding
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default QuizResults;