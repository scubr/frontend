import React, { useRef, useEffect } from 'react'
import {
    Flex,
    useBreakpointValue,
} from '@chakra-ui/react';
import VideoCard from './VideoCard';


function HomeVideoCard({ video, isMuted, setIsMuted }) {


    const playerRef = useRef(null);




    useEffect(() => {

        if (!playerRef.current) return;
        if (isMuted) {
            playerRef.current.muted(true);
        } else {
            playerRef.current.muted(false);
        }

    }, [isMuted]);


    const videoJsOptions = {
        autoplay: 'muted',
        loadingSpinner: false,
        controls: false,
        loop: true,
        techOrder: ["theta_hlsjs", "html5"],
        preload: 'auto',
        sources: [{
            src: video.video_url,
            type: "application/vnd.apple.mpegurl",
            label: "1080p"
        }]
    }


    const handlePlayerReady = (player) => {
        playerRef.current = player;
    };


    return (
        <>
            <Flex w="100%" mt="10vh" justify={useBreakpointValue({ base: "center", xl: "start" })} align="center">
                <Flex
                    w={useBreakpointValue({ base: "100%", md: "96%", xl: "90%" })}
                    position="relative"
                    flexDirection="column"
                >
                    <VideoCard
                        videoJsOptions={videoJsOptions}
                        video_id={video.video_id}
                        video_url={video.video_url}
                        title={video.title}
                        caption={video.caption}
                        creation_timestamp={video.creation_timestamp}
                        name={video.name}
                        image_url={video.image_url}
                        creator_id={video.creator_id}
                        liked={video.liked}
                        saved={video.saved}
                        following={video.following}
                        views={video.views}
                        likes={video.likes}
                        comments={video.comments}
                        onReady={handlePlayerReady}
                        isMuted={isMuted}
                        setIsMuted={setIsMuted}
                        pauseOnLeave={true}
                        handleViews={true}
                    />
                </Flex>
            </Flex>
            {/* <Divider /> */}
        </>
    )
}

export default HomeVideoCard

