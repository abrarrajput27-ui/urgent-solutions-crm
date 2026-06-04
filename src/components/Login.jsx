import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Lock, 
  Mail, 
  CheckCircle2, 
  ShieldCheck,
  Target,
  ArrowRight
} from 'lucide-react';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('admin@urgenttaxis.com');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');
    
    if (email === 'admin@urgenttaxis.com' && password === 'admin123') {
      setIsSuccess(true);
      setTimeout(() => {
        navigate('/dashboard');
      }, 1000);
    } else {
      setError('Invalid email or password');
      setIsSuccess(false);
    }
  };

  return (
    <div className="auth-layout-outer">
      
      <div className="auth-inner-panel">
        {/* Background Skyline & Car */}
        <div className="auth-visual-bg"></div>
        
        {/* Branding (Top Left) */}
        <div className="auth-branding">
          <div className="auth-logo-svg">
            <svg viewBox="0 0 100 120" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Outer Map Pin (Blue) */}
              <path d="M50 0C22.4 0 0 22.4 0 50C0 85 50 120 50 120C50 120 100 85 100 50C100 22.4 77.6 0 50 0Z" fill="#0044FF"/>
              {/* Inner Circle Base */}
              <circle cx="50" cy="45" r="30" fill="white"/>
              {/* Steering Wheel (Green) */}
              <path d="M50 20C36.2 20 25 31.2 25 45C25 58.8 36.2 70 50 70C63.8 70 75 58.8 75 45C75 31.2 63.8 20 50 20ZM50 26C60.5 26 69 34.5 69 45H53.5V36.5H46.5V45H31C31 34.5 39.5 26 50 26ZM46.5 64V55.5H53.5V64C43.5 63.5 35 57 32 48H42L46.5 53.5L50 50L53.5 53.5L58 48H68C65 57 56.5 63.5 46.5 64Z" fill="#00C853"/>
            </svg>
          </div>
          <div className="auth-branding-text">
            <div className="auth-logo-text">Urgent<span>Taxis</span></div>
            <div className="auth-tagline">Fast To Your Destination</div>
            <div className="auth-subtagline">Your Quick Ride Solution!</div>
          </div>
        </div>

        {/* Login Card Container */}
        <div className="login-card-container">
          
          <div className="shield-icon-wrapper">
            <div className="shield-icon-inner">
              <Lock size={22} strokeWidth={2.5} />
            </div>
          </div>
          
          <div className="login-card-inner">
            <h2>Welcome Back! <span className="welcome-hand">👋</span></h2>
            <p>Login to your Urgent Taxis Finance CRM</p>

            {error && (
              <div style={{ backgroundColor: '#FEE2E2', color: '#DC2626', padding: '0.5rem', borderRadius: '0.5rem', marginBottom: '1rem', fontSize: '0.75rem', fontWeight: 600 }}>
                {error}
              </div>
            )}
            
            {isSuccess && (
              <div style={{ backgroundColor: '#DCFCE7', color: '#16A34A', padding: '0.5rem', borderRadius: '0.5rem', marginBottom: '1rem', fontSize: '0.75rem', fontWeight: 600 }}>
                Login successful! Redirecting...
              </div>
            )}

            <form onSubmit={handleLogin}>
              <div className="input-group">
                <label>Email Address</label>
                <div className="input-wrapper">
                  <Mail className="input-icon" size={16} />
                  <input 
                    type="email" 
                    placeholder="admin@urgenttaxis.com" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  {email === 'admin@urgenttaxis.com' && <CheckCircle2 className="check-icon" size={16} />}
                </div>
              </div>

              <div className="input-group">
                <label>Password</label>
                <div className="input-wrapper">
                  <Lock className="input-icon" size={16} />
                  <input 
                    type={showPassword ? "text" : "password"} 
                    placeholder="••••••••" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button 
                    type="button" 
                    className="show-pwd"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    Show
                  </button>
                </div>
              </div>

              <div className="login-options">
                <label className="checkbox-container">
                  <input type="checkbox" defaultChecked />
                  <span>Remember Me</span>
                </label>
                <a href="#" className="forgot-pwd">Forgot Password?</a>
              </div>

              <button type="submit" className="btn-login">
                <Target size={18} />
                <span>Login to Dashboard</span>
                <ArrowRight size={18} />
              </button>

              <div className="social-login-divider">
                <span>or continue with</span>
              </div>

              <div className="social-buttons">
                <button type="button" className="btn-social">
                  <svg width="18" height="18" viewBox="0 0 48 48">
                    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                  </svg>
                </button>
                <button type="button" className="btn-social">
                  <svg width="18" height="18" viewBox="0 0 21 21">
                    <path fill="#f25022" d="M1 1h9v9H1z" />
                    <path fill="#00a4ef" d="M11 1h9v9h-9z" />
                    <path fill="#7fba00" d="M1 11h9v9H1z" />
                    <path fill="#ffb900" d="M11 11h9v9h-9z" />
                  </svg>
                </button>
                <button type="button" className="btn-social">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{color: '#0B192C'}}>
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                  </svg>
                </button>
              </div>
              
              <div className="login-footer-badges">
                <span className="secure-icon"><ShieldCheck size={14} /> Secure</span>
                <span>•</span>
                <span>Fast</span>
                <span>•</span>
                <span>Reliable</span>
              </div>
            </form>
          </div>
        </div>

        {/* Bottom Waves */}
        <svg className="bottom-wave" viewBox="0 0 1440 320" preserveAspectRatio="none">
          <path fillOpacity="1" d="M0,256L48,250.7C96,245,192,235,288,213.3C384,192,480,160,576,160C672,160,768,192,864,208C960,224,1056,224,1152,208C1248,192,1344,160,1392,144L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          <path fillOpacity="1" d="M0,192L48,202.7C96,213,192,235,288,240C384,245,480,235,576,208C672,181,768,139,864,122.7C960,107,1056,117,1152,144C1248,171,1344,213,1392,234.7L1440,256L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
        </svg>

      </div>
      
      {/* Footer Text outside the panel */}
      <div className="auth-footer">
        © 2025 Urgent Taxis Finance CRM. All rights reserved.
      </div>
    </div>
  );
};

export default Login;
