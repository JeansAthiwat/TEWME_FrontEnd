import React, { useState } from 'react'
import "./Navbar.css"
import profile_icon from '../Assets/profile_icon.png'
import { Link, useNavigate } from 'react-router-dom'

const Navbar = ({ accountState, onLogout }) => {
  const [menu,setMenu] = useState("main")
  const navigate = useNavigate();
  const navObjects = [
    { "name": "Main",
      "path": "main",
      "permission" : "all"
    },
    {"name":"My Courses",
      "path": "mycourse",
      "permission" : "tutor"
    },
    {"name":"Verify Tutors",
      "path": "admin",
      "permission" : "admin"
    },
    {"name": "Chat Box",
      "path": "chatbox",
      "permission" : "all"
    },
    {"name": "Notifications",
      "path": "notification",
      "permission" : "all"
    },]

  const handleLogoutClick = () => {
    onLogout();
    navigate('/login');
  };

  const handleNavClick = (path, menuItem) => {
    if (accountState === "unregistered" && path !== '/') {
      alert("Please login to access this feature");
      // navigate('/login');
      
      navigate('/');
      return;
    }
  
    setMenu(menuItem);
    navigate(path);
  };

  const displayNav = (obj) => {
    const path = '/'+obj.path
    return (obj.permission === "all" || accountState === obj.permission) && <li 
    onClick={()=>handleNavClick(path, obj.path)}>
      <Link style={{textDecoration : 'none'}} to={path}>{obj.name}</Link>
      {menu===obj.path?<hr/>:<></>}
      </li>
  }
  
  return (
    <div className='navbar'>
        <div className='nav-logo'>
            {/* <img src={profile_icon} alt=""/> */}
            <p>TewMe</p>
        </div>
        <ul className='nav-menu'>
          {navObjects.map(displayNav)}
        </ul>
        <div className="nav-login-profile">
          {accountState === "unregistered" ? (
          <Link to='/login'><button className="login-btn">Login</button></Link>
        ) : (
          <button className="logout-btn" onClick={handleLogoutClick}>
            Logout
          </button>
        )}
          <Link to='/myprofile'><img src={profile_icon} alt="" /></Link>
        </div>
    </div>
  )
}

export default Navbar
