import './CSS/VideoPage.css'
import ReactPlayer from 'react-player'
import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'

const VideoPlayer = ({ videoObj, videoNumber, courseId }) => {
    return (
      <div className="playerWrapper">
        <ReactPlayer className="react-player" url={videoObj.video_urls} controls={true} height={"100%"} width={"100%"}
        onProgress={(state) => localStorage.setItem(`videoProgress_${courseId}_${videoNumber}`, Math.max(localStorage.getItem(`videoProgress_${courseId}_${videoNumber}`),state.playedSeconds))}
        onDuration={(duration) => localStorage.setItem(`videoDuration_${courseId}_${videoNumber}`, duration)}
        />
      </div>
    );
};

const VideoPage = () => {
    const {courseId, videoNumber} = useParams()
    const [course, setCourse] = useState()
    const [video, setVideo] = useState()
    const [videoProgress, setVideoProgress] = useState(
        parseFloat(localStorage.getItem(`videoProgress_${courseId}_${videoNumber}`)) || 0
      );
      const [videoDuration, setVideoDuration] = useState(
        parseFloat(localStorage.getItem(`videoDuration_${courseId}_${videoNumber}`)) || 1 // default to 1 to avoid division by zero
      );

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

    useEffect(() => {
        // Update videoProgress whenever it changes in localStorage
        const progressInterval = setInterval(() => {
          const progress = parseFloat(localStorage.getItem(`videoProgress_${courseId}_${videoNumber}`));
          const duration = parseFloat(localStorage.getItem(`videoDuration_${courseId}_${videoNumber}`));
          
          if (!isNaN(progress) && !isNaN(duration)) {
            setVideoProgress(progress);
            setVideoDuration(duration);
          }
        }, 1000); // Check for updates every second
    
        return () => clearInterval(progressInterval); // Cleanup interval on component unmount
      }, []);
    
    const progressPercentage = Math.round((videoProgress * 100) / videoDuration);

    return (
        <>
            {(video) &&
                <>
                <div className="course-title">{course.course_name}</div>
                <div className="video-section">
                    <VideoPlayer videoObj={video} videoNumber={videoNumber} courseId={courseId}/>
                    <div className="progress-bar" style={{width:progressPercentage+"%"}}></div>
                </div>
                </>
            }
            {
                (!video) &&
                <h1 style={{font:70}}>Loading Video</h1>
            }
        </>
    )
}

export default VideoPage