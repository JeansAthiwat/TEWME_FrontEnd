import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useState } from 'react';
import './App.css';
import Navbar from './Components/Navbar/Navbar';
import Login from './Pages/Login';
import Main from './Pages/Main';
import Mycourse from './Pages/Mycourse';
import Chatbox from './Pages/Chatbox';
import Notification from './Pages/Notification';
import Course from './Pages/Course';
import Myprofile from './Pages/Myprofile';
import Cart from './Pages/Cart';
import Signup from './Pages/Signup';
import Footer from './Components/Footer/Footer';
import Resetpassword from './Pages/Resetpassword';
import LiveClassForm from './Pages/CreateCourse';
import { handleLogin } from './utils/authHandlers'; // Import the new login handler

function AppContent({ accountState, setAccountState }) {
  const location = useLocation();
  const hideNavbarPaths = ['/login', '/signup', '/resetpassword'];
  const shouldShowNavbar = !hideNavbarPaths.includes(location.pathname);

  const handleLogout = () => {
    setAccountState("unregistered");
  };

  return (
    <>
      {shouldShowNavbar && <Navbar accountState={accountState} onLogout={handleLogout} />}
      <Routes>
        <Route path="/" element={<Main accountState={accountState} />} />
        <Route path="/mycourse" element={<Mycourse accountState={accountState}/>} />
        <Route path="/chatbox" element={<Chatbox />} />
        <Route path="/notification" element={<Notification />} />
        <Route path="/course/:courseId" element={<Course />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/login" element={<Login handleLogin={(email, password) => handleLogin(email, password, setAccountState)} accountState={accountState}/>} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/myprofile" element={<Myprofile />} />
        <Route path="/resetpassword" element={<Resetpassword />} />
        <Route path='/createcourse' element={<LiveClassForm/>}/>
      </Routes>
      <Footer />
    </>
  );
}

function App() {
  const [accountState, setAccountState] = useState("unregistered");

  return (
    <div>
      <BrowserRouter>
        <AppContent accountState={accountState} setAccountState={setAccountState} />
      </BrowserRouter>
    </div>
  );
}

export default App;
