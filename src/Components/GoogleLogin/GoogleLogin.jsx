import React from 'react';

const GoogleLogin = () => {
  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:39189/auth/google';
  };

  return (
    <button onClick={handleGoogleLogin} className="google-btn">
      <img src="https://banner2.cleanpng.com/20190228/qby/kisspng-google-logo-google-account-g-suite-google-images-g-icon-archives-search-png-1713904157115.webp" 
           alt="Google Logo" className="google-icon"/>
      Sign in with Google
    </button>
  );
};

export default GoogleLogin;
