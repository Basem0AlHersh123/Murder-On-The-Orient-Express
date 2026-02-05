// src/pages/Quiz.jsx - SIMPLIFIED WORKING VERSION
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useVocab } from '../context/VocabContext';

const Quiz = () => {
  const { vocabulary } = useVocab();
  const [includeBookmarked, setIncludeBookmarked] = useState(true);
  const [includeMastered, setIncludeMastered] = useState(true);
  const [quizLength, setQuizLength] = useState('10');
  const [difficulty, setDifficulty] = useState('all');
  
  const handleStartQuiz = () => {
    alert(`Quiz starting with ${quizLength} questions! (Feature in development)`);
    // We'll implement the actual quiz logic later
  };

  // Return loading state if no vocabulary
  if (!vocabulary || vocabulary.length === 0) {
    return (
      <section id="quiz" className="section">
        <div className="text-center py-5">
          <div className="loading-spinner mx-auto mb-3"></div>
          <p>Loading quiz data...</p>
        </div>
      </section>
    );
  }

  return (
    <section id="quiz" className="section">
      <div className="row mb-4">
        <div className="col-12">
          <h2 className="fw-bold section-title">Vocabulary Quiz</h2>
          <p className="text-muted">
            Test your knowledge with multiple-choice questions.
          </p>
        </div>
      </div>

      <div className="row">
        <div className="col-md-6 mb-4">
          <div className="card h-100">
            <div className="card-header py-3">
              <h5 className="mb-0">Quiz Settings</h5>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <label className="form-label fw-bold">Number of Questions</label>
                <select 
                  className="form-select" 
                  value={quizLength}
                  onChange={(e) => setQuizLength(e.target.value)}
                >
                  <option value="5">5 Questions</option>
                  <option value="10">10 Questions</option>
                  <option value="20">20 Questions</option>
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label fw-bold">Difficulty</label>
                <select 
                  className="form-select" 
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                >
                  <option value="all">All Levels</option>
                  <option value="HS">High School</option>
                  <option value="COL">College</option>
                  <option value="ADV">Advanced</option>
                </select>
              </div>
              <div className="mb-4">
                <div className="form-check form-switch mb-2">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="includeBookmarked"
                    checked={includeBookmarked}
                    onChange={(e) => setIncludeBookmarked(e.target.checked)}
                  />
                  <label className="form-check-label" htmlFor="includeBookmarked">
                    Include Bookmarked
                  </label>
                </div>
                <div className="form-check form-switch">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="includeMastered"
                    checked={includeMastered}
                    onChange={(e) => setIncludeMastered(e.target.checked)}
                  />
                  <label className="form-check-label" htmlFor="includeMastered">
                    Include Mastered
                  </label>
                </div>
              </div>
              <button
                className="btn btn-primary w-100 py-2 fw-bold"
                onClick={handleStartQuiz}
              >
                <i className="fas fa-play me-2"></i>Start New Quiz
              </button>
              <div className="alert alert-info mt-3">
                <i className="fas fa-info-circle me-2"></i>
                <small>Quiz functionality is being implemented. For now, focus on flashcards!</small>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-6 mb-4">
          <div className="card h-100">
            <div className="card-header py-3">
              <h5 className="mb-0">How to Use the Quiz</h5>
            </div>
            <div className="card-body">
              <div className="list-group list-group-flush">
                <div className="list-group-item border-0 px-0">
                  <div className="d-flex align-items-start gap-3">
                    <span className="badge bg-primary rounded-circle p-2">1</span>
                    <div>
                      <h6 className="fw-bold mb-1">Set Your Preferences</h6>
                      <p className="small text-muted mb-0">
                        Choose number of questions, difficulty, and filters
                      </p>
                    </div>
                  </div>
                </div>
                <div className="list-group-item border-0 px-0">
                  <div className="d-flex align-items-start gap-3">
                    <span className="badge bg-primary rounded-circle p-2">2</span>
                    <div>
                      <h6 className="fw-bold mb-1">Start the Quiz</h6>
                      <p className="small text-muted mb-0">
                        Click "Start New Quiz" to begin
                      </p>
                    </div>
                  </div>
                </div>
                <div className="list-group-item border-0 px-0">
                  <div className="d-flex align-items-start gap-3">
                    <span className="badge bg-primary rounded-circle p-2">3</span>
                    <div>
                      <h6 className="fw-bold mb-1">Answer Questions</h6>
                      <p className="small text-muted mb-0">
                        Select the correct definition for each word
                      </p>
                    </div>
                  </div>
                </div>
                <div className="list-group-item border-0 px-0">
                  <div className="d-flex align-items-start gap-3">
                    <span className="badge bg-primary rounded-circle p-2">4</span>
                    <div>
                      <h6 className="fw-bold mb-1">Review Results</h6>
                      <p className="small text-muted mb-0">
                        See your score and track progress
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <Link to="/flashcards" className="btn btn-outline-primary w-100">
                  <i className="fas fa-layer-group me-2"></i>
                  Practice with Flashcards First
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row mt-4">
        <div className="col-12">
          <div className="card">
            <div className="card-header bg-info text-white">
              <h5 className="mb-0">
                <i className="fas fa-lightbulb me-2"></i>Quiz Tips
              </h5>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-4 mb-3">
                  <div className="text-center p-3">
                    <i className="fas fa-brain text-primary fs-1 mb-3"></i>
                    <h6>Active Recall</h6>
                    <p className="small text-muted">
                      Quiz mode uses active recall, the most effective learning technique.
                    </p>
                  </div>
                </div>
                <div className="col-md-4 mb-3">
                  <div className="text-center p-3">
                    <i className="fas fa-chart-line text-success fs-1 mb-3"></i>
                    <h6>Track Progress</h6>
                    <p className="small text-muted">
                      Your quiz scores are saved to track improvement over time.
                    </p>
                  </div>
                </div>
                <div className="col-md-4 mb-3">
                  <div className="text-center p-3">
                    <i className="fas fa-random text-warning fs-1 mb-3"></i>
                    <h6>Randomized Questions</h6>
                    <p className="small text-muted">
                      Questions are randomized to ensure you're really learning.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Quiz;