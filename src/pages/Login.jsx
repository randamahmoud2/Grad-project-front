import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Login.css';
import logo from "../image/tooth.png";
import emailIcon from "../image/email.png";

const Login = () => {
  const navigate = useNavigate();
  
  
  
  const location = useLocation();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);




  const styles = {
    container: {
      height: 'auto',
      overflow: 'hidden',
    },
    content: {
      maxWidth: '85%',
      
      margin: '20px 0 auto',
      transform: 'scale(0.9)',
      transformOrigin: 'top center',
    },
    formContainer: {
      padding: '10px',
      height: 'auto',
      overflow: 'hidden',
    },
    inputGroup: {
      marginBottom: '8px',
    },
    inputField: {
      height: '32px',
    },
    logo: {
      maxWidth: '40px',
      maxHeight: '40px',
    },
    heading: {
      fontSize: '1.5rem',
      marginBottom: '10px',
    },
    label: {
      marginBottom: '2px',
      fontSize: '0.9rem',
    },
    input: {
      padding: '6px',
      height: '35px',
    },
    loginButton: {
      padding: '8px 0',
      marginTop: '10px',
    },
    welcomeContent: {
      transform: 'scale(0.9)',
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!formData.role) {
      setError('Please select a role');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:5068/api/Auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      console.log('Login response:', data);
      

      localStorage.setItem('userId', data.userId);
      localStorage.setItem('role', data.role);
      localStorage.setItem('doctorId', data.doctorId);
      localStorage.setItem('patientId', data.patientId);
      localStorage.setItem('approved', data.approved);
      localStorage.setItem('name', data.name);
      localStorage.setItem('isAuthenticated',true);
       
      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // Create auth data object
      const authData = {
        userId: data.userId,
        role: data.role,
        doctorId: data.doctorId,
        patientId: data.patientId,
        approved: data.approved,
        name: data.name,
        isAuthenticated: true
      };

      // Use the login function from auth context
      login(authData);

      // Navigate to the intended destination or role-specific dashboard
      const from = location.state?.from?.pathname || `/${data.role}/Dashboard`;
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='login' style={styles.container}>
      <div className='content' style={styles.content}>
        <div className='left'>
          <div className="login-header">
            <img src={logo} alt="ToothTone Logo" className="login-logo" style={styles.logo} />
            <h1 style={styles.heading}>ToothTone</h1>
          </div>
          
          <div className="login-form-container" style={styles.formContainer}>
            <h2 style={styles.heading}>Welcome Back!</h2>
            {error && <div className="error-message">{error}</div>}
            
            <form onSubmit={handleSubmit}>
              <div className='input-group' style={styles.inputGroup}>
                <label style={styles.label}>Email</label>
                <div className='input-field' style={styles.inputField}>
                  <input
                    type="email"
                    placeholder='Enter your email'
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    style={styles.input}
                  />
                  <img src={emailIcon} alt="" style={{width: '16px', height: '16px'}} />
                </div>
              </div>

              <div className='input-group' style={styles.inputGroup}>
                <label style={styles.label}>Password</label>
                <div className='input-field' style={styles.inputField}>
                  <input
                    type="password"
                    placeholder='Enter your password'
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    style={styles.input}
                  />
                </div>
              </div>

              <div className='input-group' style={styles.inputGroup}>
                <label style={styles.label}>Login as</label>
                <div className='input-field' style={styles.inputField}>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    required
                    className="role-select"
                    style={styles.input}
                  >
                    <option value="">Select Role</option>
                    <option value="doctor">Doctor</option>
                    <option value="receptionist">Receptionist</option>
                    <option value="manager">Manager</option>
                    <option value="patient">Patient</option>
                  </select>
                </div>
              </div>

              <button 
                type='submit' 
                className="login-button" 
                style={styles.loginButton}
                disabled={isLoading}
              >
                {isLoading ? 'Logging in...' : 'Login'}
              </button>
            </form>

            <div className="login-footer">
              <p style={{fontSize: '0.9rem', marginTop: '8px'}}>Don't have an account? 
                <span 
                  onClick={() => navigate('/signup')} 
                  className="signup-link"
                >
                  Sign up
                </span>
              </p>
            </div>
          </div>
        </div>

        <div className="right">
          <div className="welcome-content" style={styles.welcomeContent}>
            <h2 style={styles.heading}>Welcome to ToothTone</h2>
            <p>Your Dental Care Management Solution</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;


/// we work in this file 