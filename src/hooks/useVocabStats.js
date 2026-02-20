// src/hooks/useVocabStats.js
import { useMemo } from "react";

export const useVocabStats = (vocabulary, masteredWords, bookmarkedWords) => {
  const stats = useMemo(() => {
    const masteredCount = Object.keys(masteredWords).filter(
      (word) => masteredWords[word] >= 5,
    ).length;

    const masteredPercentage = Math.round(
      (masteredCount / vocabulary.length) * 100,
    );
    const bookmarkedPercentage = Math.round(
      (bookmarkedWords.length / vocabulary.length) * 100,
    );

    return {
      masteredCount,
      masteredPercentage,
      bookmarkedPercentage,
      totalWords: vocabulary.length,
    };
  }, [vocabulary, masteredWords, bookmarkedWords]);

  return stats;
};
