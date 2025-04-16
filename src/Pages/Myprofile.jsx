import React, { useState, useEffect } from 'react';
import './CSS/Myprofile.css';
import { Form, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LoadingScreen from '../Components/LoadingScreen/LoadingScreen';


const Myprofile = ({profilePicture, setProfilePicture, onLogout}) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // 🔹 Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState(''); // 'profilePicture' or 'bio'
  const [modalValue, setModalValue] = useState('');
  const navigate = useNavigate();

  const handleLogoutClick = () => {
    onLogout();
    navigate("/login");
  };

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
    setModalValue(user[type]);
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
    if (modalType!=='profilePicture' && modalType!=='bio' && modalValue.trim()===''){
      setIsModalOpen(false);
      toast.error(modalType+' cannot be empty', 'error');
      return
    }
    
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token found');

      // const endpoint =
      //   modalType === 'profilePicture'
      //     ? 'http://localhost:39189/api/profile/update-profile-picture'
      //     : 'http://localhost:39189/api/profile/update-bio';
      console.log(modalType, modalValue)
      const endpoint = 'http://localhost:39189/user/'+user.email
      const response = await fetch(endpoint, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ [modalType]: modalValue })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.msg || `Failed to update ${modalType}`);
      console.log(data)
      // setUser(data.user);
      user[modalType] = modalValue 
      if (modalType==='profilePicture') setProfile()
      toast.success(`${modalType} updated successfully!`, 'success');
      setIsModalOpen(false);
    } catch (error) {
      toast.error(error.message, 'error');
    }

    
  };


  if (loading) {
    return <LoadingScreen />
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

    toast.success("Payout Success\n🤑 Here comes the moneyyy 💸💸💸");
    const { balance, ...newUser } = user;
    newUser.balance = data.user.balance;
    setUser(newUser);
  }
  
  setProfile()
  

  return (
    <div className="w-[90vw] flex flex-col  md:flex-row gap-3  max-w-300 m-auto my-30 border-1 border-gray-200  rounded-lg">
      {/* <ToastContainer position="top-center" autoClose={3000} pauseOnHover={false} /> */}
      <div className="p-5 w-full gap-2 md:w-100  flex flex-col items-center">
        
        <img
          src={profilePicture || 'https://static.vecteezy.com/system/resources/thumbnails/020/765/399/small_2x/default-profile-account-unknown-icon-black-silhouette-free-vector.jpg'}
          alt={`${user.firstname}'s profile`}
          className="w-40 h-40 rounded-full"
          onClick={() => openModal('profilePicture')} // 🔹 Click to open modal
        />
        <h1 className=' font-semibold text-xl'>{user.firstname} {user.lastname}</h1>
        {user.role === 'tutor' && <h2 className={` font-semibold text-md ${user.verification_status ? "text-green-600" : "text-red-600"}`}>{user.verification_status ? "verified" : "not verified"}</h2>}
   <button className="mt-5 bg-gradient-to-br from-[#ff4b4b] to-[#ff1414] text-white  py-[8px] text-[15px] font-semibold 
      rounded-[25px] cursor-pointer transition-all duration-300 ease-in-out shadow-[0_2px_5px_rgba(255,65,65,0.3)] 
      hover:from-[#ff2d2d] hover:to-[#d60000] hover:scale-105 hover:shadow-[0_4px_10px_rgba(255,65,65,0.5)] w-24" 
      onClick={handleLogoutClick}>
              Logout
      </button>
      </div>
      <div className='w-full md:w-200 flex flex-col gap-5 border-l-1 border-gray-200'>
        <h1 className='font-semibold text-3xl text-center border-b-1 border-gray-200 p-3'>Profile</h1>
        <div className='flex flex-col gap-2 w-full max-w-180 m-auto px-5'>
        <h2 className='font-semibold text-xl'>Basics:</h2>
          <p>Firstname</p>
          <p onClick={()=>openModal('firstname')} className='p-2 border-1 border-gray-300 rounded-lg '>{user.firstname}</p>
          <p>Lastname</p>
          <p onClick={()=>openModal('lastname')} className='p-2 border-1 border-gray-300 rounded-lg'>{user.lastname}</p>
          <p>Bio</p>
          <p onClick={()=>openModal('bio')} className='h-30 p-2 border-1 border-gray-300 rounded-lg truncate'>{user.bio}</p>
        </div>
      <hr className='mx-5 text-gray-200'/>
      {user.role === 'tutor' &&       
      <div className="flex flex-col gap-2 w-full max-w-180 m-auto px-5">
          <h2 className='font-semibold text-xl'>Academic Information:</h2>   
          <p>Educations</p>
          <div className='flex flex-row wrap gap-1'>
          {user.educations.length>0 ?user.educations.map((e) => <p className='p-2 border-1 border-gray-300 rounded-lg '>{e}</p>)
          : "-None-"}
          </div>
          <p>Specialization</p>
          <div className='flex flex-row wrap gap-1'>
          {user.specialization.length>0 ?user.specialization.map((e) => <p className='p-2 border-1 border-gray-300 rounded-lg '>{e}</p>)
          : "-None-"}
          </div>
          <p>Teaching styles</p>
          <div className='flex flex-row wrap gap-1'>
          {user.teaching_style.length>0 ?user.teaching_style.map((e) => <p className='p-2 border-1 border-gray-300 rounded-lg '>{e}</p>)
          : "-None-"}
          </div>
      </div>}
      <div className="flex flex-col gap-2 w-full max-w-180 m-auto px-5">
          <h2 className='font-semibold text-xl'>Contact Information:</h2>
          <p>Email</p>
          <p className='p-2 border-1 border-gray-300 rounded-lg bg-gray-200'>{user.email}</p>
          <p>Phone</p>
          <p onClick={()=> openModal('phone')}className='p-2 border-1 border-gray-300 rounded-lg'>{user.phone || 'Not provided'}</p>
      </div>
      <hr className='mx-5 text-gray-200'/>
        <div className="flex flex-col gap-2 w-full max-w-180 m-auto px-5 pb-10">
          <h2 className="font-semibold text-xl">Balance:</h2>
          <p>{`${user.balance} Tokens` || "0 Tokens"}</p>
          
          {user.role=="tutor" && (
            <button className="w-30 bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-4 rounded-full" onClick={handlePayout}>Payout</button>
          )}
        </div>
      </div>
      {/* 🔹 Modal Popup for Profile Updates */}
      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h3>{'Update '+modalType}</h3>
            {modalType !== 'profilePicture' &&
              <textarea
              className='border p-2 rounded-md text-sm resize-none dark:bg-zinc-900 dark:text-white'
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
              <button  onClick={handleUpdate} className="update-btn">Update</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Myprofile;
