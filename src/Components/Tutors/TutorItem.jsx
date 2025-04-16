import React from 'react';
import { Link } from 'react-router-dom';
import './TutorItem.css';

const TutorItem = (props) => {
  console.log(props)
  return (
    <Link to={`/tutor/${props.tutor_id}`} style={{ textDecoration: "none", color: "inherit" }}>
    <div className='overflow-hidden shadow-md rounded-xl'>
      <div className="flex items-center justify-center p-4 bg-gray-100">
          <img className="w-48 h-48 object-cover overflow-hidden rounded-full border-blue-200 border-5 bg-white" onClick={window.scrollTo(0, 0)} src={props.profilePicture} alt="Tutor" />
      </div>
        <div className="p-4 space-y-2 h-24">
          <p className="text-lg font-semibold truncate">
            {props.firstname} {props.lastname}
          </p>
          <div className="text-sm  font-medium text-ellipsis">
            <p>Specialization: <span className='text-gray-600'>{Array.isArray(props.specialization) && props.specialization.join(", ")}</span></p>
            
          </div>
        </div>
    </div>
  </Link>


  );
};

export default TutorItem;
