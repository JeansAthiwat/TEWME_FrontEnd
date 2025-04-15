import "./Navbar.css";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { ArrowLeft, House, MessageCircle, Bell, BookText, BookMarked } from "lucide-react";

const Navbar = ({ accountState, profilePicture }) => {
  const navigate = useNavigate();
  const location = useLocation().pathname.split("/")[1];

  const navObjects = [
    { id: 1, name: "main", icon: <House />,path: "main", permission: "all" },
    { id: 2, name: "Verify Tutors", path: "admin", permission: "admin" },
    { id: 3, name: "Chat", icon:<MessageCircle />, path: "chatbox", permission: "all" },
    { id: 4, name: "noti", icon:<Bell />, path: "notification", permission: "all" },
    { id: 5, name: "Reservations", icon:<BookMarked />, path: "Reservation", permission: "learner" },
    { id: 6, name: "My Courses", icon:<BookText />, path: "mycourse", permission: "tutor" },
  ];

  useEffect(() => {
    console.log("Location changed to:", location);
  }, [location]);

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
          <Link className="flex flex-row items-center gap-1" style={{ textDecoration: "none" }} to={path}>
            <p className="hidden md:block">{obj.name}</p>{obj.icon}
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
          <Link to="/login">
            <p>TewMe</p>
          </Link>
          </div>
        </div>
        <ul className=" hidden sm:flex justify-end items-center  gap-[20px] lg:gap-[50px] text-[#626262] text-xl font-medium ">
          {navObjects.map(displayNav)}
          </ul>
        <div className="nav-login-profile">
          {accountState === "unregistered" ? (
            <Link to="/login">
              <button className="login-btn">Login</button>
            </Link>
          ) : (
            <Link to="/myprofile">
              <img src={profilePicture} alt="Profile" />
            </Link>
            
          )}
        </div>
      </div>
  
    </>
  );
};

export default Navbar;