import React from 'react'
import { Link } from 'react-router-dom'
import './CSS/Signup.css'

const Signup = () => {
  return (
    <div className='signup'>
    <div className="signup-container">
        <h1>Sign Up</h1>
        <div className="signup-fields">
            <input type="name" placeholder='Your Name'/>
            <input type="email" placeholder='Email Address'/>
            <input type="password" placeholder='Password'/>
        </div>
        <div className="signup-agree">
          <input type="checkbox" name='' id=''/>
          <p>By continuing, I agree to the terms of use & privacy policy.</p>
        </div>
        <button type='submit'>Sign up</button>
        <p className="signup-login">
            Already have an account?
            <Link to='/login' style={{textDecoration : 'none'}} className='link'>Sign in<hr/></Link>
        </p>
    </div>
</div>
  )
}

export default Signup
