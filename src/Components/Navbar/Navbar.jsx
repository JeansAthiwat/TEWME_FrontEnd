import React, { useState } from 'react'
import "./Navbar.css"
import profile_icon from '../Assets/profile_icon.png'
import { Link } from 'react-router-dom'

const Navbar = () => {
  const [menu,setMenu] = useState("main")

  return (
    <div className='navbar'>
        <div className='nav-logo'>
            {/* <img src={profile_icon} alt=""/> */}
            <p>TewMe</p>
        </div>
        <ul className='nav-menu'>
          <li onClick={()=>{setMenu("main")}}><Link style={{textDecoration : 'none'}} to='/'>Main</Link>{menu==="main"?<hr/>:<></>}</li>
          <li onClick={()=>{setMenu("mycourse")}}><Link style={{textDecoration : 'none'}} to='/mycourse'>My Courses</Link>{menu==="mycourse"?<hr/>:<></>}</li>
          <li onClick={()=>{setMenu("chatbox")}}><Link style={{textDecoration : 'none'}} to='/chatbox'>Chat Box</Link>{menu==="chatbox"?<hr/>:<></>}</li>
          <li onClick={()=>{setMenu("notification")}}><Link style={{textDecoration : 'none'}} to='/notification'>Notifications</Link>{menu==="notification"?<hr/>:<></>}</li>
        </ul>
        <div className="nav-login-profile">
          <Link to='/login'><button>Login</button></Link>
          <Link to='/profile'><img src={profile_icon} alt="" /></Link>
        </div>
    </div>
  )
}

export default Navbar
