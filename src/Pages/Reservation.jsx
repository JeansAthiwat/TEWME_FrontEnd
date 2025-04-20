import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "./CSS/Reservation.css";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LoadingScreen from '../Components/LoadingScreen/LoadingScreen';
import { Video, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';



const Reservation = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reservType, setReservType] = useState('All')
  const [error, setError] = useState(null);
  const [viewType, setViewType] = useState('all'); // 'all' or 'weekly'

  useEffect(() => {
    fetchReservations(viewType);
  }, [viewType]);
  const colorMap = {
    'Math': '#ff6b6b',       // Red
    'Science': '#4edcc4',    // Teal
    'Programming': '#45b7d1', // Blue
    'Art': '#96ceb4',        // Sage Green
    'Language': '#ebd249',   // Light Yellow
    'Music': '#d4a5a5'       // Dusty Rose
  };
  const getSubjectColor = (subject) => {

    return colorMap[subject] || '#666666'; // Default gray if subject not found
  };

  const fetchReservations = async (type) => {
    try {
      const token = localStorage.getItem('token');
      const url = type === 'weekly' 
        ? '/api/reservation/weekly'
        : '/api/reservation?page=1';
  
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
  
      const result = response.data;
  
      if (result.success) {
        console.log(result.data);
        setReservations(result.data);
      } else {
        throw new Error('Failed to get reservation data');
      }
      console.log(result.data)
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      setLoading(false);
    }
  };

  // const handleViewChange = (type) => {
  //   setViewType(type);
  // };

  // const handleCheckboxChange = async (id, currentFinish) => {
  //   try {
  //     const token = localStorage.getItem('token');
  //     const updatedReservations = reservations.map((reservation) =>
  //       reservation._id === id ? { ...reservation, finish: !currentFinish } : reservation
  //     );
  //     setReservations(updatedReservations); // Update local state

  //     const response = await fetch(`/api/reservation/${id}`, {
  //       method: 'PUT',
  //       headers: {
  //         'Authorization': `Bearer ${token}`,
  //         'Content-Type': 'application/json'
  //       },
  //       body: JSON.stringify({ finish: !currentFinish })
  //     });

  //     if (!response.ok) {
  //       throw new Error('Failed to update reservation');
  //     }
  //     else {
  //       console.log("its fine")
  //     }
  //   } catch (err) {
  //     console.error(err);
  //     toast.error('Error updating reservation status');
  //   }
  // };


  if (loading) return <LoadingScreen />;
  if (error) return <div>Error: {error}</div>;

  return (
    // <div className="reservation-container">
    //   <ToastContainer position="top-center" autoClose={3000} pauseOnHover={false} />
    //   <div className="reservation-header">
    //     <h1>Course Reservations</h1>
    //     <div className="view-controls">
    //       <div className="toggle-buttons">
    //         <button 
    //           className={`toggle-button ${viewType === 'all' ? 'active' : ''}`}
    //           onClick={() => handleViewChange('all')}
    //         >
    //           All Courses
    //         </button>
    //         <button 
    //           className={`toggle-button ${viewType === 'weekly' ? 'active' : ''}`}
    //           onClick={() => handleViewChange('weekly')}
    //         >
    //           This Week
    //         </button>
    //       </div>
    //       <div className="reservation-count">
    //         <span className="count-number">{reservations.length}</span>
    //         <span className="count-text">Courses</span>
    //       </div>
    //     </div>
    //   </div>
    //   {reservations.map((reservation) => (
    //     <div key={reservation._id} className="course-header">
    //       <div className="course-title-section">
    //         <h2>{reservation.course.course_name}</h2>
    //         <span 
    //           className="status-badge" 
    //           style={{ backgroundColor: getSubjectColor(reservation.course.subject) }}
    //         >
    //           {reservation.course.subject}
    //         </span>
    //       </div>
    //       <div className="course-details">
    //         <div className="detail-row">
    //           <span className="label">Course Type</span>
    //           <span className="value status-green">{reservation.course.course_type}</span>
    //         </div>
    //         <div className="detail-row">
    //           <span className="label">Course Length</span>
    //           <span className="value">{reservation.course.course_length} hours</span>
    //         </div>
    //         <div className="detail-row">
    //           <span className="label">Price</span>
    //           <span className="value">{reservation.course.price} THB</span>
    //         </div>
    //         <div className="detail-row">
    //           <span className="label">Location / Time</span>
    //           <span className="value">
    //             {/* {reservation.course.live_detail.location} (
    //             {new Date(reservation.course.live_detail.start_time).toLocaleString()}) */}
    //           </span>
    //         </div>
    //         <div className="detail-row">
    //           <span className="label">Mark as Finished</span>
    //           <input
    //             type="checkbox"
    //             className="large-checkbox"
    //             checked={!!reservation.finish}
    //             onChange={() => handleCheckboxChange(reservation._id, reservation.finish)}
    //           />
    //         </div>
    //       </div>
    //     </div>
    //   ))}
    // </div>
    <div className='p-4  gap-3 w-[90vw] min-w-70 m-auto my-30 md:max-w-200 flex flex-col min-h-screen '>
      <h1 className='font-semibold text-3xl'>My reservations</h1>
      <div className='flex flex-row gap-2'>
      <TypeButton onClick={()=> setReservType('All')} type={'All'} currenType={reservType} />
      <TypeButton onClick={()=> setReservType('Video')} type={'Video'} currenType={reservType} />
      <TypeButton onClick={()=> setReservType('Live')} type={'Live'} currenType={reservType} />
      </div>
      <div className=' flex flex-col gap-2 '>
        {reservations.map((e) => 
        (reservType==='All' || reservType=== e.course.course_type) && <Link to={`/course/${e.course._id}`} key={e._id}
        className='hover:text-blue-600 hover:border-blue-600 rounded-md border-gray-400 border-1 flex flex-col p-3 gap-2'>
          <div className='flex flex-row justify-between'>
            <h2 className='truncate text-lg '>{e.course.course_name}</h2>
            {e.course.course_type === 'Video' ? 
            <div className='flex flex-row gap-[2px] items-center'>
              <p className='hidden md:block text-sm '>Video</p><Video className='h-full' />
            </div> 
            : <div className='flex flex-row gap-[2px] items-center'>
              <p className='hidden md:block text-sm'>Live</p><MapPin className='h-full text-red-600' />
              </div>}
          </div>
          <div className='flex flex-row gap-2'>{e.course.tags?.map((t,i) => 
            <h3 key={i} className={`text-blue-600  text-[14px]`}>{t}</h3>)}
            </div>
          <p className='text-gray-400 text-sm'>Bought at {new Date(e.payment_date).toLocaleString()}</p>
        </Link>)}
      </div>
    </div>
  );
};

const TypeButton = ({type, currenType, onClick}) => {

  return    <button onClick={onClick} className={`border-1  rounded-xl w-20 ${type===currenType ? ' bg-blue-600 text-white': 'hover:bg-blue-200 border-gray-600'} `}>
        {type}
  </button>
}

export default Reservation;
