import React from 'react'

const Word = ({word,index,isBookmarked,masteryLevel,toggleExpand,toggleBookmark,isExpanded,increaseMastery}) => {
  return (
                <div 
                    key={`${word.word}-${index}`} 
                    className={`word-item ${isBookmarked ? 'bookmarked' : ''} ${masteryLevel >= 5 ? 'mastered' : ''} col-md-6 col-lg-4 col-12 m-5 ms-auto me-auto`}
                    >
                      <div className="d-flex justify-content-between align-items-start">
                      <span className='text-muted'>{index+1}-  </span>
                        <div 
                          className="flex-grow-1" 
                          style={{ cursor: 'pointer' }}
                          onClick={() => toggleExpand(word.word)}
                        >
                          <h5 className="fw-bold mb-1">
                            {word.word} 
                            <span className={`badge ${word.difficulty.toLowerCase()} ms-2 `}>
                              {word.difficulty}
                            </span>
                            <span className="badge bg-light text-muted small ms-2">
                              {word.part_of_speech}
                            </span>
                          </h5>
                          <p className="mb-0 text-muted">{word.definition}</p>
                        </div>
                        <div className="d-flex gap-2">
                          <button 
                            className={`btn btn-sm ${isBookmarked ? 'btn-warning' : 'btn-outline-warning'}`}
                            onClick={() => toggleBookmark(word.word)}
                            aria-label={isBookmarked ? 'Remove bookmark' : 'Bookmark word'}
                          >
                            <i className={`${isBookmarked ? 'fas' : 'far'} fa-bookmark`}></i>
                          </button>
                        </div>
                      </div>
                      <div className={`word-details ${isExpanded ? 'expanded' : ''}`}>
                        <div className="row g-3 mt-3">
                          <div className="col-md-6">
                            <p className="small mb-1 fw-bold text-primary">Example</p>
                            <p className="small fst-italic">"{word.example}"</p>
                          </div>
                          <div className="col-md-6">
                            <p className="small mb-1 fw-bold text-primary">Synonyms / Antonyms</p>
                            <p className="small mb-0">S: {word.synonyms}</p>
                            <p className="small">A: {word.antonyms}</p>
                          </div>
                        </div>
                        <div className="d-flex justify-content-between align-items-center mt-3">
                          <div className="d-flex align-items-center gap-2">
                            <span className={`badge difficulty-badge ${word.difficulty.toLowerCase()}`}>
                              {word.difficulty}
                            </span>
                            <small className="text-muted">
                              Mastery: {masteryLevel}/5
                            </small>
                          </div>
                          <div className="d-flex align-items-center gap-2">
                            <div className="mastery-level">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <span
                                  key={i}
                                  className={`mastery-indicator ${i < masteryLevel ? 'active' : ''}`}
                                ></span>
                              ))}
                            </div>
                            <button
                              className="btn btn-sm btn-outline-success"
                              onClick={() => increaseMastery(word.word)}
                              disabled={masteryLevel >= 5}
                              aria-label="Increase mastery level"
                            >
                              <i className="fas fa-plus"></i>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
  )
}

export default Word
