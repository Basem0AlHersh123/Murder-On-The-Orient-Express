import React from 'react'
import { Link } from 'react-router-dom'
const Footer = () => {
  return (
    <footer className="mt-auto">
      <div className="container text-center">
        <h5 className="fw-bold mb-3">VocabMaster Pro</h5>
        <p className="text-muted mb-4">
          The ultimate tool for mastering English vocabulary, developed by Basem
          Al-Hersh.
        </p>
        <div className="d-flex justify-content-center gap-3 mb-4">
          <Link
            to="https://github.com/Basem0AlHersh123"
            target="_blank"
            className="text-muted fs-4"
            ><i className="fab fa-github"></i></Link>
          <Link
            to="https://linkedin.com/in/basem-alhersh-769179397"
            target="_blank"
            className="text-muted fs-4"
            ><i className="fab fa-linkedin"></i></Link>
          <Link to="mailto:alhrshbasm4@gmail.com" className="text-muted fs-4"
            ><i className="fas fa-envelope"></i></Link>
        </div>
        <p className="small text-muted mb-0">
          &copy; 2026 VocabMaster Pro. All data stored locally in your browser.
        </p>
      </div>
    </footer>

  )
}

export default Footer
