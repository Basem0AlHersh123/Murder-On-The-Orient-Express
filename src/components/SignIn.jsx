// 📁 src/components/SignIn.jsx
import { useState } from "react";
import "../signin.css"; 
function SignIn() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      alert(isLogin ? "Successfully signed in!" : "Account created successfully!");
    }, 1500);
  };

  const handleSocialLogin = (provider) => {
    alert(`Connecting with ${provider}...`);
  };

  return (
    <div className="signin-page min-vh-100 d-flex align-items-center p-3">
      {/* Animated Background */}
      <div className="position-fixed top-0 start-0 w-100 h-100 z-n1">
        <div className="position-absolute top-0 start-0 w-100 h-100 bg-primary bg-opacity-5"></div>
        <div 
          className="position-absolute top-0 start-0 w-100 h-100"
          style={{
            background: 'linear-gradient(45deg, rgba(13, 110, 253, 0.1) 0%, rgba(111, 66, 193, 0.1) 100%)',
            animation: 'gradientShift 15s ease infinite'
          }}
        ></div>
        
        {/* Floating shapes */}
        <div className="floating-shape shape-1"></div>
        <div className="floating-shape shape-2"></div>
        <div className="floating-shape shape-3"></div>
      </div>

      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-10">
            <div className="card border-0 shadow-lg overflow-hidden" style={{ borderRadius: '20px' }}>
              <div className="row g-0">
                {/* Left Side - Illustration */}
                <div className="col-lg-6 d-none d-lg-flex bg-primary">
                  <div className="p-5 d-flex flex-column justify-content-center text-white position-relative">
                    {/* Animated circles */}
                    <div className="pulse-circle circle-1"></div>
                    <div className="pulse-circle circle-2"></div>
                    <div className="pulse-circle circle-3"></div>
                    
                    <div className="position-relative z-1">
                      <h1 className="display-5 fw-bold mb-4">
                        Welcome Back!
                      </h1>
                      <p className="lead mb-4">
                        Sign in to continue your travel journey and access personalized recommendations.
                      </p>
                      
                      {/* Features list */}
                      <div className="mb-4">
                        <div className="d-flex align-items-center mb-3">
                          <div className="bg-white bg-opacity-25 rounded-circle p-2 me-3">
                            <i className="bi bi-check-lg"></i>
                          </div>
                          <span>Personalized travel plans</span>
                        </div>
                        <div className="d-flex align-items-center mb-3">
                          <div className="bg-white bg-opacity-25 rounded-circle p-2 me-3">
                            <i className="bi bi-check-lg"></i>
                          </div>
                          <span>Exclusive member deals</span>
                        </div>
                        <div className="d-flex align-items-center">
                          <div className="bg-white bg-opacity-25 rounded-circle p-2 me-3">
                            <i className="bi bi-check-lg"></i>
                          </div>
                          <span>Save your favorite destinations</span>
                        </div>
                      </div>
                      
                      {/* Travel illustration */}
                      <div className="text-center mt-4">
                        <div className="d-inline-block position-relative">
                          <i className="bi bi-airplane text-white fs-1 position-absolute"
                             style={{ 
                               top: '-20px',
                               left: '-30px',
                               animation: 'float 3s ease-in-out infinite',
                               animationDelay: '0.5s'
                             }}>
                          </i>
                          <i className="bi bi-suitcase-lg text-white fs-1"
                             style={{
                               animation: 'float 3s ease-in-out infinite',
                               animationDelay: '1s'
                             }}>
                          </i>
                          <i className="bi bi-compass text-white fs-1 position-absolute"
                             style={{
                               top: '-20px',
                               right: '-30px',
                               animation: 'float 3s ease-in-out infinite',
                               animationDelay: '1.5s'
                             }}>
                          </i>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Side - Form */}
                <div className="col-lg-6">
                  <div className="p-5">
                    {/* Logo */}
                    <div className="text-center mb-4">
                      <h2 className="fw-bold text-primary">
                        <i className="bi bi-airplane me-2"></i>
                        TravelExplorer
                      </h2>
                      <p className="text-muted">Your gateway to amazing adventures</p>
                    </div>

                    {/* Toggle between Login/Signup */}
                    <div className="d-flex mb-4" style={{ maxWidth: '300px', margin: '0 auto' }}>
                      <button
                        className={`btn flex-fill ${isLogin ? 'btn-primary' : 'btn-outline-primary'} rounded-pill me-2`}
                        onClick={() => setIsLogin(true)}
                      >
                        Sign In
                      </button>
                      <button
                        className={`btn flex-fill ${!isLogin ? 'btn-primary' : 'btn-outline-primary'} rounded-pill`}
                        onClick={() => setIsLogin(false)}
                      >
                        Sign Up
                      </button>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="needs-validation" noValidate>
                      {!isLogin && (
                        <div className="mb-3">
                          <label className="form-label fw-bold">Full Name</label>
                          <div className="input-group">
                            <span className="input-group-text">
                              <i className="bi bi-person"></i>
                            </span>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Enter your full name"
                              required
                            />
                          </div>
                        </div>
                      )}

                      <div className="mb-3">
                        <label className="form-label fw-bold">Email Address</label>
                        <div className="input-group">
                          <span className="input-group-text">
                            <i className="bi bi-envelope"></i>
                          </span>
                          <input
                            type="email"
                            className="form-control"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                          />
                        </div>
                      </div>

                      <div className="mb-3">
                        <label className="form-label fw-bold">Password</label>
                        <div className="input-group">
                          <span className="input-group-text">
                            <i className="bi bi-lock"></i>
                          </span>
                          <input
                            type="password"
                            className="form-control"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                          />
                          <button className="btn btn-outline-secondary" type="button">
                            <i className="bi bi-eye"></i>
                          </button>
                        </div>
                        <div className="form-text">
                          Must be at least 8 characters with letters and numbers
                        </div>
                      </div>

                      {isLogin && (
                        <div className="d-flex justify-content-between align-items-center mb-4">
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              id="rememberMe"
                              checked={rememberMe}
                              onChange={(e) => setRememberMe(e.target.checked)}
                            />
                            <label className="form-check-label" htmlFor="rememberMe">
                              Remember me
                            </label>
                          </div>
                          <a href="#" className="text-decoration-none">
                            Forgot password?
                          </a>
                        </div>
                      )}

                      {!isLogin && (
                        <div className="mb-4">
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              id="terms"
                              required
                            />
                            <label className="form-check-label" htmlFor="terms">
                              I agree to the <a href="#" className="text-decoration-none">Terms & Conditions</a>
                            </label>
                          </div>
                        </div>
                      )}

                      <button
                        type="submit"
                        className="btn btn-primary btn-lg w-100 mb-4 py-3"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2"></span>
                            {isLogin ? 'Signing in...' : 'Creating account...'}
                          </>
                        ) : (
                          <>
                            <i className={`bi ${isLogin ? 'bi-box-arrow-in-right' : 'bi-person-plus'} me-2`}></i>
                            {isLogin ? 'Sign In' : 'Create Account'}
                          </>
                        )}
                      </button>

                      {/* Divider */}
                      <div className="position-relative text-center mb-4">
                        <hr />
                        <span className="position-absolute top-50 start-50 translate-middle bg-white px-3 text-muted">
                          Or continue with
                        </span>
                      </div>

                      {/* Social Login */}
                      <div className="row g-2 mb-4">
                        <div className="col-md-4">
                          <button
                            type="button"
                            className="btn btn-outline-danger w-100"
                            onClick={() => handleSocialLogin('Google')}
                          >
                            <i className="bi bi-google me-2"></i>
                            Google
                          </button>
                        </div>
                        <div className="col-md-4">
                          <button
                            type="button"
                            className="btn btn-outline-primary w-100"
                            onClick={() => handleSocialLogin('Facebook')}
                          >
                            <i className="bi bi-facebook me-2"></i>
                            Facebook
                          </button>
                        </div>
                        <div className="col-md-4">
                          <button
                            type="button"
                            className="btn btn-outline-dark w-100"
                            onClick={() => handleSocialLogin('GitHub')}
                          >
                            <i className="bi bi-github me-2"></i>
                            GitHub
                          </button>
                        </div>
                      </div>

                      {/* Footer text */}
                      <div className="text-center">
                        <p className="text-muted">
                          {isLogin ? "Don't have an account? " : "Already have an account? "}
                          <button
                            type="button"
                            className="btn btn-link p-0 text-decoration-none"
                            onClick={() => setIsLogin(!isLogin)}
                          >
                            {isLogin ? 'Sign up' : 'Sign in'}
                          </button>
                        </p>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignIn;