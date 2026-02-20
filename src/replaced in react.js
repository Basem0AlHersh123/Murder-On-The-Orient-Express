// STATE MANAGEMENT
let appState = {
  currentCardIndex: 0,
  bookmarkedWords: new Set(),
  masteredWords: {},
  studyStats: {
    cardsStudied: new Set(),
    totalFlips: 0,
    studyTime: 0,
    lastStudyDate: null,
    studyStreak: 0,
    quizScores: [],
  },
  theme: "light",
};

// DOM ELEMENTS
const elements = {
  body: document.body,
  themeToggle: document.getElementById("themeToggle"),
  navLinks: document.querySelectorAll(".nav-link"),
  sections: document.querySelectorAll(".section"),
  dailyWord: document.getElementById("dailyWord"),
  dailyWordDefinition: document.getElementById("dailyWordDefinition"),
  exampleText: document.getElementById("exampleText"),
  revealDailyExample: document.getElementById("revealDailyExample"),
  nextDailyWord: document.getElementById("nextDailyWord"),
  masteredPercent: document.getElementById("masteredPercent"),
  masteredProgress: document.getElementById("masteredProgress"),
  bookmarkedPercent: document.getElementById("bookmarkedPercent"),
  bookmarkedProgress: document.getElementById("bookmarkedProgress"),
  quizAccuracy: document.getElementById("quizAccuracy"),
  quizAccuracyProgress: document.getElementById("quizAccuracyProgress"),
  cardWord: document.getElementById("cardWord"),
  cardPartOfSpeech: document.getElementById("cardPartOfSpeech"),
  cardDifficulty: document.getElementById("cardDifficulty"),
  cardDefinition: document.getElementById("cardDefinition"),
  cardExample: document.getElementById("cardExample"),
  cardSynonyms: document.getElementById("cardSynonyms"),
  cardAntonyms: document.getElementById("cardAntonyms"),
  bookmarkCardBtn: document.getElementById("bookmarkCardBtn"),
  increaseMastery: document.getElementById("increaseMastery"),
  prevCard: document.getElementById("prevCard"),
  nextCard: document.getElementById("nextCard"),
  flipCard: document.getElementById("flipCard"),
  flashcard: document.getElementById("flashcard"),
  cardCounter: document.getElementById("cardCounter"),
  shuffleCards: document.getElementById("shuffleCards"),
  showBookmarkedOnly: document.getElementById("showBookmarkedOnly"),
  quizWord: document.getElementById("quizWord"),
  quizOptions: document.getElementById("quizOptions"),
  submitAnswer: document.getElementById("submitAnswer"),
  nextQuestion: document.getElementById("nextQuestion"),
  quizProgress: document.getElementById("quizProgress"),
  quizScore: document.getElementById("quizScore"),
  quizContent: document.getElementById("quizContent"),
  quizResults: document.getElementById("quizResults"),
  finalScore: document.getElementById("finalScore"),
  resultMessage: document.getElementById("resultMessage"),
  restartQuiz: document.getElementById("restartQuiz"),
  startNewQuiz: document.getElementById("startNewQuiz"),
  quizLength: document.getElementById("quizLength"),
  quizDifficulty: document.getElementById("quizDifficulty"),
  includeBookmarked: document.getElementById("includeBookmarked"),
  includeMastered: document.getElementById("includeMastered"),
  quizHistory: document.getElementById("quizHistory"),
  wordSearch: document.getElementById("wordSearch"),
  difficultyFilter: document.getElementById("difficultyFilter"),
  masteryFilter: document.getElementById("masteryFilter"),
  wordListContainer: document.getElementById("wordListContainer"),
  filteredWordCount: document.getElementById("filteredWordCount"),
  masteryChart: document.getElementById("masteryChart"),
  achievementCount: document.getElementById("achievementCount"),
  achievementsList: document.getElementById("achievementsList"),
  totalStudyTime: document.getElementById("totalStudyTime"),
  totalCardsReviewed: document.getElementById("totalCardsReviewed"),
  totalQuizzesTaken: document.getElementById("totalQuizzesTaken"),
  averageQuizScore: document.getElementById("averageQuizScore"),
  exportBookmarks: document.getElementById("exportBookmarks"),
  exportMastered: document.getElementById("exportMastered"),
  printFlashcards: document.getElementById("printFlashcards"),
  studyStreak: document.getElementById("studyStreak"),
  streakCalendar: document.getElementById("streakCalendar"),
};

// INITIALIZATION
document.addEventListener("DOMContentLoaded", () => {
  loadState();
  setupEventListeners();
  updateDashboard();
  initializeDailyWord();
  updateFlashcard();
  renderWordList();
  startTimer();
  updateStreakCalendar();
});

function loadState() {
  const saved = localStorage.getItem("vocabMasterState_v2");
  if (saved) {
    const parsed = JSON.parse(saved);
    appState = {
      ...appState,
      ...parsed,
      bookmarkedWords: new Set(parsed.bookmarkedWords || []),
      studyStats: {
        ...appState.studyStats,
        ...parsed.studyStats,
        cardsStudied: new Set(parsed.studyStats?.cardsStudied || []),
      },
    };
  }
  elements.body.setAttribute("data-theme", appState.theme);
  updateThemeIcon();
}

function saveState() {
  const toSave = {
    ...appState,
    bookmarkedWords: Array.from(appState.bookmarkedWords),
    studyStats: {
      ...appState.studyStats,
      cardsStudied: Array.from(appState.studyStats.cardsStudied),
    },
  };
  localStorage.setItem("vocabMasterState_v2", JSON.stringify(toSave));
}

function setupEventListeners() {
  // Theme
  elements.themeToggle.addEventListener("click", () => {
    appState.theme = appState.theme === "light" ? "dark" : "light";
    elements.body.setAttribute("data-theme", appState.theme);
    updateThemeIcon();
    saveState();
  });

  // Nav
  elements.navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      navigateTo(link.dataset.section);
    });
  });

  // Dashboard
  elements.revealDailyExample.addEventListener("click", () => {
    document.getElementById("dailyWordExample").style.display = "block";
  });
  elements.nextDailyWord.addEventListener("click", () => {
    initializeDailyWord();
    document.getElementById("dailyWordExample").style.display = "none";
  });

  // Flashcards
  elements.flashcard.addEventListener("click", flipCard);
  elements.flipCard.addEventListener("click", (e) => {
    e.stopPropagation();
    flipCard();
  });
  elements.prevCard.addEventListener("click", () => moveCard(-1));
  elements.nextCard.addEventListener("click", () => moveCard(1));
  elements.bookmarkCardBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    toggleBookmark(vocabularyData[appState.currentCardIndex].word);
    updateFlashcard();
  });
  elements.increaseMastery.addEventListener("click", (e) => {
    e.stopPropagation();
    increaseMastery(vocabularyData[appState.currentCardIndex].word);
    updateFlashcard();
  });

  // Quiz
  elements.startNewQuiz.addEventListener("click", startQuiz);
  elements.submitAnswer.addEventListener("click", submitAnswer);
  elements.nextQuestion.addEventListener("click", nextQuestion);
  elements.restartQuiz.addEventListener("click", startQuiz);

  // Word List
  elements.wordSearch.addEventListener("input", renderWordList);
  elements.difficultyFilter.addEventListener("change", renderWordList);
  elements.masteryFilter.addEventListener("change", renderWordList);

  // Export
  elements.exportBookmarks.addEventListener("click", () =>
    exportData("bookmarks"),
  );
  elements.exportMastered.addEventListener("click", () =>
    exportData("mastered"),
  );
  elements.printFlashcards.addEventListener("click", () => window.print());
}
//+=================================================================================================================================
// you stopped right here where you were trying to put this function in the main.jsx or in app.jsx so that you can navigate.
// I think I should use link instead of this function.
//+=================================================================================================================================
function navigateTo(sectionId) {
  elements.sections.forEach((s) => s.classList.remove("active"));
  elements.navLinks.forEach((l) => {
    l.classList.toggle("active", l.dataset.section === sectionId);
  });
  document.getElementById(sectionId).classList.add("active");
  window.scrollTo(0, 0);

  if (sectionId === "progress") updateProgressSection();
  if (sectionId === "wordlist") renderWordList();
}

