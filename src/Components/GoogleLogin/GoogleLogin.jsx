import React from 'react';

const GoogleLogin = () => {
  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:39189/auth/google';
  };

  return (
    <button onClick={handleGoogleLogin} className="google-btn">
      <img src="https://www.transparentpng.com/thumb/google-logo/colorful-google-logo-transparent-clipart-download-u3DWLj.png" 
           alt="Google Logo" className="google-icon"/>
      Sign in with Google
    </button>
  );
};

export default GoogleLogin;
