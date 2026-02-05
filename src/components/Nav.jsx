// src/components/nav.jsx
import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useVocab } from '../context/VocabContext'

const Nav = () => {
  const { theme, toggleTheme } = useVocab()
  const location = useLocation()

  return (
    <nav className="navbar navbar-expand-lg navbar-light sticky-top">
      <div className="container">
        <Link className="navbar-brand" to="/">
          <i className="fas fa-book-open me-2"></i>VocabMaster Pro
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link 
                className={`nav-link ${location.pathname === '/' ? 'active' : ''}`} 
                to="/"
              >
                <i className="fas fa-home me-1"></i>Dashboard
              </Link>
            </li>
            <li className="nav-item">
              <Link 
                className={`nav-link ${location.pathname === '/flashcards' ? 'active' : ''}`} 
                to="/flashcards"
              >
                <i className="fas fa-layer-group me-1"></i>Flashcards
              </Link>
            </li>
            <li className="nav-item">
              <Link 
                className={`nav-link ${location.pathname === '/quiz' ? 'active' : ''}`} 
                to="/quiz"
              >
                <i className="fas fa-question-circle me-1"></i>Quiz
              </Link>
            </li>
            <li className="nav-item">
              <Link 
                className={`nav-link ${location.pathname === '/wordlist' ? 'active' : ''}`} 
                to="/wordlist"
              >
                <i className="fas fa-list-ul me-1"></i>Word List
              </Link>
            </li>
            <li className="nav-item">
              <Link 
                className={`nav-link ${location.pathname === '/progress' ? 'active' : ''}`} 
                to="/progress"
              >
                <i className="fas fa-chart-line me-1"></i>Progress
              </Link>
            </li>
            <li className="nav-item">
              <Link 
                className={`nav-link ${location.pathname === '/about' ? 'active' : ''}`} 
                to="/about"
              >
                <i className="fas fa-user-tie me-1"></i>About Us
              </Link>
            </li>
          </ul>

          <div className="theme-toggle ms-lg-4" onClick={toggleTheme} title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}>
            <i className={`fas ${theme === 'dark' ? 'fa-sun' : 'fa-moon'}`}></i>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Nav