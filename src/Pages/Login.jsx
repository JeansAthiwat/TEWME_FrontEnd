import React from 'react'
import './Login.css'

const Login = () => {
  return (
    <div className='login'>
        <div className="login-container">
            <h1>Sign in</h1>
            <div className="login-fields">
                <input type="email" placeholder='Email Address'/>
                <input type="password" placeholder='Password'/>
            </div>
            <div className="login-remember">
                <div className="login-remember-left">
                <input type="checkbox" name="" id="" />
                <p>Remember for 30 days</p>
                </div>
                <div className="login-remember-right">
                <span>Forget password?</span>
                </div>
            </div>
            <button type='submit'>Sign in</button>
            <p className="login-signup">
                Don't have an account?
                <span>
                    Sign Up
                </span>
            </p>
        </div>
    </div>
  )
}

export default Login
