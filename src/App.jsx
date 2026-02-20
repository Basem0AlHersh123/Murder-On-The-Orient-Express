// 📁 src/App.jsx
import Nav from "./components/Nav.jsx";
import Footer from "./components/Footer.jsx";
import About from "./pages/About.jsx";
import WordList from "./pages/WordList.jsx";
import Progress from "./pages/Progress.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Flashcards from "./pages/Flashcards.jsx";
import Quiz from "./pages/Quiz.jsx";
import { Routes, Route } from "react-router-dom";
import React from "react";

import { VocabProvider } from "./context/VocabContext";
// import TestContext from './components/TestContext.jsx';
function App() {
  return (
    <VocabProvider value="light">
      <Nav />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/about" element={<About />} />
        <Route path="/wordlist" element={<WordList />} />
        <Route path="/flashcards" element={<Flashcards />} />
        <Route path="/quiz" element={<Quiz />} />
        <Route path="/progress" element={<Progress />} />
      </Routes>
      {/* <TestContext/> */}
      <Footer />
    </VocabProvider>
  );
}

export default App;
