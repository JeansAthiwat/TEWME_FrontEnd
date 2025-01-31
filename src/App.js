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
import LiveClassForm from './Pages/CreateCourse';

function App() {
  return (
    <div>
      <BrowserRouter>
      <Navbar/>
      <Routes>
      <Route path='/' element={<Main/>}/>
        <Route path='/mycourse' element={<Mycourse/>}/>
        <Route path='/chatbox' element={<Chatbox/>}/>
        <Route path='/notification' element={<Notification/>}/>
        <Route path="/course" element={<Course/>}>
          <Route path=':courseId' element={<Course/>}/>
        </Route>
        <Route path='/cart' element={<Cart/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/signup' element={<Signup/>}/>
        <Route path='/myprofile' element={<Myprofile/>}/>
        <Route path='/resetpassword' element={<Resetpassword/>}/>
        <Route path='/createcourse' element={<LiveClassForm/>}/>
      </Routes>
        <Footer/>
      </BrowserRouter>
    </div>
  );
}

export default App;
