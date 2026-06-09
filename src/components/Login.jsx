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
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');
    
    const correctPin = import.meta.env.VITE_ADMIN_PIN || '7310';
    if (pin === correctPin) {
      sessionStorage.setItem('adminAuth', 'true');
      setIsSuccess(true);
      setTimeout(() => {
        navigate('/');
      }, 1000);
    } else {
      setError('Invalid PIN');
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
                <label>Admin PIN</label>
                <div className="input-wrapper">
                  <Lock className="input-icon" size={16} />
                  <input 
                    type="password" 
                    placeholder="Enter PIN" 
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    autoFocus
                  />
                </div>
              </div>

              <div className="login-options">
                <label className="checkbox-container">
                  <input type="checkbox" defaultChecked />
                  <span>Remember Me</span>
                </label>
              </div>

              <button type="submit" className="btn-login">
                <Target size={18} />
                <span>Login to Dashboard</span>
                <ArrowRight size={18} />
              </button>


              
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
