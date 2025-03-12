import "./Navbar.css"
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useEffect } from 'react'

const Navbar = ({ accountState, onLogout , profilePicture}) => {
  const navigate = useNavigate();
  const location = useLocation().pathname.split('/')[1]
  console.log("menu is "+location)
  const navObjects = [
    { "id": 1,
      "name": "Main",
      "path": "main",
      "permission" : "all"
    },
    {"id": 2,
      "name":"Verify Tutors",
      "path": "admin",
      "permission" : "admin"
    },
    {"id": 3,
      "name": "Chat Box",
      "path": "chatbox",
      "permission" : "all"
    },
    {"id": 4,
      "name": "Notifications",
      "path": "notification",
      "permission" : "all"
    },
    {"id": 5,
      "name": "My course",
      "path": "Reservation",
      "permission" : "learner"
    },
    {"id": 6,
      "name":"My Courses",
      "path": "mycourse",
      "permission" : "tutor"
    },]

  useEffect(() => {
      // Force rerender or perform actions based on location change
      console.log("Location changed to:", location);
    }, [location]);

  const handleLogoutClick = () => {
    onLogout();
    navigate('/login');
  };

  const handleNavClick = (path) => {
    if (accountState === "unregistered" && path !== '/') {
      alert("Please login to access this feature");
      // navigate('/login');
      
      navigate('/');
      return;
    }
    navigate(path);
  };

  const displayNav = (obj) => {
    const path = '/'+obj.path
    return accountState !== 'unregistered' && (obj.permission === "all" || accountState === obj.permission) && 
    <li key={obj.id} onClick={()=>handleNavClick(path, obj.path)}>
      <Link style={{textDecoration : 'none'}} to={path}>{obj.name}</Link>
      {location===obj.path?<hr/>:<></>}
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
