import profile_image from '../assets/profile_image.png'
import React from 'react'
import { Link  } from 'react-router-dom'

const About = () => {
  return (
    <section id="about" className="section">
        <div className="row mb-5">
          <div className="col-lg-4 mb-4">
            <div className="card shadow-lg border-0 text-center p-4">
              <div className="mb-4">
                <div
                  className="rounded-circle bg-primary bg-opacity-10 d-flex align-items-center justify-content-center mx-auto shadow-sm"
                  style={{
                    width: '200px',
                    height: '200px',
                    border: '5px solid var(--card-bg)',
                    overflow: 'hidden'}}
                >
                  <img
                    src={profile_image}
                    alt="my Image"
                    srcSet=""
                    className="w-75"
                  />
                </div>
              </div>
              <h3 className="fw-bold mb-1">Basem Mohammed Ali Al-Hersh</h3>
              <p className="text-primary fw-medium mb-3">
                IT Student | Ethical Hacking Enthusiast
              </p>
              <div className="d-flex justify-content-center gap-3 mb-4">
                <Link
                  to="mailto:alhrshbasm4@gmail.com"
                  className="btn btn-sm btn-outline-primary rounded-circle"
                  ><i className="fas fa-envelope">
                    </i>
                    </Link>
                <Link
                  to="https://linkedin.com/in/basem-alhersh-769179397"
                  target="_blank"
                  className="btn btn-sm btn-outline-primary rounded-circle"
                  ><i className="fab fa-linkedin-in"></i></Link>
                <Link
                  to="https://github.com/Basem0AlHersh123"
                  target="_blank"
                  className="btn btn-sm btn-outline-primary rounded-circle"
                  ><i className="fab fa-github"></i>
                  </Link>
                <Link
                  to="https://t.me/Basem0AlHersh"
                  target="_blank"
                  className="btn btn-sm btn-outline-primary rounded-circle"
                  ><i className="fab fa-telegram-plane"></i>
                  </Link>
              </div>
              <div className="text-start border-top pt-3">
                <h6 className="fw-bold mb-2">Contact Details</h6>
                <p className="small mb-1">
                  <i className="fas fa-phone-alt me-2 text-primary"></i> +967 773
                  022 084
                </p>
                <p className="small mb-0">
                  <i className="fas fa-envelope me-2 text-primary"></i>
                  alhrshbasm4@gmail.com
                </p>
              </div>
            </div>
          </div>
          <div className="col-lg-8">
            <div className="card shadow-sm border-0 p-4 mb-4">
              <h2 className="fw-bold mb-4 border-bottom pb-2">
                Professional Summary
              </h2>
              <p className="lead">
                Highly motivated and results-driven Information Technology
                student with a strong foundation in Python development,
                networking, and system analysis.
              </p>
              <p>
                Currently in my Sophomore Year, I am seeking to leverage my
                skills in a challenging technical environment, with a particular
                focus on <strong>ethical hacking and cybersecurity</strong>. I
                have a proven ability to rapidly acquire new technical skills,
                demonstrated by the completion of over 60 personal projects and
                multiple professional certifications.
              </p>
            </div>

            <div className="row">
              <div className="col-md-6 mb-4">
                <div className="card h-100 shadow-sm border-0 p-4">
                  <h4 className="fw-bold mb-3 text-primary">
                    <i className="fas fa-briefcase me-2"></i>Experience
                  </h4>
                  <div className="mb-3">
                    <h6 className="fw-bold mb-0">Programming Assistant</h6>
                    <small className="text-muted">Sana'a University</small>
                    <p className="small mt-1">
                      Assisted with C++ and English language instruction at the
                      university level.
                    </p>
                  </div>
                  <div className="mb-3">
                    <h6 className="fw-bold mb-0">English Teacher</h6>
                    <small className="text-muted"
                      >Egra School | Technical Industrial Institute</small>
                    <p className="small mt-1">
                      Conducted lessons focused on English conversation and
                      fluency.
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-md-6 mb-4">
                <div className="card h-100 shadow-sm border-0 p-4">
                  <h4 className="fw-bold mb-3 text-primary">
                    <i className="fas fa-code me-2"></i>Technical Skills
                  </h4>
                  <div className="mb-2">
                    <span className="badge bg-primary me-1 mb-1"
                      >Python Development</span>
                    <span className="badge bg-primary me-1 mb-1"
                      >Ethical Hacking</span>
                    <span className="badge bg-primary me-1 mb-1">Networking</span>
                    <span className="badge bg-primary me-1 mb-1"
                      >System Analysis</span>
                    <span className="badge bg-primary me-1 mb-1">HTML/CSS</span>
                    <span className="badge bg-primary me-1 mb-1">C++</span>
                  </div>
                  <h6 className="fw-bold mt-3 mb-2">Languages</h6>
                  <p className="small mb-1"><strong>Arabic:</strong> Native</p>
                  <p className="small mb-0">
                    <strong>English:</strong> Fluent (TESOL Certified)
                  </p>
                </div>
              </div>
            </div>

            <div className="card shadow-sm border-0 p-4">
              <h4 className="fw-bold mb-3 text-primary">
                <i className="fas fa-project-diagram me-2"></i>Key Projects
              </h4>
              <div className="list-group list-group-flush">
                <div className="list-group-item px-0 bg-transparent">
                  <h6 className="fw-bold mb-1">Vocabulary Master Pro</h6>
                  <p className="small mb-0">
                    A comprehensive web application for mastering English
                    vocabulary with flashcards, quizzes, and progress tracking.
                  </p>
                </div>
                <div className="list-group-item px-0 bg-transparent">
                  <h6 className="fw-bold mb-1">60+ Mini Projects</h6>
                  <p className="small mb-0">
                    A diverse portfolio of small-scale projects built with
                    Python, HTML, and CSS.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
  )
}

export default About
