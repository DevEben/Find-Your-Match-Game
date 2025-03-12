// AuthSuccess.jsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function AuthSuccess() {
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');

    if (token) {
      // Store the token in local storage
      localStorage.setItem('authToken', token);

      console.log('Extracted token:', token);

      // Redirect to the dashboard
      navigate('/dashboard');
    } else {
      console.error('Authentication token not found');
      // Handle error or redirect to login page
      navigate('/');
    }
  }, [navigate]);

  return (
    <div className="auth-success">
      <h2>Authentication successful!</h2>
      <p>Redirecting to the dashboard...</p>
    </div>
  );
}

export default AuthSuccess;
