import React from 'react';
import { Link } from 'react-router-dom';
import './CourseItem.css';
import course_pic from '../Assets/course_id1.png';


const CourseItem = (props) => {
  // console.log(props)
  return (
        <Link to={`/course/${props.course_id}`}>
          <div className="rounded overflow-hidden shadow-md border-1 border-gray-100 hover:scale-105 hover:shadow-xl">
            <div className="w-full h-48 overflow-hidden">
              <img
                className="w-full h-full object-cover cursor-pointer"
                onClick={() => window.scrollTo(0, 0)}
                src={props.course_profile || course_pic}
                alt=""
              />
            </div>

            <div className="p-4 space-y-2 flex flex-col">
              <p className="text-xl font-semibold truncate">{props.course_name}</p>
              <div className="text-sm text-gray-600 font-medium">
                <p><span className="truncate">Course length:</span> {props.course_length}</p>
                <p><span className="truncate">Course type:</span> {props.course_type}</p>
                <p className="truncate justify-self-end text-blue-600 text-[15px]"> ฿{props.price}</p>
              </div>
            </div>
          </div>
        </Link>
  );
};

export default CourseItem;