function updateThemeIcon() {
  const icon = elements.themeToggle.querySelector("i");
  icon.className = appState.theme === "dark" ? "fas fa-sun" : "fas fa-moon";
}

// DASHBOARD LOGIC
function initializeDailyWord() {
  const word =
    vocabularyData[Math.floor(Math.random() * vocabularyData.length)];
  elements.dailyWord.textContent = word.word;
  elements.dailyWordDefinition.textContent = word.definition;
  elements.exampleText.textContent = word.example;
}

function updateDashboard() {
  const masteredCount = Object.keys(appState.masteredWords).filter(
    (w) => appState.masteredWords[w] >= 5,
  ).length;
  const masteredPct = Math.round((masteredCount / vocabularyData.length) * 100);
  elements.masteredPercent.textContent = masteredPct + "%";
  elements.masteredProgress.style.width = masteredPct + "%";

  const bookmarkedPct = Math.round(
    (appState.bookmarkedWords.size / vocabularyData.length) * 100,
  );
  elements.bookmarkedPercent.textContent = bookmarkedPct + "%";
  elements.bookmarkedProgress.style.width = bookmarkedPct + "%";

  const scores = appState.studyStats.quizScores;
  const avgAccuracy = scores.length
    ? Math.round(scores.reduce((a, b) => a + b.accuracy, 0) / scores.length)
    : 0;
  elements.quizAccuracy.textContent = avgAccuracy + "%";
  elements.quizAccuracyProgress.style.width = avgAccuracy + "%";

  elements.studyStreak.textContent = appState.studyStats.studyStreak;
}

// FLASHCARD LOGIC
function updateFlashcard() {
  const word = vocabularyData[appState.currentCardIndex];
  elements.cardWord.textContent = word.word;
  elements.cardPartOfSpeech.textContent = word.part_of_speech;
  elements.cardDifficulty.textContent = word.difficulty;
  elements.cardDefinition.textContent = word.definition;
  elements.cardExample.textContent = word.example;
  elements.cardSynonyms.textContent = word.synonyms;
  elements.cardAntonyms.textContent = word.antonyms;
  elements.cardCounter.textContent = `Card ${appState.currentCardIndex + 1} of ${vocabularyData.length}`;

  const isBookmarked = appState.bookmarkedWords.has(word.word);
  elements.bookmarkCardBtn.innerHTML = isBookmarked
    ? '<i class="fas fa-bookmark me-2"></i>Bookmarked'
    : '<i class="far fa-bookmark me-2"></i>Bookmark';
  elements.bookmarkCardBtn.className = isBookmarked
    ? "btn btn-outline-warning rounded-pill active"
    : "btn btn-outline-warning rounded-pill";

  const mastery = appState.masteredWords[word.word] || 0;
  const indicators = document.querySelectorAll(
    "#masteryIndicators .mastery-indicator",
  );
  indicators.forEach((ind, i) => ind.classList.toggle("active", i < mastery));

  appState.studyStats.cardsStudied.add(word.word);
  saveState();
}

function flipCard() {
  elements.flashcard.classList.toggle("flipped");
  if (elements.flashcard.classList.contains("flipped")) {
    appState.studyStats.totalFlips++;
    saveState();
  }
}

function moveCard(dir) {
  appState.currentCardIndex =
    (appState.currentCardIndex + dir + vocabularyData.length) %
    vocabularyData.length;
  elements.flashcard.classList.remove("flipped");
  setTimeout(updateFlashcard, 150);
}

function toggleBookmark(word) {
  if (appState.bookmarkedWords.has(word)) appState.bookmarkedWords.delete(word);
  else appState.bookmarkedWords.add(word);
  updateDashboard();
  saveState();
}

function increaseMastery(word) {
  const current = appState.masteredWords[word] || 0;
  if (current < 5) {
    appState.masteredWords[word] = current + 1;
    updateDashboard();
    saveState();
  }
}

// QUIZ LOGIC
let currentQuiz = null;

