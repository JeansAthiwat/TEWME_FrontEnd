import React from 'react';
import { Link } from 'react-router-dom';
import './CourseItem.css';
import course_pic from '../Assets/course_id1.png';


const CourseItem = (props) => {
  // console.log(props)
  return (
        <Link to={`/course/${props.course_id}`}>
          <div className="rounded overflow-hidden shadow-md">
            <div className="w-full h-48 overflow-hidden">
              <img
                className="w-full h-full object-cover cursor-pointer"
                onClick={() => window.scrollTo(0, 0)}
                src={props.course_profile || course_pic}
                alt=""
              />
            </div>

            <div className="p-4 space-y-2 ">
              <p className="text-lg font-semibold truncate">{props.course_name}</p>
              <div className="text-sm text-gray-600 font-medium">
                <p><span className="truncate">Price:</span> ${props.price}</p>
                <p><span className="truncate">Course length:</span> {props.course_length}</p>
                <p><span className="truncate">Course type:</span> {props.course_type}</p>
              </div>
            </div>
          </div>
        </Link>
  );
};

export default CourseItem;