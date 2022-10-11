import React, { useEffect, useState } from "react";
import {
    Skeleton,
} from '@chakra-ui/react';
import { useInView } from 'react-intersection-observer';
import { addViewToVideo } from "../../services/videoService";

export const VideoJS = (props) => {

    const videoRef = React.useRef(null);
    const playerRef = React.useRef(null);
    const [delayHandler, setDelayHandler] = useState(null);
    const [isVideoLoaded, setisVideoLoaded] = useState(false);
    const { options, onReady, maintainAspect, pauseOnLeave, handleViews, video_id } = props;

    const { ref, inView } = useInView({
        threshold: 0.5,
        rootMargin: "240px 0px -240px 0px"
    });

    useEffect(() => {
        // make sure Video.js player is only initialized once
        if (!playerRef.current) {
            const videoElement = videoRef.current;
            if (!videoElement) return;

            const player = playerRef.current = window.videojs(videoElement, options, () => {
                setisVideoLoaded(true);
                onReady && onReady(player);
            });
        } else {
            // you can update player here [update player through props]
            const player = playerRef.current;
            if (pauseOnLeave) {
                if (inView) {
                    player.play();
                } else {
                    player.pause();
                }

            }
        }
    }, [options, videoRef, onReady, isVideoLoaded, inView, pauseOnLeave]);

    // Dispose the Video.js player when the functional component unmounts
    useEffect(() => {
        const player = playerRef.current;

        return () => {
            if (player) {
                player.dispose();
                playerRef.current = null;
            }
        };
    }, [playerRef, isVideoLoaded]);



    //check of user view the content more than 15 seconds
    useEffect(() => {
        if (!handleViews) return;
        if (inView) {
            setDelayHandler(setTimeout(() => {
                addViewToVideo(video_id);
            }, 15000))
        } else {
            clearTimeout(delayHandler)
        }
    }, [inView, handleViews]);





    return (
        <Skeleton ref={ref} h={maintainAspect ? '100%' : '300'} w={maintainAspect ? '100%' : '600'} isLoaded={isVideoLoaded} cursor="pointer">
            <video playsInline={true} ref={videoRef} className={maintainAspect && "aspect-ratio__inner-wrapper"} />
        </Skeleton>
    );

}

export default VideoJS;