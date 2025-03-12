import React, { useState } from 'react'
import "./Navbar.css"
import { Link, useNavigate } from 'react-router-dom'

const Navbar = ({ accountState, onLogout , profilePicture}) => {
  const [menu,setMenu] = useState("main")
  const navigate = useNavigate();
  const navObjects = [
    { "id": 1,
      "name": "Main",
      "path": "main",
      "permission" : "all"
    },
    {"id": 2,
      "name":"My Courses",
      "path": "mycourse",
      "permission" : "tutor"
    },
    {"id": 3,
      "name":"Verify Tutors",
      "path": "admin",
      "permission" : "admin"
    },
    {"id": 4,
      "name": "Chat Box",
      "path": "chatbox",
      "permission" : "all"
    },
    {"id": 5,
      "name": "Notifications",
      "path": "notification",
      "permission" : "all"
    },
    {"id": 6,
      "name": "My course",
      "path": "Reservation",
      "permission" : "learner"
    }]

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
    return accountState !== 'unregistered' && (obj.permission === "all" || accountState === obj.permission) && 
    <li key={obj.id} onClick={()=>handleNavClick(path, obj.path)}>
      <Link style={{textDecoration : 'none'}} to={path}>{obj.name}</Link>
      {menu===obj.path?<hr/>:<></>}
    </li>
  }

  return (
    <>
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
         {accountState !== "unregistered" && <Link to='/myprofile'><img src={profilePicture} alt="" /></Link>}
        </div>
    </div>
    <div className="dummy-elem"></div> {/* If delete this element navbar will be on top of the page elements */}
    </>
  )
}

export default Navbar
