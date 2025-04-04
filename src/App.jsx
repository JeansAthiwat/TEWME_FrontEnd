import { io } from "socket.io-client";
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


function AppContent({ accountState, setAccountState, profilePicture, setProfilePicture, email, setEmail }) {
  const location = useLocation();
  const hideNavbarPaths = ['/login', '/signup', '/resetpassword'];
  const shouldShowNavbar = !hideNavbarPaths.includes(location.pathname);
  const [socket, setSocket] = useState(null)

  useEffect(() => {
    // Connect to the Socket.IO server
    if(localStorage.getItem("token")) {
      const socketInstance = io("http://localhost:39189", {
        auth: {
          token: localStorage.getItem('token')
        }
      });
  
      // Handle connection
      socketInstance.on("connect", () => {
        console.log("✅ Connected to socket server with ID:", socketInstance.id);
      });

      // socketInstance.on("private message", ({ from, message }) => {
      //   console.log("TODO: Implement notification");
      // });

      socketInstance.on("message stored", (response) => {
        console.log(response);
      })

      setSocket(socketInstance);
  
      // Clean up when component unmounts
      return () => {
        socketInstance.disconnect();
      };
    }
  }, []);

  const handleLoginWrapper = (email, password) => handleLogin(email, password, setAccountState, setEmail);

  const handleLogout = () => {
    localStorage.clear();

    // ✅ Reset state variables
    setAccountState("unregistered");
    setProfilePicture(profile_icon);
    setEmail("");
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
        <Route path="/mycourse" element={<Mycourse UID={localStorage.getItem('UID')} email={email} />} />
        <Route path="/enrollment" element={<Enrollment />} />
        <Route path="/chatbox" element={<Chatbox socket={socket} />} />
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
    return localStorage.getItem("email"); // Load from localStorage
  });

  useEffect(() => {
    if (localStorage.getItem('accountState') !== accountState) {
      localStorage.setItem('accountState', accountState);
    }
  }, [accountState]);

  useEffect(() => {
    if (localStorage.getItem('profilePicture') !== profilePicture) {
      localStorage.setItem('profilePicture', profilePicture);
    }
  }, [profilePicture]);

  useEffect(() => {
    const storedEmail = localStorage.getItem("email");

    // Only update if email is not already stored
    if (email && email !== storedEmail) {
      localStorage.setItem("email", email);
    }
  }, [email]);

  return (
    <div>
      <ToastContainer />
      <BrowserRouter>
        <AppContent accountState={accountState} setAccountState={setAccountState}
          profilePicture={profilePicture} setProfilePicture={setProfilePicture}
          email={email} setEmail={setEmail} />
      </BrowserRouter>
    </div>
  );
}

export default App;
