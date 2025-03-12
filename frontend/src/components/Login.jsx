// Login.jsx
import React from 'react';

function Login() {
  const googleLogin = () => {
    // Redirect to the backend Google auth route
    window.location.href = 'https://spiraltech-api.onrender.com/auth/google';
  };

  const twitterLogin = () => {
    // Redirect to the backend Google auth route
    window.location.href = 'https://spiraltech-api.onrender.com/auth/twitter';
  };

  return (
    <div className="login-container">
      <h1>Welcome to Courier Management</h1>
      <button onClick={googleLogin} className="google-login-button">
        Sign in with Google
      </button>
      <button onClick={twitterLogin} className="google-login-button">
        Sign in with Twitter
      </button>
    </div>
  );
}

export default Login;
