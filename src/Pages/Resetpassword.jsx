import React from 'react'
import './CSS/Resetpassword.css'

const Resetpassword = () => {
  return (
    <div className='reset'>
        <div className="reset-container">
            <h1>Reset Password</h1>
            <div className="reset-fields">
                <input type="password" placeholder='New Password'/>
                <input type="password" placeholder='Comfirm Password'/>
            </div>
            <button type='submit'>Save</button>
        </div>
    </div>
  )
}

export default Resetpassword
