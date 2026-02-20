// src/pages/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useVocab } from '../context/VocabContext';

const Dashboard = () => {
  const { vocabulary, bookmarkedWords, masteredWords, studyStats } = useVocab();
  const [dailyWord, setDailyWord] = useState(null);
  const [showExample, setShowExample] = useState(false);

  // Calculate stats
  const masteredCount = Object.keys(masteredWords).filter(
    (word) => masteredWords[word] >= 5
  ).length;
  
  const masteredPercentage = Math.round((masteredCount / vocabulary.length) * 100);
  const bookmarkedPercentage = Math.round((bookmarkedWords.length / vocabulary.length) * 100);

  // Calculate average quiz accuracy
  const avgQuizAccuracy = studyStats.quizScores.length > 0
    ? Math.round(
        studyStats.quizScores.reduce((acc, score) => acc + score.accuracy, 0) /
        studyStats.quizScores.length
      )
    : 0;

  // Get random daily word
  
  const getNextDailyWord = () => {
    const randomWord = vocabulary[Math.floor(Math.random() * vocabulary.length)];
    setDailyWord(randomWord);
    setShowExample(false);
  };
  useEffect(() => {
    const randomWord = vocabulary[Math.floor(Math.random() * vocabulary.length)];
    setDailyWord(randomWord);
  }, [vocabulary]);


  return (
    <section id="dashboard" className="section active">
      <div className="row mb-5">
        <div className="col-12 text-center">
          <h1 className="display-4 fw-bold mb-3">Welcome Back!</h1>
          <p className="lead text-muted">
            Continue your journey to master {vocabulary.length} essential vocabulary words.
          </p>
        </div>
      </div>

      <div className="row mb-5">
        <div className="col-md-3 col-sm-6 mb-4">
          <Link className="card text-center h-100 card-hover" to="/flashcards">
            <div className="card-body">
              <div className="display-4 text-primary mb-3">
                <i className="fas fa-layer-group"></i>
              </div>
              <h5 className="card-title">Flashcards</h5>
              <p className="card-text small text-muted">
                Interactive flip cards for active recall.
              </p>
              <div className="btn btn-sm btn-primary mt-2">
                Start Learning
              </div>
            </div>
          </Link>
        </div>
        <div className="col-md-3 col-sm-6 mb-4">
          <Link className="card text-center h-100 card-hover" to="/quiz">
            <div className="card-body">
              <div className="display-4 text-success mb-3">
                <i className="fas fa-question-circle"></i>
              </div>
              <h5 className="card-title">Quiz Mode</h5>
              <p className="card-text small text-muted">
                Test your knowledge and track scores.
              </p>
              <div className="btn btn-sm btn-primary mt-2">Take a Quiz</div>
            </div>
          </Link>
        </div>
        <div className="col-md-3 col-sm-6 mb-4">
          <Link className="card text-center h-100 card-hover" to="/wordlist">
            <div className="card-body">
              <div className="display-4 text-warning mb-3">
                <i className="fas fa-list-ul"></i>
              </div>
              <h5 className="card-title">Word List</h5>
              <p className="card-text small text-muted">
                Browse all words with full details.
              </p>
              <div className="btn btn-sm btn-primary mt-2">View All</div>
            </div>
          </Link>
        </div>
        <div className="col-md-3 col-sm-6 mb-4">
          <Link className="card text-center h-100 card-hover" to="/progress">
            <div className="card-body">
              <div className="display-4 text-info mb-3">
                <i className="fas fa-chart-line"></i>
              </div>
              <h5 className="card-title">Progress</h5>
              <p className="card-text small text-muted">
                Detailed stats and achievements.
              </p>
              <div className="btn btn-sm btn-primary mt-2">View Stats</div>
            </div>
          </Link>
        </div>
      </div>

      <div className="row">
        <div className="col-lg-8 mb-4">
          <div className="card h-100 overflow-hidden daily-challenge-card">
            <div className="card-header bg-primary text-white py-3">
              <h5 className="mb-0">
                <i className="fas fa-fire me-2"></i>Daily Word Challenge
              </h5>
            </div>
            <div className="card-body d-flex flex-column justify-content-center">
              {dailyWord ? (
                <div className="text-center py-4">
                  <h3 className="flashcard-word mb-2">{dailyWord.word}</h3>
                  <p className="lead fw-bold">{dailyWord.definition}</p>
                  <div className="mt-4">
                    <button
                      className="btn btn-primary px-4 me-2"
                      onClick={() => setShowExample(!showExample)}
                    >
                      {showExample ? 'Hide' : 'Show'} Example
                    </button>
                    <button
                      className="btn btn-outline-primary px-4"
                      onClick={getNextDailyWord}
                    >
                      Next Word
                    </button>
                  </div>
                  {showExample && (
                    <div className="mt-4">
                      <div className="alert alert-info border-0 shadow-sm">
                        <i className="fas fa-quote-left me-2 opacity-50"></i>
                        <span>{dailyWord.example}</span>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-center">Loading daily word...</p>
              )}
            </div>
          </div>
        </div>

        <div className="col-lg-4 mb-4">
          <div className="card h-100">
            <div className="card-header bg-success text-white py-3">
              <h5 className="mb-0">
                <i className="fas fa-trophy me-2"></i>Quick Stats
              </h5>
            </div>
            <div className="card-body">
              <div className="mb-4">
                <div className="d-flex justify-content-between mb-1">
                  <span className="fw-bold">Total Words</span>
                  <span className="badge bg-primary">{vocabulary.length}</span>
                </div>
                <div className="progress">
                  <div className="progress-bar" style={{ width: '100%' }}></div>
                </div>
              </div>
              <div className="mb-4">
                <div className="d-flex justify-content-between mb-1">
                  <span className="fw-bold">Mastered</span>
                  <span className="badge bg-success">{masteredPercentage}%</span>
                </div>
                <div className="progress">
                  <div
                    className="progress-bar bg-success"
                    style={{ width: `${masteredPercentage}%` }}
                  ></div>
                </div>
              </div>
              <div className="mb-4">
                <div className="d-flex justify-content-between mb-1">
                  <span className="fw-bold">Bookmarked</span>
                  <span className="badge bg-warning">{bookmarkedPercentage}%</span>
                </div>
                <div className="progress">
                  <div
                    className="progress-bar bg-warning"
                    style={{ width: `${bookmarkedPercentage}%` }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="d-flex justify-content-between mb-1">
                  <span className="fw-bold">Quiz Accuracy</span>
                  <span className="badge bg-info">{avgQuizAccuracy}%</span>
                </div>
                <div className="progress">
                  <div
                    className="progress-bar bg-info"
                    style={{ width: `${avgQuizAccuracy}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Dashboard;