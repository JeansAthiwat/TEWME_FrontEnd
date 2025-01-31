import React from 'react'
import { Link } from "react-router-dom";

const Mycourse = () => {
  // const [list,setList] = React.useState("courses")

  return (
    <div>
      <Link to="/createcourse">
      <button className="px-4 py-2 bg-blue-500 text-white rounded">
        Create Course.
      </button>
    </Link>
    </div>
  )
}

export default Mycourse
