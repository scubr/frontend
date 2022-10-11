import React, { useRef } from 'react';
import VideoJS from '../video/VideoJs'
import {
    AspectRatio,
    Box,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

const GalleryCard = ({
    video_id,
    url,
}) => {


    const playerRef = useRef(null);
    const navigate = useNavigate();

    const videoJsOptions = {
        autoplay: false,
        responsive: true,
        height: '200',
        loadingSpinner: false,
        width: '500',
        techOrder: ["theta_hlsjs", "html5"],
        preload: 'auto',
        sources: [{
            src: url,
            type: "application/vnd.apple.mpegurl",
            label: "1080p"
        }],
    }


    const handlePlayerReady = (player) => {

        playerRef.current = player;
    };

    const handleMouseEnter = (e) => {

        if (!playerRef.current) return;
        playerRef.current.play();
    }

    const handleMouseLeave = (e) => {

        if (!playerRef.current) return;
        playerRef.current.pause();
    }

    const handleClick = () => {
        navigate(`/video/${video_id}`, { state: { navigated: true } });
    }


    return (
        <Box
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={handleClick}
            cursor="pointer"
            position="relative"
            maxW={{ base: "50vw", '2xl': "45vw" }}
        >
            <AspectRatio minW="25vw" maxW={{ base: "50vw", '2xl': "45vw" }} ratio={16 / 9}>
                <VideoJS
                    options={videoJsOptions}
                    class="vjs-theme-sea"
                    onReady={handlePlayerReady}
                    maintainAspect={true}
                />
            </AspectRatio>
        </Box>
    )
}

export default GalleryCard