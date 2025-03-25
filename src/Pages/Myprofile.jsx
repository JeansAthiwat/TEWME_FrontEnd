import React, { useState, useEffect } from 'react';
import './CSS/Myprofile.css';

const Myprofile = ({profilePicture, setProfilePicture}) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // 🔹 Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState(''); // 'profilePicture' or 'bio'
  const [modalValue, setModalValue] = useState('');

  // Fetch User Profile on Component Mount
  useEffect(() => {
    const getUserProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No token found');

        const response = await fetch('http://localhost:39189/api/profile/get-profile', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.msg || 'Failed to fetch profile');

        setUser(data);
        console.dir(data)
        setLoading(false);
      } catch (error) {
        setError(error.message);
        // setProfilePicture(localStorage.getItem('profilePicture'));
        setLoading(false);
      }
    };

    getUserProfile();
    
  }, []);

  // 🔹 Open Modal for Editing
  const openModal = (type) => {
    setModalType(type);
    setModalValue(type === 'profilePicture' ? user.profilePicture : user.bio);
    setIsModalOpen(true);
  };

  // 🔹 Handle Modal Input Change
  const handleModalChange = (e) => {
    setModalValue(e.target.value);
  };

  // 🔹 Handle Modal File Input
  const handleProfilePictureChoose = async (e) => {
    console.log(e.target.files[0])
    const file = e.target.files[0]
    const reader = new FileReader()
    let base64img = ''
    reader.onload = () => {
      base64img = reader.result
      setModalValue(base64img)
    }
    reader.onerror = () => {
      console.log('Error reading file')
    }
    reader.readAsDataURL(file)
  }

  // 🔹 Handle Profile Picture or Bio Update
  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token found');

      const endpoint =
        modalType === 'profilePicture'
          ? 'http://localhost:39189/api/profile/update-profile-picture'
          : 'http://localhost:39189/api/profile/update-bio';

      const response = await fetch(endpoint, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ [modalType]: modalValue })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.msg || `Failed to update ${modalType}`);

      setUser(data.user);
      setProfile()
      showCustomAlert(`${modalType === 'profilePicture' ? 'Profile picture' : 'Bio'} updated successfully!`, 'success');
      setIsModalOpen(false);
    } catch (error) {
      showCustomAlert(error.message, 'error');
    }

    
  };

  // 🔹 Custom Alert Box
  const showCustomAlert = (message, type) => {
    const alertBox = document.createElement('div');
    alertBox.innerText = message;
    alertBox.className = `custom-alert ${type}`;
    
    document.body.appendChild(alertBox);
    
    setTimeout(() => {
      alertBox.remove();
    }, 3000);
  };

  if (loading) {
    return <div className="profile-container"><h2>Loading profile...</h2></div>;
  }

  if (error) {
    return <div className="profile-container"><h2>Error: {error}</h2></div>;
  }

  const setProfile = () => {
    setProfilePicture(user.profilePicture)

  }

  const handlePayout = async () => {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No token found');

    const response = await fetch("http://localhost:39189/api/profile/update-balance", {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ balance: 0 })
    });
    const data = await response.json();

    if (!response.ok) throw new Error(data.msg || `Failed to update ${modalType}`);

    alert("Payout Success\n🤑 Here comes the moneyyy 💸💸💸");
    const { balance, ...newUser } = user;
    newUser.balance = data.user.balance;
    setUser(newUser);
  }
  
  setProfile()
  

  return (
    <div className="profile-container">
      <div className="profile-header">
        
        <img
          src={profilePicture || 'https://static.vecteezy.com/system/resources/thumbnails/020/765/399/small_2x/default-profile-account-unknown-icon-black-silhouette-free-vector.jpg'}
          alt={`${user.firstname}'s profile`}
          className="profile-picture"
          onClick={() => openModal('profilePicture')} // 🔹 Click to open modal
        />
        <h1>{user.firstname} {user.lastname}</h1>
        <p className="profile-bio" onClick={() => openModal('bio')}>
          {user.bio || 'Click to add bio'}
        </p>
      </div>

      <div className="profile-contact">
        <h2>Contact Information</h2>
        <p>Email: {user.email}</p>
        <p>Phone: {user.phone || 'Not provided'}</p>
      </div>

      <div className="profile-finance bg-[rgba(0,0,0,0.05)] rounded-[8px] top-[5px] relative py-[15px]">
        <h2 className="font-bold text-[20px]">Balance</h2>
        <p>{`${user.balance} Tokens` || "0 Tokens"}</p>
        {user.role=="tutor" && (
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-4 rounded-full" onClick={handlePayout}>Payout</button>
        )}
      </div>

      {/* 🔹 Modal Popup for Profile Updates */}
      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h3>{modalType === 'profilePicture' ? 'Update Profile Picture' : 'Update Bio'}</h3>
            {modalType !== 'profilePicture' &&
              <input
              type="text"
              value={modalValue}
              onChange={handleModalChange}
              placeholder={`Enter new ${modalType}`}
            />}
            {modalType === 'profilePicture' &&
              <input
                type="file"
                onChange={handleProfilePictureChoose}
              />
            }
            <div className="modal-actions">
              
              <button onClick={() => setIsModalOpen(false)} className="cancel-btn">Cancel</button>
              <button onClick={handleUpdate} className="update-btn">Update</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Myprofile;
