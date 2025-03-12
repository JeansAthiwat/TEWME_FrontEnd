import React from 'react';
import { Link } from 'react-router-dom';
import './Tutors.css';

const TutorItem = (props) => {
  return (
    <div className='tutor-item'>
      <div className="tutor-head">
        <Link to={`/tutor/${props.tutor_id}`}>
          <img onClick={window.scrollTo(0, 0)} src={props.profile_picture} alt="Tutor" />
        </Link>
      </div>
      <Link to={`/tutor/${props.tutor_id}`} style={{ textDecoration: "none", color: "inherit" }}>
        <div className="tutor-detail">
          <p className="tutor-name">
            {props.firstname} {props.lastname}
          </p>
          <div className="tutor-detail-specialization">
            <p>Specialization:</p>
            {props.specialization}
          </div>
        </div>
      </Link>
    </div>
  );
};

export default TutorItem;
