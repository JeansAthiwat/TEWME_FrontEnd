import "./VideoPlayer.css"

const VideoPlayer = ({ videoObj }) => {
    // var player;
    // function onYouTubeIframeAPIReady() {
    // player = new YT.Player('player', {
    //     height: '390',
    //     width: '640',
    //     videoId: 'M7lc1UVf-VE',
    //     playerVars: {
    //     'playsinline': 1
    //     },
    //     events: {
    //     'onReady': onPlayerReady,
    //     'onStateChange': onPlayerStateChange
    //     }
    // });
    // }
    return (<>
        <div className='videoWrapper'>
            <iframe 
                width="560"
                height="315"
                src={videoObj.video_urls}
                title="YouTube video player"
                frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerpolicy="strict-origin-when-cross-origin" allowfullscreen>
            </iframe>
        </div>
    </>)
}

export default VideoPlayer