function startQuiz() {
  const length = parseInt(elements.quizLength.value);
  const diff = elements.quizDifficulty.value;
  let pool = vocabularyData;

  if (diff !== "all") pool = pool.filter((w) => w.difficulty === diff);
  if (!elements.includeBookmarked.checked)
    pool = pool.filter((w) => !appState.bookmarkedWords.has(w.word));
  if (!elements.includeMastered.checked)
    pool = pool.filter((w) => (appState.masteredWords[w.word] || 0) < 5);

  if (pool.length < 4) {
    alert("Not enough words match your filters. Try broadening your settings.");
    return;
  }

  const shuffled = [...pool].sort(() => 0.5 - Math.random()).slice(0, length);
  currentQuiz = {
    questions: shuffled.map((w) => ({
      word: w.word,
      correct: w.definition,
      options: generateOptions(w.definition, pool),
    })),
    index: 0,
    score: 0,
  };

  elements.quizResults.style.display = "none";
  elements.quizContent.style.display = "block";
  showQuestion();
}

function generateOptions(correct, pool) {
  const options = [correct];
  const others = pool.filter((w) => w.definition !== correct);
  const shuffledOthers = others.sort(() => 0.5 - Math.random());
  for (let i = 0; i < 3 && i < shuffledOthers.length; i++) {
    options.push(shuffledOthers[i].definition);
  }
  return options.sort(() => 0.5 - Math.random());
}

function showQuestion() {
  const q = currentQuiz.questions[currentQuiz.index];
  elements.quizWord.textContent = q.word;
  elements.quizProgress.textContent = `Question ${currentQuiz.index + 1} of ${currentQuiz.questions.length}`;
  elements.quizScore.textContent = `Score: ${currentQuiz.score}/${currentQuiz.index}`;

  elements.quizOptions.innerHTML = "";
  q.options.forEach((opt) => {
    const div = document.createElement("div");
    div.className = "quiz-option";
    div.textContent = opt;
    div.onclick = () => selectOption(div);
    elements.quizOptions.appendChild(div);
  });

  elements.submitAnswer.style.display = "inline-block";
  elements.submitAnswer.disabled = true;
  elements.nextQuestion.style.display = "none";
}

function selectOption(el) {
  document
    .querySelectorAll(".quiz-option")
    .forEach((opt) => opt.classList.remove("selected"));
  el.classList.add("selected");
  elements.submitAnswer.disabled = false;
}

function submitAnswer() {
  const selected = document.querySelector(".quiz-option.selected");
  const q = currentQuiz.questions[currentQuiz.index];
  const isCorrect = selected.textContent === q.correct;

  document.querySelectorAll(".quiz-option").forEach((opt) => {
    opt.onclick = null;
    if (opt.textContent === q.correct) opt.classList.add("correct");
    else if (opt.classList.contains("selected")) opt.classList.add("incorrect");
  });

  if (isCorrect) currentQuiz.score++;

  elements.submitAnswer.style.display = "none";
  elements.nextQuestion.style.display = "inline-block";
  elements.quizScore.textContent = `Score: ${currentQuiz.score}/${currentQuiz.index + 1}`;
}

function nextQuestion() {
  currentQuiz.index++;
  if (currentQuiz.index < currentQuiz.questions.length) {
    showQuestion();
  } else {
    showResults();
  }
}

function showResults() {
  elements.quizContent.style.display = "none";
  elements.quizResults.style.display = "block";
  const accuracy = Math.round(
    (currentQuiz.score / currentQuiz.questions.length) * 100,
  );
  elements.finalScore.textContent = `${currentQuiz.score}/${currentQuiz.questions.length}`;
  elements.resultMessage.textContent =
    accuracy >= 80
      ? "Excellent! You're a master!"
      : accuracy >= 50
        ? "Good job! Keep practicing."
        : "Keep studying, you'll get there!";

  appState.studyStats.quizScores.push({
    date: new Date().toLocaleDateString(),
    score: currentQuiz.score,
    total: currentQuiz.questions.length,
    accuracy: accuracy,
  });
  updateQuizHistory();
  updateDashboard();
  saveState();
}

