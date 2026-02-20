// src/components/QuizSelection.jsx
import React from 'react';

const QuizSelection = ({ quizzes, onSelectQuiz }) => {
  return (
    <section id="quiz" className="section">
      <div className="row mb-4">
        <div className="col-12">
          <h2 className="fw-bold section-title">Vocabulary Quiz</h2>
          <p className="text-muted">
            Choose a quiz to test your vocabulary knowledge
          </p>
        </div>
      </div>

      <div className="row">
        {quizzes.map((quiz) => (
          <div key={quiz.id} className="col-md-6 col-lg-4 mb-4">
            <div className="card h-100 card-hover" style={{ cursor: 'pointer' }}>
              <div className="card-body">
                <div className="d-flex align-items-start mb-3">
                  <div className="flex-grow-1">
                    <h5 className="fw-bold mb-2">{quiz.title}</h5>
                    <p className="text-muted small mb-3">{quiz.description}</p>
                  </div>
                  {quiz.stats && quiz.stats.attempts > 0 && (
                    <div className="badge bg-success">
                      <i className="fas fa-star me-1"></i>
                      Best: {quiz.stats.bestScore}%
                    </div>
                  )}
                </div>
                
                <div className="mb-3">
                  <span className={`badge ${quiz.difficulty === 'COL' ? 'bg-danger' : 'bg-primary'} me-2`}>
                    <i className="fas fa-graduation-cap me-1"></i>
                    {quiz.difficulty}
                  </span>
                  <span className="badge bg-secondary me-2">
                    <i className="fas fa-question-circle me-1"></i>
                    {quiz.questions.length} Qs
                  </span>
                  {quiz.stats?.attempts > 0 && (
                    <span className="badge bg-info">
                      <i className="fas fa-history me-1"></i>
                      {quiz.stats.attempts} attempts
                    </span>
                  )}
                </div>
                
                {quiz.stats?.attempts > 0 && (
                  <div className="progress mb-3" style={{ height: '6px' }}>
                    <div 
                      className="progress-bar bg-success" 
                      style={{ width: `${quiz.stats.avgScore}%` }}
                      title={`Average Score: ${quiz.stats.avgScore}%`}
                    ></div>
                  </div>
                )}
                
                <button
                  className="btn btn-primary w-100 mt-3"
                  onClick={() => onSelectQuiz(quiz.id)}
                >
                  <i className="fas fa-play me-2"></i>
                  {quiz.stats?.attempts > 0 ? 'Retake Quiz' : 'Start Quiz'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <QuizTips />
    </section>
  );
};

const QuizTips = () => (
  <div className="row mt-4">
    <div className="col-12">
      <div className="card">
        <div className="card-header bg-info text-white">
          <h5 className="mb-0">
            <i className="fas fa-lightbulb me-2"></i>Quiz Tips & Features
          </h5>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-md-3 mb-3">
              <div className="text-center p-3">
                <i className="fas fa-brain text-primary fs-1 mb-3"></i>
                <h6>Active Recall</h6>
                <p className="small text-muted">
                  Quiz mode uses active recall, the most effective learning technique.
                </p>
              </div>
            </div>
            <div className="col-md-3 mb-3">
              <div className="text-center p-3">
                <i className="fas fa-chart-line text-success fs-1 mb-3"></i>
                <h6>Progress Tracking</h6>
                <p className="small text-muted">
                  Track your best scores and average performance over time.
                </p>
              </div>
            </div>
            <div className="col-md-3 mb-3">
              <div className="text-center p-3">
                <i className="fas fa-clock text-warning fs-1 mb-3"></i>
                <h6>Timed Mode</h6>
                <p className="small text-muted">
                  Challenge yourself with timed quizzes to improve speed.
                </p>
              </div>
            </div>
            <div className="col-md-3 mb-3">
              <div className="text-center p-3">
                <i className="fas fa-trophy text-danger fs-1 mb-3"></i>
                <h6>Mastery Levels</h6>
                <p className="small text-muted">
                  Track which words you've mastered through repeated practice.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default QuizSelection;