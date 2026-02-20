// src/components/QuizPreview.jsx
import React from 'react';

const QuizPreview = ({ quiz, selectedMode, onStartQuiz, onBack, onSelectMode }) => {
  const getStats = (quizId) => {
    const attempts = localStorage.getItem(`quiz_${quizId}_attempts`) || 0;
    const bestScore = localStorage.getItem(`quiz_${quizId}_best`) || 0;
    const avgScore = localStorage.getItem(`quiz_${quizId}_avg`) || 0;
    return { attempts, bestScore, avgScore };
  };

  const stats = getStats(quiz.id);

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
          <h2 className="fw-bold section-title">{quiz.title}</h2>
          <p className="text-muted">{quiz.description}</p>
        </div>
      </div>

      <div className="row">
        <div className="col-md-6 mb-4">
          <div className="card h-100">
            <div className="card-header py-3">
              <h5 className="mb-0">
                <i className="fas fa-info-circle me-2"></i>
                Quiz Information
              </h5>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <strong>Difficulty Level:</strong>
                <span className={`badge ${quiz.difficulty === 'COL' ? 'bg-danger' : 'bg-primary'} ms-2`}>
                  {quiz.difficulty}
                </span>
              </div>
              <div className="mb-3">
                <strong>Number of Questions:</strong>
                <span className="ms-2">{quiz.questions.length}</span>
              </div>
              {stats.attempts > 0 && (
                <>
                  <div className="mb-3">
                    <strong>Your Best Score:</strong>
                    <span className="badge bg-success ms-2">{stats.bestScore}%</span>
                  </div>
                  <div className="mb-3">
                    <strong>Average Score:</strong>
                    <span className="badge bg-info ms-2">{stats.avgScore}%</span>
                  </div>
                  <div className="mb-4">
                    <strong>Attempts:</strong>
                    <span className="ms-2">{stats.attempts}</span>
                  </div>
                </>
              )}
              
              <div className="mb-4">
                <strong>Select Quiz Mode:</strong>
                <div className="d-flex gap-2 mt-2">
                  <button
                    className={`btn ${selectedMode === 'normal' ? 'btn-primary' : 'btn-outline-primary'} flex-grow-1`}
                    onClick={() => onSelectMode('normal')}
                  >
                    <i className="fas fa-book me-2"></i>
                    Normal
                  </button>
                  <button
                    className={`btn ${selectedMode === 'timed' ? 'btn-warning' : 'btn-outline-warning'} flex-grow-1`}
                    onClick={() => onSelectMode('timed')}
                  >
                    <i className="fas fa-clock me-2"></i>
                    Timed (10 min)
                  </button>
                  <button
                    className={`btn ${selectedMode === 'mastery' ? 'btn-success' : 'btn-outline-success'} flex-grow-1`}
                    onClick={() => onSelectMode('mastery')}
                  >
                    <i className="fas fa-trophy me-2"></i>
                    Mastery
                  </button>
                </div>
              </div>
              
              <button
                className="btn btn-primary w-100 py-3 fw-bold"
                onClick={onStartQuiz}
              >
                <i className="fas fa-play me-2"></i>
                {selectedMode === 'timed' ? 'Start Timed Quiz' : 
                 selectedMode === 'mastery' ? 'Start Mastery Challenge' : 
                 'Start Quiz Now'}
              </button>
            </div>
          </div>
        </div>

        <div className="col-md-6 mb-4">
          <div className="card h-100">
            <div className="card-header py-3">
              <h5 className="mb-0">
                <i className="fas fa-clipboard-list me-2"></i>
                Instructions & Features
              </h5>
            </div>
            <div className="card-body">
              <div className="mb-4">
                <h6>Current Mode: <span className="badge bg-primary">{selectedMode.toUpperCase()}</span></h6>
                {selectedMode === 'timed' && (
                  <div className="alert alert-warning">
                    <i className="fas fa-exclamation-triangle me-2"></i>
                    <strong>Timed Mode:</strong> Complete all questions within 10 minutes. Each question has no individual time limit.
                  </div>
                )}
                {selectedMode === 'mastery' && (
                  <div className="alert alert-success">
                    <i className="fas fa-trophy me-2"></i>
                    <strong>Mastery Mode:</strong> Get 90% or higher to mark words as mastered. Track your mastery progress.
                  </div>
                )}
              </div>
              
              <ul className="list-unstyled">
                <li className="mb-3">
                  <i className="fas fa-check text-success me-2"></i>
                  Read each question carefully before answering
                </li>
                <li className="mb-3">
                  <i className="fas fa-check text-success me-2"></i>
                  Select the best answer from the options provided
                </li>
                <li className="mb-3">
                  <i className="fas fa-check text-success me-2"></i>
                  Instant feedback after each answer
                </li>
                <li className="mb-3">
                  <i className="fas fa-check text-success me-2"></i>
                  Track your progress and improvement over time
                </li>
                <li className="mb-3">
                  <i className="fas fa-check text-success me-2"></i>
                  Review detailed explanations for each answer
                </li>
              </ul>
              
              <div className="alert alert-info mt-4">
                <i className="fas fa-lightbulb me-2"></i>
                <div>
                  <strong>Pro Tip:</strong> Take your time and think through each answer. 
                  The goal is learning, not just completing the quiz!
                  {selectedMode === 'timed' && ' In timed mode, balance speed with accuracy.'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default QuizPreview;