import React, { useRef, useEffect, useState } from 'react'
import {
    Box,
    Container,
    Flex,
} from '@chakra-ui/react';

import VideoCard from './VideoCard';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import { getVideoById } from '../../services/videoService';
import LoadingScreen from '../basic/LoadingScreen';
import Footer from '../basic/Footer';

function ExpandedVideoCard() {

    const { state } = useLocation();
    const params = useParams();
    const navigate = useNavigate();

    const playerRef = useRef(null);
    const containerRef = useRef(null);
    const mounted = useRef(true);

    const [isMuted, setIsMuted] = useState((state && state.navigated) ? false : true);
    console.log(state)
    const [loading, setLoading] = useState(true);
    const [video, setvideo] = useState({});



    useEffect(() => {

        if (!playerRef.current) return;
        if (isMuted) {
            playerRef.current.muted(true);
        } else {
            playerRef.current.muted(false);
        }

    }, [isMuted]);

    useEffect(() => {

        mounted.current = true;

        if (!params.id && video) return;
        setLoading(true);

        async function fetchVideo() {
            try {
                const response = await getVideoById(params.id);
                if (mounted.current) {
                    setvideo(response.data);
                    setLoading(false);
                }
            } catch (error) {
                navigate('/not-found');
            }
        }

        fetchVideo();

        return () => {
            mounted.current = false;
        }

    }, [params.id]);

    const videoJsOptions = {
        autoplay: isMuted ? 'muted' : true,
        loadingSpinner: false,
        controls: false,
        loop: true,
        techOrder: ["theta_hlsjs", "html5"],
        preload: 'auto',
        sources: [{
            src: video && video.video_url,
            type: "application/vnd.apple.mpegurl",
            label: "1080p"
        }]
    }


    const handlePlayerReady = (player) => {
        playerRef.current = player;
    };


    if (loading) {
        return <LoadingScreen />
    }



    return (
        <>
            <Flex ref={containerRef} w="100%" minH="100vh" pt="14vh" pb="20" justify="center" >
                <Container
                    maxW={'6xl'}
                    position="relative"
                    flexDirection="column"
                    px={{ base: 0, md: 4 }}
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
                        handleViews={true}
                    />

                </Container>
            </Flex>
            <Box pb={8}>
                <Footer />
            </Box>
        </>
    )
}

export default ExpandedVideoCard


