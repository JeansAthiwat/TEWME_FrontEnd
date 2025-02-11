import VideoPlayer from '../Components/VideoPlayer/VideoPlayer'
import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'

const VideoPage = () => {
    const {courseId, videoNumber} = useParams()
    const [course, setCourse] = useState()
    const [video, setVideo] = useState()

    useEffect(()=>{
        const getCourse = async () => {
            const course = await fetch(`http://localhost:39189/course/${courseId}`)
                                    .then((res)=> res.json())
                                    .then((json)=>json)
            setCourse(course)
            console.log(course)
            setVideo(course.videos[videoNumber])
        }
        getCourse()
    },[])
    
    return (
        <>
            {(video) &&
                <>
                <div className="course-title"><h1 style={{font:70}}>{course.course_name}</h1></div>
                <VideoPlayer videoObj={video}/>
                </>
            }
            {
                <h1 style={{font:70}}>Loading Video</h1>
            }
        </>
    )
}

export default VideoPage