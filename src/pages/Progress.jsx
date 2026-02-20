import React, { useEffect, useRef, useState } from "react";
import { useVocab } from "../context/VocabContext";
import Chart from "chart.js/auto";

const Progress = () => {
  const { vocabulary, masteredWords, studyStats, bookmarkedWords } = useVocab();
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Check for dark mode
  useEffect(() => {
    const checkDarkMode = () => {
      const theme = document.body.getAttribute("data-theme");
      setIsDarkMode(theme === "dark");
    };

    checkDarkMode();

    // Listen for theme changes
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    return () => observer.disconnect();
  }, []);
  // Calculate achievements

  const achievements = React.useMemo(() => {
    const achievementsList = [];
    if (studyStats.cardsStudied.length >= 10) {
      achievementsList.push({
        name: "Novice Learner",
        icon: "fa-seedling",
        color: "text-success",
        description: "Studied 10+ words",
      });
    }
    if (studyStats.cardsStudied.length >= 40) {
      achievementsList.push({
        name: "Dedicated Student",
        icon: "fa-book",
        color: "text-primary",
        description: "Studied 40+ words",
      });
    }
    if (
      Object.keys(masteredWords).filter((w) => masteredWords[w] >= 5).length >=
      5
    ) {
      achievementsList.push({
        name: "Word Master",
        icon: "fa-crown",
        color: "text-warning",
        description: "Mastered 5+ words",
      });
    }
    if (studyStats.studyStreak >= 3) {
      achievementsList.push({
        name: "On Fire!",
        icon: "fa-fire",
        color: "text-danger",
        description: "3-day study streak",
      });
    }
    return achievementsList;
  }, [studyStats.cardsStudied.length, masteredWords, studyStats.studyStreak]);

  // Calculate mastery distribution
  const distribution = React.useMemo(() => {
    const dist = [0, 0, 0, 0, 0, 0];
    if (vocabulary && vocabulary.length > 0) {
      vocabulary.forEach((word) => {
        const level = masteredWords[word.word] || 0;
        dist[level]++;
      });
    }
    return dist;
  }, [vocabulary, masteredWords]);

  // Create chart - FIXED with proper cleanup
  useEffect(() => {
    if (!chartRef.current) return;

    // Destroy previous chart
    if (chartInstance.current) {
      chartInstance.current.destroy();
      chartInstance.current = null;
    }

    // Only create chart if we have data
    if (vocabulary && vocabulary.length > 0) {
      const ctx = chartRef.current.getContext("2d");

      chartInstance.current = new Chart(ctx, {
        type: "bar",
        data: {
          labels: ["Lvl 0", "Lvl 1", "Lvl 2", "Lvl 3", "Lvl 4", "Lvl 5"],
          datasets: [
            {
              label: "Words",
              data: distribution,
              backgroundColor: [
                isDarkMode ? "#475569" : "#cbd5e1",
                "#60a5fa",
                "#8b5cf6",
                "#34d399",
                "#fbbf24",
                "#f97316",
              ],
              borderRadius: 8,
              borderWidth: 1,
              borderColor: isDarkMode ? "#334155" : "#e2e8f0",
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                label: (context) =>
                  `${context.parsed.y} words at level ${context.dataIndex}`,
              },
            },
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                precision: 0,
                color: isDarkMode ? "#cbd5e8" : "#475569",
              },
              grid: { color: isDarkMode ? "#334155" : "#e2e8f0" },
            },
            x: {
              ticks: { color: isDarkMode ? "#cbd5e8" : "#475569" },
              grid: { color: isDarkMode ? "#334155" : "#e2e8f0" },
            },
          },
        },
      });
    }

    // Cleanup on unmount
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
        chartInstance.current = null;
      }
    };
  }, [distribution, isDarkMode, vocabulary]);

  // Export functions
  const exportBookmarks = () => {
    const content = bookmarkedWords.join("\n");
    downloadFile(content, "bookmarks.txt", "text/plain");
  };

  const exportMastered = () => {
    const mastered = Object.keys(masteredWords).filter(
      (word) => masteredWords[word] >= 5,
    );
    const content = mastered.join("\n");
    downloadFile(content, "mastered-words.txt", "text/plain");
  };

  const downloadFile = (content, filename, type) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Calculate average quiz score
  const avgQuizScore = React.useMemo(() => {
    return studyStats.quizScores.length > 0
      ? Math.round(
          studyStats.quizScores.reduce(
            (acc, score) => acc + score.accuracy,
            0,
          ) / studyStats.quizScores.length,
        )
      : 0;
  }, [studyStats.quizScores]);

  // Render streak calendar
  const streakCalendar = React.useMemo(() => {
    const days = [];
    const today = new Date();

    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(today.getDate() - i);
      const dayName = date.toLocaleDateString("en-US", { weekday: "short" });
      const isToday = i === 0;

      days.push(
        <div key={i} className="text-center" style={{ minWidth: "45px" }}>
          <div className="small text-muted mb-1">{dayName}</div>
          <div
            className={`rounded-circle ${isToday ? "bg-primary text-white" : "bg-light"} d-flex align-items-center justify-content-center fw-bold`}
            style={{ width: "35px", height: "35px", margin: "0 auto" }}
          >
            {date.getDate()}
          </div>
        </div>,
      );
    }

    return days;
  }, []);

  // Return loading state if no vocabulary
  if (!vocabulary || vocabulary.length === 0) {
    return (
      <section id="progress" className="section">
        <div className="text-center py-5">
          <div className="loading-spinner mx-auto mb-3"></div>
          <p>Loading progress data...</p>
        </div>
      </section>
    );
  }

  return (
    <section id="progress" className="section">
      <div className="row mb-4">
        <div className="col-12">
          <h2 className="fw-bold section-title">Learning Progress</h2>
          <p className="text-muted">Your statistics and achievements.</p>
        </div>
      </div>

      <div className="row mb-4">
        <div className="col-md-8 mb-4">
          <div className="card h-100 shadow-sm">
            <div className="card-header bg-white py-3">
              <h5 className="mb-0 fw-bold">Mastery Distribution</h5>
            </div>
            <div className="card-body">
              <canvas ref={chartRef} height="280"></canvas>
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-4">
          <div className="card h-100 shadow-sm">
            <div className="card-header bg-white py-3">
              <h5 className="mb-0 fw-bold">Achievements</h5>
            </div>
            <div className="card-body">
              <div className="text-center mb-4">
                <div className="achievement-badge">
                  <i className="fas fa-award"></i>
                </div>
                <h4 className="fw-bold">{achievements.length} Earned</h4>
              </div>
              {/* 
                ================================================
                you may have check these
                                    About
                                    Progress
                                    Quiz 
                                    wordlist
                check the other ones
                ================================================
              */}
              <div className="list-group list-group-flush">
                {achievements.length > 0 ? (
                  achievements.map((achievement, index) => (
                    <div
                      key={index}
                      className="list-group-item d-flex align-items-center gap-3 py-3"
                    >
                      <i
                        className={`fas ${achievement.icon} ${achievement.color} fs-4`}
                      ></i>
                      <div>
                        <span className="fw-bold d-block">
                          {achievement.name}
                        </span>
                        <small className="text-muted">
                          {achievement.description}
                        </small>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-muted py-3">
                    <i className="fas fa-trophy me-2"></i>
                    Keep studying to earn awards!
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-6 mb-4">
          <div className="card h-100 shadow-sm">
            <div className="card-header bg-white py-3">
              <h5 className="mb-0 fw-bold">Study Activity</h5>
            </div>
            <div className="card-body">
              <div className="row g-4">
                <div className="col-6">
                  <div className="p-3 bg-light rounded-3 text-center dashboard-stat">
                    <h3 className="fw-bold mb-0">{studyStats.studyTime}</h3>
                    <small className="text-muted">Minutes</small>
                  </div>
                </div>
                <div className="col-6">
                  <div className="p-3 bg-light rounded-3 text-center dashboard-stat">
                    <h3 className="fw-bold mb-0">
                      {studyStats.cardsStudied.length}
                    </h3>
                    <small className="text-muted">Cards</small>
                  </div>
                </div>
                <div className="col-6">
                  <div className="p-3 bg-light rounded-3 text-center dashboard-stat">
                    <h3 className="fw-bold mb-0">
                      {studyStats.quizScores.length}
                    </h3>
                    <small className="text-muted">Quizzes</small>
                  </div>
                </div>
                <div className="col-6">
                  <div className="p-3 bg-light rounded-3 text-center dashboard-stat">
                    <h3 className="fw-bold mb-0">{avgQuizScore}%</h3>
                    <small className="text-muted">Avg Score</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-6 mb-4">
          <div className="card h-100 shadow-sm">
            <div className="card-header bg-white py-3">
              <h5 className="mb-0 fw-bold">Tools & Export</h5>
            </div>
            <div className="card-body">
              <div className="d-grid gap-3">
                <button
                  className="btn btn-outline-primary py-2"
                  onClick={exportBookmarks}
                  disabled={bookmarkedWords.length === 0}
                >
                  <i className="fas fa-download me-2"></i>
                  Download Bookmarks ({bookmarkedWords.length})
                </button>
                <button
                  className="btn btn-outline-success py-2"
                  onClick={exportMastered}
                  disabled={
                    Object.keys(masteredWords).filter(
                      (w) => masteredWords[w] >= 5,
                    ).length === 0
                  }
                >
                  <i className="fas fa-file-export me-2"></i>
                  Export Mastered Words
                </button>
                <button
                  className="btn btn-outline-info py-2"
                  onClick={() => window.print()}
                >
                  <i className="fas fa-print me-2"></i>Print Study Set
                </button>
              </div>
              <div className="mt-4 p-3 bg-primary bg-opacity-10 rounded-3 border border-primary border-opacity-25">
                <h6 className="fw-bold text-primary mb-1">Daily Streak</h6>
                <div className="d-flex align-items-center gap-3">
                  <h2 className="streak-counter mb-0">
                    {studyStats.studyStreak}
                  </h2>
                  <p className="small text-muted mb-0">
                    Keep it up! Study every day to build your streak.
                  </p>
                </div>
                <div className="d-flex gap-1 mt-3 overflow-auto pb-2">
                  {streakCalendar}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Progress;
