// 📁 src/components/Contact.jsx
function Contact() {
  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Message sent successfully! We\'ll get back to you soon.');
  };

  return (
    <div className="contact-page">
      {/* Hero Section */}
      <div className="bg-primary text-white py-5">
        <div className="container text-center">
          <h1 className="display-4 fw-bold">Get in Touch</h1>
          <p className="lead">We'd love to hear from you. Send us a message!</p>
        </div>
      </div>

      <div className="container my-5">
        <div className="row g-5">
          {/* Left: Contact Info */}
          <div className="col-lg-5">
            <div className="card border-0 shadow-lg h-100">
              <div className="card-body p-5">
                <h3 className="fw-bold mb-4">Contact Information</h3>
                
                <div className="d-flex align-items-start mb-4">
                  <div className="bg-primary bg-opacity-10 p-3 rounded-circle me-3">
                    <i className="bi bi-geo-alt text-primary fs-4"></i>
                  </div>
                  <div>
                    <h5 className="fw-bold">Our Office</h5>
                    <p className="text-muted mb-0">123 Travel Street,</p>
                    <p className="text-muted">Adventure City, AC 10001</p>
                  </div>
                </div>

                <div className="d-flex align-items-start mb-4">
                  <div className="bg-success bg-opacity-10 p-3 rounded-circle me-3">
                    <i className="bi bi-telephone text-success fs-4"></i>
                  </div>
                  <div>
                    <h5 className="fw-bold">Phone Number</h5>
                    <p className="text-muted mb-0">+1 (555) 123-4567</p>
                    <p className="text-muted">Mon-Fri, 9am-6pm</p>
                  </div>
                </div>

                <div className="d-flex align-items-start mb-4">
                  <div className="bg-warning bg-opacity-10 p-3 rounded-circle me-3">
                    <i className="bi bi-envelope text-warning fs-4"></i>
                  </div>
                  <div>
                    <h5 className="fw-bold">Email Address</h5>
                    <p className="text-muted mb-0">info@travelexplorer.com</p>
                    <p className="text-muted">support@travelexplorer.com</p>
                  </div>
                </div>

                <div className="d-flex align-items-start">
                  <div className="bg-info bg-opacity-10 p-3 rounded-circle me-3">
                    <i className="bi bi-clock text-info fs-4"></i>
                  </div>
                  <div>
                    <h5 className="fw-bold">Working Hours</h5>
                    <p className="text-muted mb-0">Monday - Friday: 9AM - 6PM</p>
                    <p className="text-muted">Saturday: 10AM - 4PM</p>
                    <p className="text-muted">Sunday: Closed</p>
                  </div>
                </div>

                <div className="mt-5">
                  <h5 className="fw-bold mb-3">Follow Us</h5>
                  <div className="d-flex gap-3">
                    <a href="#" className="btn btn-outline-primary btn-lg rounded-circle">
                      <i className="bi bi-facebook"></i>
                    </a>
                    <a href="#" className="btn btn-outline-info btn-lg rounded-circle">
                      <i className="bi bi-twitter"></i>
                    </a>
                    <a href="#" className="btn btn-outline-danger btn-lg rounded-circle">
                      <i className="bi bi-instagram"></i>
                    </a>
                    <a href="#" className="btn btn-outline-primary btn-lg rounded-circle">
                      <i className="bi bi-linkedin"></i>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Contact Form */}
          <div className="col-lg-7">
            <div className="card border-0 shadow-lg">
              <div className="card-body p-5">
                <h3 className="fw-bold mb-4">Send us a Message</h3>
                <p className="text-muted mb-4">Fill out the form below and we'll get back to you as soon as possible.</p>
                
                <form onSubmit={handleSubmit}>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label htmlFor="firstName" className="form-label fw-bold">First Name *</label>
                      <input 
                        type="text" 
                        className="form-control form-control-lg" 
                        id="firstName" 
                        required 
                        placeholder="John"
                      />
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="lastName" className="form-label fw-bold">Last Name *</label>
                      <input 
                        type="text" 
                        className="form-control form-control-lg" 
                        id="lastName" 
                        required 
                        placeholder="Doe"
                      />
                    </div>
                  </div>

                  <div className="mt-3">
                    <label htmlFor="email" className="form-label fw-bold">Email Address *</label>
                    <input 
                      type="email" 
                      className="form-control form-control-lg" 
                      id="email" 
                      required 
                      placeholder="john@example.com"
                    />
                  </div>

                  <div className="mt-3">
                    <label htmlFor="subject" className="form-label fw-bold">Subject *</label>
                    <select className="form-select form-select-lg" id="subject" required>
                      <option value="">Select a subject</option>
                      <option value="general">General Inquiry</option>
                      <option value="booking">Booking Assistance</option>
                      <option value="feedback">Feedback</option>
                      <option value="support">Technical Support</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div className="mt-3">
                    <label htmlFor="message" className="form-label fw-bold">Message *</label>
                    <textarea 
                      className="form-control form-control-lg" 
                      id="message" 
                      rows="6" 
                      required 
                      placeholder="Type your message here..."
                    ></textarea>
                  </div>

                  <div className="form-check mt-4">
                    <input className="form-check-input" type="checkbox" id="newsletter" />
                    <label className="form-check-label text-muted" htmlFor="newsletter">
                      Subscribe to our newsletter for travel tips and exclusive offers
                    </label>
                  </div>

                  <button type="submit" className="btn btn-primary btn-lg w-100 mt-4 py-3">
                    <i className="bi bi-send me-2"></i>
                    Send Message
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>

        {/* Map Section */}
        <div className="row mt-5">
          <div className="col-12">
            <div className="card border-0 shadow-lg">
              <div className="card-body p-4">
                <h3 className="fw-bold mb-3">Find Us Here</h3>
                <div className="ratio ratio-16x9">
                  <iframe 
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3024.177858804427!2d-74.00601568459418!3d40.71277597933112!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c25fe0e4b1f7e5%3A0x6b62a5c4c8c9e9e8!2sNew%20York%2C%20NY%2C%20USA!5e0!3m2!1sen!2s!4v1641234567890!5m2!1sen!2s" 
                    style={{border: 0}} 
                    allowFullScreen="" 
                    loading="lazy"
                    title="Our Location"
                  ></iframe>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;
