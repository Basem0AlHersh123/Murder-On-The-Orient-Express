// src/components/StoryCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const StoryCard = ({ story, isRead, onSelect, vocabularyData }) => {
  // Count how many vocab words from this story the user has encountered
  const vocabCount = story.vocabularyUsed.length;
  
  const difficultyBadge = {
    'HS': { class: 'bg-primary', label: 'High School' },
    'COL': { class: 'bg-danger', label: 'College' },
  };

  const badge = difficultyBadge[story.difficulty] || difficultyBadge['HS'];

  return (
    <div className="col-md-6 col-lg-4 mb-4">
      <div 
        className={`card h-100 story-card ${isRead ? 'story-card-read' : ''}`}
        onClick={() => onSelect(story.id)}
        style={{ cursor: 'pointer' }}
      >
        <div className="card-body d-flex flex-column">
          {/* Cover emoji & status */}
          <div className="text-center mb-3">
            <div className="story-cover-emoji">{story.coverEmoji}</div>
            {isRead && (
              <span className="badge bg-success position-absolute top-0 end-0 m-3">
                <i className="fas fa-check-circle me-1"></i>Read
              </span>
            )}
          </div>

          {/* Title & description */}
          <h5 className="fw-bold mb-2">{story.title}</h5>
          <p className="text-muted small mb-3 flex-grow-1">{story.description}</p>

          {/* Badges */}
          <div className="mb-3 d-flex flex-wrap gap-2">
            <span className={`badge ${badge.class}`}>
              <i className="fas fa-graduation-cap me-1"></i>
              {badge.label}
            </span>
            <span className="badge bg-secondary">
              <i className="fas fa-clock me-1"></i>
              {story.readTime}
            </span>
            <span className="badge bg-info">
              <i className="fas fa-book-open me-1"></i>
              {vocabCount} words
            </span>
          </div>

          {/* Vocab preview */}
          <div className="mb-3">
            <small className="text-muted fw-bold">Featured Words:</small>
            <div className="mt-1 d-flex flex-wrap gap-1">
              {story.vocabularyUsed.slice(0, 5).map(word => (
                <span key={word} className="badge bg-light text-dark border small">
                  {word}
                </span>
              ))}
              {story.vocabularyUsed.length > 5 && (
                <span className="badge bg-light text-muted border small">
                  +{story.vocabularyUsed.length - 5} more
                </span>
              )}
            </div>
          </div>

          {/* CTA */}
          <div className="d-flex gap-2 mt-auto">
            <button
              className={`btn ${isRead ? 'btn-outline-primary' : 'btn-primary'} flex-grow-1`}
            >
              <i className={`fas ${isRead ? 'fa-redo' : 'fa-book-reader'} me-2`}></i>
              {isRead ? 'Read Again' : 'Start Reading'}
            </button>
            <Link
              to="/story-pdf"
              onClick={(e) => e.stopPropagation()}
              className="btn btn-outline-danger story-pdf-btn"
              title="Read as PDF"
            >
              <i className="fas fa-file-pdf"></i>
              <span className="d-none d-sm-inline ms-1">PDF</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoryCard;
