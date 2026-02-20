import React from 'react'

const Flashcards = () => {
  return (
          <section id="flashcards" className="section">
        <div className="row mb-4">
          <div className="col-12">
            <h2 className="fw-bold">Interactive Flashcards</h2>
            <p className="text-muted">
              Click the card to flip. Use the buttons below to navigate.
            </p>
          </div>
        </div>

        <div className="row mb-5">
          <div className="col-lg-8 mx-auto">
            <div className="flashcard-container">
              <div className="flashcard" id="flashcard">
                <div className="flashcard-front">
                  <h2 className="flashcard-word" id="cardWord">motive</h2>
                  <p className="flashcard-hint">
                    <i className="fas fa-sync-alt me-2"></i>Click to flip
                  </p>
                  <div className="mt-4">
                    <span
                      className="badge bg-primary px-3 py-2"
                      id="cardPartOfSpeech">noun
                      </span>
                    <span
                      className="badge bg-secondary px-3 py-2 ms-2"
                      id="cardDifficulty"
                      >HS</span>
                  </div>
                  <div className="mt-4">
                    <button
                      className="btn btn-outline-warning rounded-pill"
                      id="bookmarkCardBtn"
                    >
                      <i className="far fa-bookmark me-2"></i>Bookmark
                    </button>
                  </div>
                </div>
                <div className="flashcard-back">
                  <div className="w-100">
                    <h5 className="text-primary fw-bold border-bottom pb-2 mb-3">
                      Definition
                    </h5>
                    <p className="fs-5 mb-4" id="cardDefinition">
                      reason (for doing something)
                    </p>

                    <h5 className="text-primary fw-bold border-bottom pb-2 mb-3">
                      Example
                    </h5>
                    <div
                      className="alert alert-light border shadow-sm mb-4"
                      id="cardExample"
                    >
                      She believes the profit motive encourages people to
                      satisfy other people's needs.
                    </div>

                    <div className="row mb-4">
                      <div className="col-md-6">
                        <h6 className="fw-bold">Synonyms</h6>
                        <p className="text-muted" id="cardSynonyms">
                          incentive, rationale
                        </p>
                      </div>
                      <div className="col-md-6">
                        <h6 className="fw-bold">Antonyms</h6>
                        <p className="text-muted" id="cardAntonyms">disincentive</p>
                      </div>
                    </div>

                    <div className="mt-auto pt-3 border-top">
                      <h6 className="fw-bold mb-3">Mastery Level</h6>
                      <div
                        className="d-flex align-items-center justify-content-between"
                      >
                        <div className="mastery-level" id="masteryIndicators">
                          <span className="mastery-indicator"></span>
                          <span className="mastery-indicator"></span>
                          <span className="mastery-indicator"></span>
                          <span className="mastery-indicator"></span>
                          <span className="mastery-indicator"></span>
                        </div>
                        <button
                          className="btn btn-sm btn-success rounded-pill"
                          id="increaseMastery"
                        >
                          <i className="fas fa-level-up-alt me-1"></i>Level Up
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center mt-5">
              <div
                className="d-flex justify-content-center align-items-center gap-3"
              >
                <button
                  className="btn btn-lg btn-primary rounded-circle shadow"
                  id="prevCard"
                  title="Previous"
                >
                  <i className="fas fa-chevron-left"></i>
                </button>
                <button
                  className="btn btn-lg btn-outline-primary px-5 rounded-pill shadow-sm"
                  id="flipCard"
                >
                  <i className="fas fa-sync-alt me-2"></i>Flip Card
                </button>
                <button
                  className="btn btn-lg btn-primary rounded-circle shadow"
                  id="nextCard"
                  title="Next"
                >
                  <i className="fas fa-chevron-right"></i>
                </button>
              </div>

              <div className="mt-4 d-flex justify-content-center gap-4">
                <div className="form-check form-switch">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="shuffleCards"
                  />
                  <label className="form-check-label" htmlFor="shuffleCards"
                    >Shuffle</label>
                </div>
                <div className="form-check form-switch">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="showBookmarkedOnly"
                  />
                  <label className="form-check-label" htmlFor="showBookmarkedOnly"
                    >Bookmarked Only</label>
                </div>
              </div>

              <div className="mt-3">
                <span
                  className="badge bg-dark rounded-pill px-3 py-2"
                  id="cardCounter"
                  >Card 1 of 299</span>
              </div>
            </div>
          </div>
        </div>
      </section>

  )
}

export default Flashcards
