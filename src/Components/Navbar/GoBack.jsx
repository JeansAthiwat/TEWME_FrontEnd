import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect } from "react";

const GoBack = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    console.log("Current Path:", location.pathname);
  }, [location]);

  const handleGoBack = () => {
    if (window.history.length > 1) {
        console.log("Navigating back...");
        navigate(-2);
      } else {
        console.log("No history found, redirecting to home.");
        navigate("/"); // Go to home instead if no history
      }
  };

  return (
    <div>
      <button className="goback" onClick={handleGoBack}>{"←"}</button>
    </div>
  );
};

export default GoBack;