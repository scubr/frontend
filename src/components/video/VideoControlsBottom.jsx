import React, { useState } from 'react'
import {
    ScaleFade,
    Flex,
    Spacer,
    useBreakpointValue,
    Box,
} from '@chakra-ui/react';

import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { IoBookmark, IoBookmarkOutline } from "react-icons/io5";
import { RiSendPlaneLine } from "react-icons/ri"
import CommentsSection from '../CommentsSection';
import { likeAVideo, unlikeAVideo, saveAVideo, unsaveAVideo } from '../../services/videoService';

const VideoControlsBottom = ({
    video_id,
    liked,
    saved,
    likes,
    comments
}) => {

    const [isVideoLiked, setIsVideoLiked] = useState(liked);
    const [videoLikes, setvideoLikes] = useState(likes);
    const [isVideoSaved, setIsVideoSaved] = useState(saved);
    const controllerSize = useBreakpointValue({ base: "24", sm: "26", md: "30" });


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

    const handleShareButton = () => {
        if (navigator.share) {
            navigator.share({
                title: 'Share',
                text: 'Share',
                url: window.location.href,
            })
                .then(() => console.log('Successful share'))
                .catch((error) => console.log('Error sharing', error));
        } else {
            console.log("Share not supported");
        }
    }


    return (
        <Flex px="1" py="2">
            {!isVideoLiked ? (
                <Box
                    cursor={"pointer"}
                    mr={4}
                    onClick={handleLikeButton}
                >
                    <AiOutlineHeart size={controllerSize} />
                </Box>
            ) : (
                <Box
                    cursor={"pointer"}
                    mr={4}
                    onClick={handleUnlikeButton}
                >
                    <ScaleFade initialScale={0.1} in={isVideoLiked}>
                        <AiFillHeart color="red" size={controllerSize} />
                    </ScaleFade>
                </Box>
            )}

            <CommentsSection
                noOfComments={comments}
                video_id={video_id}
                controllerSize={controllerSize}
                cover={false}
            />
            <Box
                ml={4}
                cursor={"pointer"}
                onClick={handleShareButton}
            >
                <RiSendPlaneLine size={controllerSize} />
            </Box>
            <Spacer />

            {!isVideoSaved ? (
                <Box
                    onClick={handelSaveButton}
                    cursor={"pointer"}
                >
                    <IoBookmarkOutline size={controllerSize} />
                </Box>
            ) : (
                <Box
                    onClick={handelUnsaveButton}
                    cursor={"pointer"}
                >
                    <ScaleFade initialScale={0.1} in={isVideoSaved}>
                        <IoBookmark size={controllerSize} />
                    </ScaleFade>
                </Box>
            )}
        </Flex>
    )
}

export default VideoControlsBottom