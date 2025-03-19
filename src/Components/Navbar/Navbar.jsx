import "./Navbar.css";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { ArrowLeft } from "lucide-react";

const Navbar = ({ accountState, onLogout, profilePicture }) => {
  const navigate = useNavigate();
  const location = useLocation().pathname.split("/")[1];

  const navObjects = [
    { id: 1, name: "Main", path: "main", permission: "all" },
    { id: 2, name: "Verify Tutors", path: "admin", permission: "admin" },
    { id: 3, name: "Chat Box", path: "chatbox", permission: "all" },
    { id: 4, name: "Notifications", path: "notification", permission: "all" },
    { id: 5, name: "My Course", path: "Reservation", permission: "learner" },
    { id: 6, name: "My Courses", path: "mycourse", permission: "tutor" },
  ];

  useEffect(() => {
    console.log("Location changed to:", location);
  }, [location]);

  const handleLogoutClick = () => {
    onLogout();
    navigate("/login");
  };

  const handleNavClick = (path) => {
    if (accountState === "unregistered" && path !== "/") {
      alert("Please login to access this feature");
      navigate("/");
      return;
    }
    
    // setMenu(menuItem);
    navigate(path);
  };

  const handleGoBack = () => {
    if (window.history.length > 1) {
      navigate(-2);
    } else {
      navigate("/");
    }
  };

  const displayNav = (obj) => {
    const path = "/" + obj.path;
    return (
      accountState !== "unregistered" &&
      (obj.permission === "all" || accountState === obj.permission) && (
        <li key={obj.id} onClick={() => handleNavClick(path)}>
          <Link style={{ textDecoration: "none" }} to={path}>
            {obj.name}
          </Link>
          {location === obj.path && <hr />}
        </li>
      )
    );
  };

  return (
    <>
      <div className="navbar">
        <div className="nav-left">
          <ArrowLeft
            className="arrow-icon"
            onClick={handleGoBack}
            size={50} /* ทำให้ใหญ่ขึ้น */
            strokeWidth={2.5}
          />
          <div className="nav-logo">
            <p>TewMe</p>
          </div>
        </div>
        <ul className="nav-menu">{navObjects.map(displayNav)}</ul>
        <div className="nav-login-profile">
          {accountState === "unregistered" ? (
            <Link to="/login">
              <button className="login-btn">Login</button>
            </Link>
          ) : (
            <button className="logout-btn" onClick={handleLogoutClick}>
              Logout
            </button>
          )}
          {accountState !== "unregistered" && (
            <Link to="/myprofile">
              <img src={profilePicture} alt="Profile" />
            </Link>
          )}
        </div>
      </div>
      <div className="dummy-elem"></div>
    </>
  );
};

export default Navbar;