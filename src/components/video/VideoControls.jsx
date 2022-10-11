import React, { useState } from 'react'
import {
    Box,
    ScaleFade,
    Spacer,
    useBreakpointValue,
} from '@chakra-ui/react';

import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { IoBookmark, IoBookmarkOutline, IoVolumeMedium, IoVolumeMute } from "react-icons/io5";
import CommentsSection from '../CommentsSection';
import VideoInfo from '../VideoInfo';
import { likeAVideo, unlikeAVideo, saveAVideo, unsaveAVideo } from '../../services/videoService';

const VideoControls = ({
    video_id,
    liked,
    saved,
    likes,
    isMuted,
    setIsMuted,
    comments
}) => {

    const [isVideoLiked, setIsVideoLiked] = useState(liked);
    const [videoLikes, setvideoLikes] = useState(likes);
    const [isVideoSaved, setIsVideoSaved] = useState(saved);
    const hideBelowmd = useBreakpointValue({ base: "none", md: "block" });
    const controllerSize = useBreakpointValue({ base: "18", lg: "26", xl: "30" });


    const handleLikeButton = async () => {
        setIsVideoLiked(true);
        setvideoLikes(videoLikes + 1);
        const status = await likeAVideo(video_id);
        if (status !== 204) {
            setIsVideoLiked(false);
        }
    }

    const handleUnlikeButton = async () => {
        if (videoLikes === 0) return;
        setIsVideoLiked(false);
        setvideoLikes(videoLikes - 1);
        const status = await unlikeAVideo(video_id);
        if (status !== 204) {
            setIsVideoLiked(true);
        }
    }

    const handelSaveButton = async () => {
        setIsVideoSaved(true);
        const status = await saveAVideo(video_id);
        if (status !== 204) {
            setIsVideoSaved(false);
        }
    }

    const handelUnsaveButton = async () => {
        setIsVideoSaved(false);
        const status = await unsaveAVideo(video_id);
        if (status !== 204) {
            setIsVideoSaved(true);
        }
    }



    return (
        <>
            <VideoInfo onClick={() => setIsMuted(!isMuted)}>
                {isMuted ?
                    <IoVolumeMute size={controllerSize} />
                    : <IoVolumeMedium size={controllerSize} />
                }
            </VideoInfo>
            <Spacer />

            <Box
                display={hideBelowmd}
            >
                {!isVideoLiked ? (
                    <VideoInfo
                        text={videoLikes}
                        onClick={handleLikeButton}
                    >
                        <AiOutlineHeart size={controllerSize} />
                    </VideoInfo>
                ) : (
                    <VideoInfo
                        text={videoLikes}
                        onClick={handleUnlikeButton}
                    >
                        <ScaleFade initialScale={0.1} in={isVideoLiked}>
                            <AiFillHeart color="red" size={controllerSize} />
                        </ScaleFade>
                    </VideoInfo>
                )}

                <CommentsSection
                    noOfComments={comments}
                    video_id={video_id}
                    controllerSize={controllerSize}
                />

                {!isVideoSaved ? (
                    <VideoInfo
                        onClick={handelSaveButton}
                    >
                        <IoBookmarkOutline size={controllerSize} />
                    </VideoInfo>
                ) : (
                    <VideoInfo
                        onClick={handelUnsaveButton}
                    >
                        <ScaleFade initialScale={0.1} in={isVideoSaved}>
                            <IoBookmark size={controllerSize} />
                        </ScaleFade>
                    </VideoInfo>
                )}
            </Box>
        </>
    )
}

export default VideoControls;