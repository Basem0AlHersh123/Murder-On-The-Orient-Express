// src/pages/StoryBook.jsx
import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { useVocab } from '../context/VocabContext';
import { storyData } from '../storyData';
import StoryCard from '../components/StoryCard';
import { Link } from 'react-router-dom';

const StoryBook = () => {
  const { vocabulary, storiesRead, markStoryRead, getMasteryLevel, toggleBookmark, isBookmarked } = useVocab();
  const [selectedStoryId, setSelectedStoryId] = useState(null);
  const [activeWordPopover, setActiveWordPopover] = useState(null);
  const [readingProgress, setReadingProgress] = useState(0);
  const [difficultyFilter, setDifficultyFilter] = useState('all');
  const readerRef = useRef(null);
  const popoverRef = useRef(null);

  // Build vocab lookup map for quick access
  const vocabMap = useMemo(() => {
    const map = {};
    if (vocabulary && vocabulary.length > 0) {
      vocabulary.forEach(word => {
        const key = word.word.toLowerCase();
        if (!map[key]) {
          map[key] = word;
        }
      });
    }
    return map;
  }, [vocabulary]);

  const selectedStory = useMemo(() => 
    storyData.find(s => s.id === selectedStoryId),
    [selectedStoryId]
  );

  const filteredStories = useMemo(() => {
    if (difficultyFilter === 'all') return storyData;
    return storyData.filter(s => s.difficulty === difficultyFilter);
  }, [difficultyFilter]);

  // Scroll progress tracking
  useEffect(() => {
    if (!selectedStory || !readerRef.current) return;

    const handleScroll = () => {
      const el = readerRef.current;
      if (!el) return;
      const scrollTop = window.scrollY - el.offsetTop;
      const scrollHeight = el.scrollHeight - window.innerHeight;
      const progress = Math.max(0, Math.min(100, (scrollTop / scrollHeight) * 100));
      setReadingProgress(progress);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [selectedStory]);

  // Close popover on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target)) {
        setActiveWordPopover(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectStory = useCallback((storyId) => {
    setSelectedStoryId(storyId);
    setReadingProgress(0);
    setActiveWordPopover(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleBackToSelection = useCallback(() => {
    setSelectedStoryId(null);
    setActiveWordPopover(null);
    setReadingProgress(0);
  }, []);

  const handleMarkAsRead = useCallback(() => {
    if (selectedStoryId) {
      markStoryRead(selectedStoryId);
    }
  }, [selectedStoryId, markStoryRead]);

  const handleWordClick = useCallback((word, event) => {
    event.stopPropagation();
    const vocabEntry = vocabMap[word.toLowerCase()];
    if (vocabEntry) {
      setActiveWordPopover(prev => 
        prev?.word === vocabEntry.word ? null : {
          ...vocabEntry,
          x: event.clientX,
          y: event.clientY
        }
      );
    }
  }, [vocabMap]);

  // Highlight vocabulary words in text
  const renderHighlightedText = useCallback((text, vocabWords) => {
    if (!text || !vocabWords || vocabWords.length === 0) return text;

    // Create a regex to match vocab words (whole words only, case-insensitive)
    const escapedWords = vocabWords
      .filter(w => vocabMap[w.toLowerCase()])
      .map(w => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
    
    if (escapedWords.length === 0) return text;

    const regex = new RegExp(`\\b(${escapedWords.join('|')})\\b`, 'gi');
    const parts = text.split(regex);

    return parts.map((part, index) => {
      const isVocabWord = vocabWords.some(
        w => w.toLowerCase() === part.toLowerCase()
      );
      
      if (isVocabWord && vocabMap[part.toLowerCase()]) {
        const mastery = getMasteryLevel(part.toLowerCase());
        return (
          <span
            key={index}
            className={`story-vocab-word mastery-${Math.min(mastery, 5)}`}
            onClick={(e) => handleWordClick(part, e)}
            title={`Click to see definition of "${part}"`}
          >
            {part}
          </span>
        );
      }
      return part;
    });
  }, [vocabMap, getMasteryLevel, handleWordClick]);

  // Loading state
  if (!vocabulary || vocabulary.length === 0) {
    return (
      <section id="storybook" className="section">
        <div className="text-center py-5">
          <div className="spinner-border text-primary" style={{ width: '3rem', height: '3rem' }} role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading stories...</p>
        </div>
      </section>
    );
  }

  // Story Reader View
  if (selectedStory) {
    const isRead = storiesRead?.includes(selectedStory.id);
    
    return (
      <section id="storybook" className="section" ref={readerRef}>
        {/* Reading progress bar */}
        <div className="story-reading-progress" style={{ width: `${readingProgress}%` }}></div>

        {/* Header */}
        <div className="row mb-4">
          <div className="col-12">
            <button className="btn btn-outline-secondary mb-3" onClick={handleBackToSelection}>
              <i className="fas fa-arrow-left me-2"></i>Back to Stories
            </button>
            <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
              <div>
                <h2 className="fw-bold section-title mb-1">
                  {selectedStory.coverEmoji} {selectedStory.title}
                </h2>
                <p className="text-muted mb-0">{selectedStory.description}</p>
              </div>
              <div className="d-flex gap-2 flex-wrap">
                <span className={`badge ${selectedStory.difficulty === 'COL' ? 'bg-danger' : 'bg-primary'} px-3 py-2`}>
                  {selectedStory.difficulty}
                </span>
                <span className="badge bg-secondary px-3 py-2">
                  <i className="fas fa-clock me-1"></i>{selectedStory.readTime}
                </span>
                <Link to="/story-pdf" className="btn btn-sm btn-danger px-3" title="Read as PDF">
                  <i className="fas fa-file-pdf me-1"></i>PDF
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Vocab legend */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="card border-0 shadow-sm">
              <div className="card-body py-3">
                <div className="d-flex align-items-center flex-wrap gap-3">
                  <small className="fw-bold text-muted">
                    <i className="fas fa-info-circle me-1"></i>
                    Highlighted words are from your vocabulary list — click them to see definitions!
                  </small>
                  <div className="d-flex gap-2 ms-auto">
                    <span className="badge bg-primary bg-opacity-10 text-primary border border-primary px-2 py-1">
                      <small>New</small>
                    </span>
                    <span className="badge bg-success bg-opacity-10 text-success border border-success px-2 py-1">
                      <small>Mastered</small>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Story content */}
        <div className="row">
          <div className="col-lg-8 mx-auto">
            {selectedStory.content.map((section, index) => (
              <div key={index} className="story-section mb-5">
                <h4 className="story-section-title fw-bold mb-3">
                  <span className="story-section-number">{index + 1}</span>
                  {section.subtitle}
                </h4>
                <div className="story-text">
                  <p className="fs-5 lh-lg">
                    {renderHighlightedText(section.text, selectedStory.vocabularyUsed)}
                  </p>
                </div>
                {index < selectedStory.content.length - 1 && (
                  <hr className="story-divider my-4" />
                )}
              </div>
            ))}

            {/* End of story actions */}
            <div className="card border-0 shadow-lg story-end-card mt-5 mb-4">
              <div className="card-body text-center py-5">
                <div className="display-1 mb-3">📖</div>
                <h3 className="fw-bold mb-2">End of Chapter</h3>
                <p className="text-muted mb-4">
                  You encountered <strong>{selectedStory.vocabularyUsed.length}</strong> vocabulary words in this story.
                </p>
                <div className="d-flex justify-content-center gap-3 flex-wrap">
                  {!isRead && (
                    <button className="btn btn-success px-4 py-2" onClick={handleMarkAsRead}>
                      <i className="fas fa-check-circle me-2"></i>Mark as Read
                    </button>
                  )}
                  {isRead && (
                    <span className="badge bg-success px-4 py-3 fs-6">
                      <i className="fas fa-check-circle me-2"></i>Completed
                    </span>
                  )}
                  <button className="btn btn-primary px-4 py-2" onClick={handleBackToSelection}>
                    <i className="fas fa-book me-2"></i>More Stories
                  </button>
                </div>
              </div>
            </div>

            {/* Vocabulary summary */}
            <div className="card border-0 shadow-sm mb-4">
              <div className="card-header bg-white py-3">
                <h5 className="mb-0 fw-bold">
                  <i className="fas fa-list me-2"></i>Vocabulary in This Story
                </h5>
              </div>
              <div className="card-body">
                <div className="row g-2">
                  {selectedStory.vocabularyUsed.map(word => {
                    const vocabEntry = vocabMap[word.toLowerCase()];
                    const mastery = getMasteryLevel(word);
                    const bookmarked = isBookmarked(word);
                    
                    return vocabEntry ? (
                      <div key={word} className="col-md-6 col-lg-4">
                        <div className="p-3 rounded border story-vocab-summary-item">
                          <div className="d-flex align-items-center justify-content-between mb-1">
                            <strong className="text-primary">{vocabEntry.word}</strong>
                            <div className="d-flex gap-1">
                              {Array(5).fill(0).map((_, i) => (
                                <span key={i} className={`mastery-dot ${i < mastery ? 'active' : ''}`}></span>
                              ))}
                            </div>
                          </div>
                          <small className="text-muted">{vocabEntry.definition}</small>
                        </div>
                      </div>
                    ) : null;
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Floating word popover */}
        {activeWordPopover && (
          <div 
            ref={popoverRef}
            className="story-word-popover shadow-lg"
            style={{
              position: 'fixed',
              left: Math.min(activeWordPopover.x, window.innerWidth - 340),
              top: Math.min(activeWordPopover.y + 15, window.innerHeight - 250),
              zIndex: 9999,
            }}
          >
            <div className="popover-header d-flex align-items-center justify-content-between">
              <h6 className="mb-0 fw-bold">{activeWordPopover.word}</h6>
              <button className="btn btn-sm btn-close" onClick={() => setActiveWordPopover(null)}></button>
            </div>
            <div className="popover-body">
              <span className="badge bg-primary me-2 mb-2">{activeWordPopover.part_of_speech}</span>
              <span className="badge bg-secondary mb-2">{activeWordPopover.difficulty}</span>
              <p className="mb-2"><strong>Definition:</strong> {activeWordPopover.definition}</p>
              <p className="mb-2 small text-muted">
                <i className="fas fa-quote-left me-1 opacity-50"></i>
                {activeWordPopover.example}
              </p>
              {activeWordPopover.synonyms && (
                <p className="mb-1 small"><strong>Synonyms:</strong> {activeWordPopover.synonyms}</p>
              )}
              <div className="d-flex gap-2 mt-3">
                <button 
                  className={`btn btn-sm ${isBookmarked(activeWordPopover.word) ? 'btn-warning' : 'btn-outline-warning'}`}
                  onClick={(e) => { e.stopPropagation(); toggleBookmark(activeWordPopover.word); }}
                >
                  <i className={`${isBookmarked(activeWordPopover.word) ? 'fas' : 'far'} fa-bookmark me-1`}></i>
                  {isBookmarked(activeWordPopover.word) ? 'Bookmarked' : 'Bookmark'}
                </button>
              </div>
            </div>
          </div>
        )}
      </section>
    );
  }

  // Story Selection View
  const readCount = storiesRead?.length || 0;

  return (
    <section id="storybook" className="section">
      <div className="row mb-4">
        <div className="col-12">
          <h2 className="fw-bold section-title">
            <i className="fas fa-book-open me-2"></i>StoryBook
          </h2>
          <p className="text-muted">
            Read engaging stories featuring your vocabulary words in context. Click highlighted words to see their definitions!
          </p>
        </div>
      </div>

      {/* PDF Banner */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="storybook-pdf-banner">
            <div className="pdf-banner-left">
              <div className="pdf-banner-icon">📄</div>
              <div>
                <h6 className="mb-1 fw-bold">Read as PDF</h6>
                <p className="mb-0 small opacity-75">Download or read the full story as a beautifully formatted PDF</p>
              </div>
            </div>
            <Link to="/story-pdf" className="btn pdf-banner-cta-btn">
              <i className="fas fa-file-pdf me-2"></i>Open PDF Reader
            </Link>
          </div>
        </div>
      </div>

      {/* Stats bar */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card border-0 shadow-sm">
            <div className="card-body py-3">
              <div className="row text-center">
                <div className="col-4">
                  <h4 className="fw-bold text-primary mb-0">{storyData.length}</h4>
                  <small className="text-muted">Total Stories</small>
                </div>
                <div className="col-4">
                  <h4 className="fw-bold text-success mb-0">{readCount}</h4>
                  <small className="text-muted">Read</small>
                </div>
                <div className="col-4">
                  <h4 className="fw-bold text-warning mb-0">
                    {storyData.reduce((acc, s) => acc + s.vocabularyUsed.length, 0)}
                  </h4>
                  <small className="text-muted">Vocab Words</small>
                </div>
              </div>
              {readCount > 0 && (
                <div className="progress mt-3" style={{ height: '6px' }}>
                  <div 
                    className="progress-bar bg-success"
                    style={{ width: `${(readCount / storyData.length) * 100}%` }}
                  ></div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="row mb-4">
        <div className="col-md-4">
          <select
            className="form-select shadow-sm"
            value={difficultyFilter}
            onChange={(e) => setDifficultyFilter(e.target.value)}
          >
            <option value="all">All Difficulties</option>
            <option value="HS">High School</option>
            <option value="COL">College</option>
          </select>
        </div>
      </div>

      {/* Story grid */}
      <div className="row">
        {filteredStories.map(story => (
          <StoryCard
            key={story.id}
            story={story}
            isRead={storiesRead?.includes(story.id)}
            onSelect={handleSelectStory}
            vocabularyData={vocabulary}
          />
        ))}
      </div>

      {/* Reading tips */}
      <div className="row mt-4">
        <div className="col-12">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-info text-white py-3">
              <h5 className="mb-0">
                <i className="fas fa-lightbulb me-2"></i>Reading Tips
              </h5>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-3 mb-3">
                  <div className="text-center p-3">
                    <i className="fas fa-highlighter text-primary fs-1 mb-3"></i>
                    <h6>Highlighted Words</h6>
                    <p className="small text-muted">
                      Vocabulary words are highlighted in each story. Click them to see definitions.
                    </p>
                  </div>
                </div>
                <div className="col-md-3 mb-3">
                  <div className="text-center p-3">
                    <i className="fas fa-brain text-success fs-1 mb-3"></i>
                    <h6>Context Learning</h6>
                    <p className="small text-muted">
                      See words used naturally in stories for deeper understanding and retention.
                    </p>
                  </div>
                </div>
                <div className="col-md-3 mb-3">
                  <div className="text-center p-3">
                    <i className="fas fa-bookmark text-warning fs-1 mb-3"></i>
                    <h6>Bookmark Words</h6>
                    <p className="small text-muted">
                      Bookmark any word directly from the story for later review.
                    </p>
                  </div>
                </div>
                <div className="col-md-3 mb-3">
                  <div className="text-center p-3">
                    <i className="fas fa-chart-line text-danger fs-1 mb-3"></i>
                    <h6>Track Progress</h6>
                    <p className="small text-muted">
                      Mark stories as read and see your reading progress on the dashboard.
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

export default StoryBook;
