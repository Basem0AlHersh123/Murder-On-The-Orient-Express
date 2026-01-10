// 📁 src/components/Footer.jsx
// import React from 'react';
// import { Container, Row, col } from 'react-bootstrap';

function Footer() {
  return (
    <footer className="bg-dark text-light mt-5 pt-5">
      <div className="container">
        <div className="row">
          <div className="col-md-4">
            <h4 className="mb-4">
              <i className="bi bi-airplane me-2 text-warning"></i>
              TravelExplorer
            </h4>
            <p className="text-muted">
              Your gateway to unforgettable adventures around the world. 
              We make travel planning easy and exciting.
            </p>
            <div className="social-icons mt-4">
              <a href="#" className="text-light me-3 fs-4">
                <i className="bi bi-facebook"></i>
              </a>
              <a href="#" className="text-light me-3 fs-4">
                <i className="bi bi-twitter"></i>
              </a>
              <a href="#" className="text-light me-3 fs-4">
                <i className="bi bi-instagram"></i>
              </a>
              <a href="#" className="text-light fs-4">
                <i className="bi bi-youtube"></i>
              </a>
            </div>
          </div>
          
          <div className="col-md-2">
            <h5 className="mb-4">Quick Links</h5>
            <ul className="list-unstyled">
              <li className="mb-2"><a href="#" className="text-light text-decoration-none">Home</a></li>
              <li className="mb-2"><a href="#" className="text-light text-decoration-none">Destinations</a></li>
              <li className="mb-2"><a href="#" className="text-light text-decoration-none">Blog</a></li>
              <li className="mb-2"><a href="#" className="text-light text-decoration-none">About Us</a></li>
            </ul>
          </div>
          
          <div className="col-md-2">
            <h5 className="mb-4">Services</h5>
            <ul className="list-unstyled">
              <li className="mb-2"><a href="#" className="text-light text-decoration-none">Flight Booking</a></li>
              <li className="mb-2"><a href="#" className="text-light text-decoration-none">Hotel Reservations</a></li>
              <li className="mb-2"><a href="#" className="text-light text-decoration-none">Tour Packages</a></li>
              <li className="mb-2"><a href="#" className="text-light text-decoration-none">Travel Insurance</a></li>
            </ul>
          </div>
          
          <div className="col-md-4">
            <h5 className="mb-4">Newsletter</h5>
            <p className="text-muted">Subscribe for travel tips and exclusive deals!</p>
            <div className="input-group mb-3">
              <input 
                type="email" 
                className="form-control" 
                placeholder="Your email address" 
              />
              <button className="btn btn-warning" type="button">
                Subscribe
              </button>
            </div>
            <p className="text-muted small">
              <i className="bi bi-envelope me-2"></i>
              contact@travelexplorer.com
            </p>
            <p className="text-muted small">
              <i className="bi bi-telephone me-2"></i>
              +1 (555) 123-4567
            </p>
          </div>
        </div>
        
        <hr className="my-5" />
        
        <div className="text-center row">
          <div className="col">
            <p className="text-muted mb-0">
              &copy; 2024 TravelExplorer. All rights reserved. | 
              <a href="#" className="text-light text-decoration-none ms-2">Privacy Policy</a> | 
              <a href="#" className="text-light text-decoration-none ms-2">Terms of Service</a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;