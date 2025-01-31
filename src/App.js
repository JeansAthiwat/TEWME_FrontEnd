import { BrowserRouter, Routes , Route} from 'react-router-dom';
import './App.css';
import Navbar from './Components/Navbar/Navbar';
import Login from './Pages/Login';
import Main from './Pages/Main'
import Mycourse from './Pages/Mycourse';
import Chatbox from './Pages/Chatbox';
import Notification from './Pages/Notification';
import Course from './Pages/Course'
import Myprofile from './Pages/Myprofile';
import Cart from './Pages/Cart'
import Signup from './Pages/Signup'
import Footer from './Components/Footer/Footer';
import Resetpassword from './Pages/Resetpassword';
import { mockLoginAPI } from './api/auth'; // Importing the mock login function

function App() {
  return (
    <div>
      <BrowserRouter>
        {accountState !== "unregistered" && <Navbar />}
        <Routes>
          <Route path="/" element={<Main accountState={accountState} />} />
          <Route path="/mycourse" element={<Mycourse />} />
          <Route path="/chatbox" element={<Chatbox />} />
          <Route path="/notification" element={<Notification />} />
          <Route path="/course/:courseId" element={<Course />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<Login handleLogin={handleLogin} accountState={accountState}/>} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/myprofile" element={<Myprofile />} />
          <Route path="/resetpassword" element={<Resetpassword />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;
