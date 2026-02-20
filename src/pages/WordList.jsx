// src/pages/WordList.jsx
import React, { useState, useMemo } from "react";
import { useVocab } from "../context/VocabContext";
import Word from "../components/word";

const WordList = () => {
  const {
    vocabulary,
    bookmarkedWords,
    masteredWords,
    toggleBookmark,
    increaseMastery,
  } = useVocab();

  const [searchTerm, setSearchTerm] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("all");
  const [masteryFilter, setMasteryFilter] = useState("all");
  const [expandedWord, setExpandedWord] = useState(null);
  // Filter words based on search and filters - FIXED with useMemo
  const filteredWords = useMemo(() => {
    if (!vocabulary || vocabulary.length === 0) return [];

    return vocabulary.filter((word) => {
      // Search filter
      const matchesSearch =
        searchTerm === "" ||
        word.word.toLowerCase().includes(searchTerm.toLowerCase()) ||
        word.definition.toLowerCase().includes(searchTerm.toLowerCase());
      // Difficulty filter
      const matchesDifficulty =
        difficultyFilter === "all" || word.difficulty === difficultyFilter;

      // Mastery filter
      const masteryLevel = masteredWords[word.word] || 0;
      let matchesMastery = false;
      switch (masteryFilter) {
        case "bookmarked":
          matchesMastery = bookmarkedWords.includes(word.word);
          break;
        case "mastered":
          matchesMastery = masteryLevel >= 5;
          break;
        case "unmastered":
          matchesMastery = masteryLevel < 5;
          break;
        default:
          matchesMastery = true;
      }

      return matchesSearch && matchesDifficulty && matchesMastery;
    });
  }, [
    vocabulary,
    searchTerm,
    difficultyFilter,
    masteryFilter,
    bookmarkedWords,
    masteredWords,
  ]);

  const toggleExpand = (word) => {
    setExpandedWord(expandedWord === word ? null : word);
  };

  // Return loading state if no vocabulary
  if (!vocabulary || vocabulary.length === 0) {
    return (
      <section id="wordlist" className="section">
        <div className="text-center py-5">
          <div className="loading-spinner mx-auto mb-3"></div>
          <p>Loading vocabulary...</p>
        </div>
      </section>
    );
  }

  return (
    <section id="wordlist" className="section">
      <div className="row mb-4">
        <div className="col-12">
          <h2 className="fw-bold section-title">Complete Word List</h2>
          <p className="text-muted">
            Search and filter through all {vocabulary.length} words.
          </p>
        </div>
      </div>

      <div className="row mb-4 g-3">
        <div className="col-md-6">
          <div className="input-group shadow-sm word-search-container">
            <span className="input-group-text bg-white border-end-0">
              <i className="fas fa-search text-muted"></i>
            </span>
            <input
              type="text"
              className="form-control border-start-0"
              placeholder="Search by word or definition..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="col-md-3">
          <select
            className="form-select shadow-sm"
            value={difficultyFilter}
            onChange={(e) => setDifficultyFilter(e.target.value)}
          >
            <option value="all">All Difficulties</option>
            <option value="HS">High School</option>
            <option value="COL">College</option>
            <option value="ADV">Advanced</option>
          </select>
        </div>
        <div className="col-md-3">
          <select
            className="form-select shadow-sm"
            value={masteryFilter}
            onChange={(e) => setMasteryFilter(e.target.value)}
          >
            <option value="all">All Mastery</option>
            <option value="bookmarked">Bookmarked</option>
            <option value="mastered">Mastered</option>
            <option value="unmastered">Not Mastered</option>
          </select>
        </div>
      </div>

      <div className="card border-0 shadow-sm">
        <div className="card-header bg-white py-3 d-flex justify-content-between align-items-center">
          <h5 className="mb-0 fw-bold">Vocabulary Database</h5>
          <span className="badge bg-primary rounded-pill px-3">
            {filteredWords.length} words
          </span>
        </div>
        <div className="card-body p-0  ">
          <div className="p-3" style={{ minHeight: "300px" }}>
            <div className="row ms-auto me-auto">
              {filteredWords.length === 0 ? (
                <div className="text-center py-5">
                  <i className="fas fa-search display-4 text-muted mb-3"></i>
                  <h5 className="text-muted">No words found</h5>
                  <p className="text-muted small">
                    Try changing your search or filters
                  </p>
                </div>
              ) : (
                filteredWords.map((word, index) => {
                  const isBookmarked = bookmarkedWords.includes(word.word);
                  const masteryLevel = masteredWords[word.word] || 0;
                  const isExpanded = expandedWord === word.word;

                  return (
                    <Word
                      key={word.word}
                      word={word}
                      index={index}
                      isBookmarked={isBookmarked}
                      masteryLevel={masteryLevel}
                      toggleExpand={toggleExpand}
                      toggleBookmark={toggleBookmark}
                      isExpanded={isExpanded}
                      increaseMastery={increaseMastery}
                    />
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WordList;
