import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import './CSS/Signup.css'
import ImageUpload from '../Components/ImageUpload/ImageUpload'

const Signup = () => {
  const [UserType,setUserType] = useState();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!UserType) {
      alert("Please select whether you're signing up as a tutor or learner");
      return;
    }
  };

  return (
  <div className='signup'>
    <div className="signup-container">
        <h1>Sign Up</h1>
        <div className="signup-select">
          <button onClick={()=>setUserType("Tutor")} type='submit' className={`button-state ${UserType === "Tutor" ? "active" : ""}`}>As a tutor</button>
          <button onClick={()=>setUserType("Student")} type='submit' className={`button-state ${UserType === "Student" ? "active" : ""}`}>As a learner</button>
        </div>
        <div className="signup-fields">
            <input type="name" placeholder='Your Name'/>
            <input type="email" placeholder='Email Address'/>
            <input type="password" placeholder='Password'/>
        </div>
        <div className="image-upload">
            <ImageUpload/>
        </div>
        <div className="signup-agree">
          <input type="checkbox" name='' id=''/>
          <p>By continuing, I agree to the terms of use & privacy policy.</p>
        </div>
        <button type='submit' onClick={handleSubmit}>Sign up</button>
        <p className="signup-login">
            Already have an account?
            <Link to='/login' style={{textDecoration : 'none'}} className='link'>Sign in<hr/></Link>
        </p>
    </div>
</div>
  )
}

export default Signup