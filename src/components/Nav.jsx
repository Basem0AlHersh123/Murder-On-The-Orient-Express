import { Link } from "react-router-dom";
import { useState, useEffect } from "react"; // Add this import
// import {Cookies }from'../cookies.js';
function NavigationBar() {
  
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    
    if (newMode) {
      document.body.classList.add('dark-mode');
      localStorage.setItem('theme', 'dark');
    } else {
      document.body.classList.remove('dark-mode');
      localStorage.setItem('theme', 'light');
    }
  };
 
  // Check for saved theme on component mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      document.body.classList.add('dark-mode');
      setIsDarkMode(true);
    }
  }, []);

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid">
        <Link to="/" className="fw-bold navbar-brand">
          <i className="bi bi-airplane me-2"></i>
          TravelExplorer
        </Link>

        <button 
          type="button" 
          className="navbar-toggler"
          data-bs-toggle="collapse" 
          data-bs-target="#navbarCollapse"
          aria-controls="navbarCollapse"
          aria-expanded='false'
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        
        <div id="navbarCollapse" className="collapse navbar-collapse">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0 ">
            <li className="nav-item">
              <Link to="/" className="nav-link" aria-current='page'>
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/destination" className="nav-link">
                Destination
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/blog" className="nav-link">
                Blog
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/about" className="nav-link">
                About
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/contact" className="nav-link">
                Contact
              </Link>
            </li>
          </ul>
          
          <form className="d-flex me-3">
            <input
              className="form-control me-2"
              type="search"
              placeholder="destinations..."
              aria-label="Search"
            />
            <button
              className="btn btn-outline-light"
              type="submit"
            >
              🔍
            </button>
          </form>
          
          <Link to="/signin" className="btn btn-outline-warning me-2">
            <i className="bi bi-person me-2"></i>
            Sign In
          </Link>
          
          <button 
            onClick={toggleDarkMode}
            className="btn btn-outline-light"
            aria-label="Toggle dark mode"
          >
            {isDarkMode ? (
              <>
                <i className="bi bi-sun me-2"></i>
                Light Mode
              </>
            ) : (
              <>
                <i className="bi bi-moon me-2"></i>
                Dark Mode
              </>
            )}
          </button>
        </div>
      </div>
    </nav>
      
  );
}

export default NavigationBar;