function updateQuizHistory() {
  const history = appState.studyStats.quizScores.slice(-5).reverse();
  if (!history.length) return;

  elements.quizHistory.innerHTML = history
    .map(
      (q) => `
	                <div class="d-flex justify-content-between align-items-center mb-2 p-2 bg-light rounded border">
	                    <div><small class="text-muted">${q.date}</small></div>
                    <div class="fw-bold">${q.score}/${q.total}</div>
                    <div class="badge ${q.accuracy >= 70 ? "bg-success" : "bg-warning"}">${q.accuracy}%</div>
                </div>
            `,
    )
    .join("");
}

// WORD LIST LOGIC
function renderWordList() {
  const search = elements.wordSearch.value.toLowerCase();
  const diff = elements.difficultyFilter.value;
  const mastery = elements.masteryFilter.value;

  const filtered = vocabularyData.filter((w) => {
    const matchesSearch =
      w.word.toLowerCase().includes(search) ||
      w.definition.toLowerCase().includes(search);
    const matchesDiff = diff === "all" || w.difficulty === diff;
    const mLevel = appState.masteredWords[w.word] || 0;
    const matchesMastery =
      mastery === "all" ||
      (mastery === "bookmarked" && appState.bookmarkedWords.has(w.word)) ||
      (mastery === "mastered" && mLevel >= 5) ||
      (mastery === "unmastered" && mLevel < 5);
    return matchesSearch && matchesDiff && matchesMastery;
  });

  elements.filteredWordCount.textContent = `${filtered.length} words`;
  elements.wordListContainer.innerHTML = filtered
    .map((w) => {
      const isBookmarked = appState.bookmarkedWords.has(w.word);
      const mLevel = appState.masteredWords[w.word] || 0;
      return `
	                    <div class="word-item ${isBookmarked ? "bookmarked" : ""} ${mLevel >= 5 ? "mastered" : ""} border">
	                        <div class="d-flex justify-content-between align-items-start">
                            <div onclick="this.parentElement.nextElementSibling.classList.toggle('expanded')" style="cursor:pointer; flex-grow:1">
                                <h5 class="fw-bold mb-1">${w.word} <span class="badge bg-light text-muted small">${w.part_of_speech}</span></h5>
                                <p class="mb-0 text-muted">${w.definition}</p>
                            </div>
                            <div class="d-flex gap-2">
                                <button class="btn btn-sm ${isBookmarked ? "btn-warning" : "btn-outline-warning"}" onclick="toggleBookmark('${w.word}'); renderWordList();">
                                    <i class="${isBookmarked ? "fas" : "far"} fa-bookmark"></i>
                                </button>
                            </div>
                        </div>
                        <div class="word-details">
                            <div class="row g-3">
                                <div class="col-md-6">
                                    <p class="small mb-1 fw-bold text-primary">Example</p>
                                    <p class="small fst-italic">"${w.example}"</p>
                                </div>
                                <div class="col-md-6">
                                    <p class="small mb-1 fw-bold text-primary">Synonyms / Antonyms</p>
                                    <p class="small mb-0">S: ${w.synonyms}</p>
                                    <p class="small">A: ${w.antonyms}</p>
                                </div>
                            </div>
                            <div class="d-flex justify-content-between align-items-center mt-2">
                                <span class="badge bg-info">${w.difficulty}</span>
                                <div class="d-flex align-items-center gap-2">
                                    <small class="text-muted">Mastery: ${mLevel}/5</small>
                                    <button class="btn btn-sm btn-outline-success" onclick="increaseMastery('${w.word}'); renderWordList();" ${mLevel >= 5 ? "disabled" : ""}>
                                        <i class="fas fa-plus"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
    })
    .join("");
}

// PROGRESS LOGIC
let masteryChart = null;
function updateProgressSection() {
  elements.totalStudyTime.textContent = appState.studyStats.studyTime;
  elements.totalCardsReviewed.textContent =
    appState.studyStats.cardsStudied.size;
  elements.totalQuizzesTaken.textContent =
    appState.studyStats.quizScores.length;

  const scores = appState.studyStats.quizScores;
  const avg = scores.length
    ? Math.round(scores.reduce((a, b) => a + b.accuracy, 0) / scores.length)
    : 0;
  elements.averageQuizScore.textContent = avg + "%";

  // Achievements
  const achievements = [];
  if (appState.studyStats.cardsStudied.size >= 10)
    achievements.push({
      name: "Novice Learner",
      icon: "fa-seedling",
      color: "text-success",
    });
  if (appState.studyStats.cardsStudied.size >= 40)
    achievements.push({
      name: "Dedicated Student",
      icon: "fa-book",
      color: "text-primary",
    });
  if (
    Object.keys(appState.masteredWords).filter(
      (w) => appState.masteredWords[w] >= 5,
    ).length >= 5
  )
    achievements.push({
      name: "Word Master",
      icon: "fa-crown",
      color: "text-warning",
    });
  if (appState.studyStats.studyStreak >= 3)
    achievements.push({
      name: "On Fire!",
      icon: "fa-fire",
      color: "text-danger",
    });

  elements.achievementCount.textContent = `${achievements.length} Earned`;
  elements.achievementsList.innerHTML =
    achievements
      .map(
        (a) => `
                <div class="list-group-item d-flex align-items-center gap-3 py-3">
                    <i class="fas ${a.icon} ${a.color} fs-4"></i>
                    <span class="fw-bold">${a.name}</span>
                </div>
            `,
      )
      .join("") ||
    '<p class="text-center text-muted py-3">Keep studying to earn awards!</p>';

  // Chart
  const distribution = [0, 0, 0, 0, 0, 0];
  vocabularyData.forEach((w) => {
    const level = appState.masteredWords[w.word] || 0;
    distribution[level]++;
  });

  if (masteryChart) masteryChart.destroy();
  const ctx = elements.masteryChart.getContext("2d");
  const isDark = appState.theme === "dark";
  Chart.defaults.color = isDark ? "#e1e1e1" : "#666";
  Chart.defaults.borderColor = isDark ? "#444" : "#ddd";

  masteryChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["Lvl 0", "Lvl 1", "Lvl 2", "Lvl 3", "Lvl 4", "Lvl 5"],
      datasets: [
        {
          label: "Words",
          data: distribution,
          backgroundColor: [
            "#95a5a6",
            "#3498db",
            "#9b59b6",
            "#2ecc71",
            "#f1c40f",
            "#e67e22",
          ],
          borderRadius: 8,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: { y: { beginAtZero: true, ticks: { precision: 0 } } },
    },
  });
}

function updateStreakCalendar() {
  const container = elements.streakCalendar;
  container.innerHTML = "";
  const today = new Date();
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(today.getDate() - i);
    const dayName = d.toLocaleDateString("en-US", { weekday: "short" });
    const isToday = i === 0;
    container.innerHTML += `
                    <div class="text-center" style="min-width: 45px">
                        <div class="small text-muted mb-1">${dayName}</div>
                        <div class="rounded-circle ${isToday ? "bg-primary text-white" : "bg-light"} d-flex align-items-center justify-content-center fw-bold" style="width: 35px; height: 35px; margin: 0 auto">
                            ${d.getDate()}
                        </div>
                    </div>
                `;
  }
}

// UTILS
function startTimer() {
  setInterval(() => {
    appState.studyStats.studyTime++;
    if (elements.totalStudyTime)
      elements.totalStudyTime.textContent = appState.studyStats.studyTime;

    const today = new Date().toDateString();
    if (appState.studyStats.lastStudyDate !== today) {
      const last = new Date(appState.studyStats.lastStudyDate);
      const diff = (new Date(today) - last) / (1000 * 60 * 60 * 24);
      if (diff === 1) appState.studyStats.studyStreak++;
      else if (diff > 1 || !appState.studyStats.lastStudyDate)
        appState.studyStats.studyStreak = 1;
      appState.studyStats.lastStudyDate = today;
      updateDashboard();
    }
    saveState();
  }, 60000);
}

function exportData(type) {
  let content = "";
  if (type === "bookmarks") {
    content =
      "MY BOOKMARKED WORDS\n" + Array.from(appState.bookmarkedWords).join("\n");
  } else {
    content =
      "MY MASTERED WORDS\n" +
      Object.keys(appState.masteredWords)
        .filter((w) => appState.masteredWords[w] >= 5)
        .join("\n");
  }
  const blob = new Blob([content], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `vocab_${type}.txt`;
  a.click();
}
