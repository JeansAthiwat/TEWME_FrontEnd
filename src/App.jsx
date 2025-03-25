import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { handleLogin } from './utils/authHandlers';
import Navbar from './Components/Navbar/Navbar';
import Login from './Pages/Login';
import Main from './Pages/Main';
import Mycourse from './Pages/Mycourse';
import Chatbox from './Pages/Chatbox';
import Notification from './Pages/Notification';
import Course from './Pages/Course';
import Myprofile from './Pages/Myprofile';
import Enrollment from './Pages/Enrollment';
import Cart from './Pages/Cart';
import Signup from './Pages/Signup';
import Footer from './Components/Footer/Footer';
import Resetpassword from './Pages/Resetpassword';
import LiveClassForm from './Pages/CreateCourse';
import AdminPage from './Pages/AdminPage';
import VideoPage from './Pages/VideoPage'
import profile_icon from './Components/Assets/profile_icon.png'
import CompleteProfile from './Pages/CompleteProfile';
import LoginSuccess from './Pages/LoginSuccess';
import ToastContainer from "./Components/Toast/ToastContainer";

import TutorProfile from './Pages/TutorProfile';
import Reservation from './Pages/Reservation';
import CreateCourse from './Pages/CreateCourse';


function AppContent({ accountState, setAccountState, profilePicture, setProfilePicture ,email, setEmail}) {
  const location = useLocation();
  const hideNavbarPaths = ['/login', '/signup', '/resetpassword'];
  const shouldShowNavbar = !hideNavbarPaths.includes(location.pathname);

  const handleLoginWrapper = (email, password) => handleLogin(email, password, setAccountState, setEmail);

  const handleLogout = () => {
    localStorage.removeItem('profilePicture');
    localStorage.removeItem('token'); // ✅ Remove token on logout
    localStorage.removeItem('accountState'); // ✅ Remove saved user role
    setAccountState("unregistered");
    setProfilePicture(profile_icon)
  };

  useEffect(() => {
    const storedProfilePicture = localStorage.getItem('profilePicture');
    if (storedProfilePicture) {
      setProfilePicture(storedProfilePicture);
    }
  }, []);

  return (
    <>
      {shouldShowNavbar && <><Navbar accountState={accountState} onLogout={handleLogout} profilePicture={profilePicture} /></>}
      <Routes>
        <Route path="/" element={<Main accountState={accountState} />} />
        <Route path="/main" element={<Main accountState={accountState} />} />
        <Route path="/mycourse" element={<Mycourse email={email}/>} />
        <Route path="/enrollment" element={<Enrollment/>} />
        <Route path="/chatbox" element={<Chatbox />} />
        <Route path="/reservation" element={<Reservation />} />
        <Route path="/notification" element={<Notification />} />
        <Route path='/course/:courseId/video/:videoNumber' element={<VideoPage />} />
        <Route path="/course/:courseId" element={<Course />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/login" element={<Login handleLogin={handleLoginWrapper} accountState={accountState} 
          setAccountState={setAccountState} setProfilePicture={setProfilePicture}
          email={email} setEmail={setEmail} />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/myprofile" element={<Myprofile profilePicture={profilePicture} setProfilePicture={setProfilePicture} />} />
        <Route path="/resetpassword" element={<Resetpassword />} />
        {/* <Route path='/createcourse' element={<LiveClassForm email={email} />} /> */}
        <Route path='/admin' element={<AdminPage />} />
        <Route path="/login-success" element={<LoginSuccess setAccountState={setAccountState} setProfilePicture={setProfilePicture} />} />
        <Route path="/complete-profile" element={<CompleteProfile setAccountState={setAccountState} setProfilePicture={setProfilePicture} />} />
        <Route path='/tutor/:tutorId' element={<TutorProfile />} />
      </Routes>
      {shouldShowNavbar}
      <Footer />
    </>
  );
}

function App() {
  const [accountState, setAccountState] = useState(() => {
    return localStorage.getItem('accountState') || "unregistered"; // ✅ Load from storage
  });
  const [profilePicture, setProfilePicture] = useState(() => {
    return localStorage.getItem("profilePicture") || profile_icon; // Load from localStorage
  });
  const [email, setEmail] = useState(() => {
    return localStorage.getItem("email") || ""; // Load from localStorage
  });
  useEffect(() => {
    localStorage.setItem('accountState', accountState); // ✅ Save state when changed
  }, [accountState]);
  useEffect(() => {
    localStorage.setItem('profilePicture', profilePicture); // ✅ Save state when changed
  }, [profilePicture]);
  useEffect(() => {
    localStorage.setItem('email', email); // ✅ Save state when changed
  }, [email]);

  return (
    <div>
      <ToastContainer />
      <BrowserRouter>
        <AppContent accountState={accountState} setAccountState={setAccountState} 
        profilePicture={profilePicture} setProfilePicture={setProfilePicture} 
        email={email} setEmail={setEmail}/>
      </BrowserRouter>
    </div>
  );
}

export default App;
