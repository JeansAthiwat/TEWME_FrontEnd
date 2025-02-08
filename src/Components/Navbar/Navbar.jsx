import React, { useState } from 'react'
import "./Navbar.css"
import profile_icon from '../Assets/profile_icon.png'
import { Link, useNavigate } from 'react-router-dom'

const Navbar = ({ accountState, onLogout }) => {
  const [menu,setMenu] = useState("main")
  const navigate = useNavigate();

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

  return (
    <div className='navbar'>
        <div className='nav-logo'>
            {/* <img src={profile_icon} alt=""/> */}
            <p>TewMe</p>
        </div>
        <ul className='nav-menu'>
          <li onClick={()=>handleNavClick('/', 'main')}><Link style={{textDecoration : 'none'}} to='/'>Main</Link>{menu==="main"?<hr/>:<></>}</li>
          <li onClick={()=>handleNavClick('/mycourse', 'mycourse')}><Link style={{textDecoration : 'none'}} to='/mycourse'>My Courses</Link>{menu==="mycourse"?<hr/>:<></>}</li>
          <li onClick={()=>handleNavClick('/chatbox', 'chatbox')}><Link style={{textDecoration : 'none'}} to='/chatbox'>Chat Box</Link>{menu==="chatbox"?<hr/>:<></>}</li>
          <li onClick={()=>handleNavClick('/notification', 'notification')}><Link style={{textDecoration : 'none'}} to='/notification'>Notifications</Link>{menu==="notification"?<hr/>:<></>}</li>
        </ul>
        <div className="nav-login-profile">
          {accountState === "unregistered" ? (
          <Link to='/login'><button className="login-btn">Login</button></Link>
        ) : (
          <button className="logout-btn" onClick={handleLogoutClick}>
            Logout
          </button>
        )}
          <Link to='/profile'><img src={profile_icon} alt="" /></Link>
        </div>
    </div>
  )
}

export default Navbar
