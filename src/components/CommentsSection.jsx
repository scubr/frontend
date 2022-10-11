import React, { useState, useContext } from 'react'
import {
    Box,
    Flex,
    Avatar,
    Heading,
    Text,
    HStack,
    Spacer,
    useDisclosure,
    Input,
    useToast,
    Spinner,
    Divider,
    useColorModeValue
} from '@chakra-ui/react';

import VideoInfo from './VideoInfo';
import { IoSend } from "react-icons/io5";
import { getAllCommentsOnAVideo, commentOnAVideo } from '../services/videoService';
import { userContext } from '../userContext';
import { getTimeDifference } from '../helper/timeHelpers';
import { RiChat3Line } from "react-icons/ri";
import ModalFrame from './basic/ModalFrame';
import { FaChevronLeft } from 'react-icons/fa';

function CommentsSection({ video_id, noOfComments, controllerSize, cover = true }) {

    const { isOpen, onOpen, onClose } = useDisclosure();
    const { currentUserData } = useContext(userContext);
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [userComment, setUserComment] = useState("");
    const [commentsCount, setCommentsCount] = useState(noOfComments);
    const toast = useToast();
    const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;



    const handleOnClick = async (name, image) => {

        //append userComment to comments array
        const currentComment = {
            id: Math.floor(Math.random() * 100000),
            name: name,
            image_url: image,
            comment: userComment,
            creation_timestamp: new Date()
        }

        setComments(comments => [currentComment, ...comments]);
        setUserComment("");
        setCommentsCount(commentsCount + 1);

        //send comment to server
        try {
            await commentOnAVideo(video_id, userComment);
        } catch (error) {
            toast({
                title: 'Error commenting',
                description: 'Please check your internet connection',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
            //remove first comment from comments array
            setComments(comments => comments.slice(1));
            setCommentsCount(commentsCount - 1);
        }

    }


    const handleChatOpen = async () => {

        onOpen();
        setLoading(true);
        try {
            const response = await getAllCommentsOnAVideo(video_id);
            setComments(response.data);
            setLoading(false);
        } catch (error) {
            toast({
                title: 'Error fetching comments',
                description: 'Please check your internet connection',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
            setLoading(false);
        }
    }

    const Content = () => {
        return (
            <>
                {loading && <Spinner />}
                {!loading && comments.length === 0 && <Text>No comments yet</Text>}
                {comments.map((comment) => {
                    return (
                        <Box key={comment.creation_timestamp} my="2">
                            <Flex align="flex-start">
                                <Avatar
                                    size="sm"
                                    src={comment.image_url}
                                />
                                <Box ml={2}>
                                    <Heading display="inline" mr="2" fontSize="sm">{comment.name}</Heading>
                                    <Text display="inline" fontSize="sm">{comment.comment}</Text>
                                    <Text fontSize="xs">{getTimeDifference(comment.creation_timestamp)}</Text>
                                </Box>
                            </Flex>
                            <Spacer mt={2} />
                        </Box>
                    )
                })
                }
            </>
        )
    }

    const Footer = () => {
        return (
            <Box w="100%" pos={"relative"} >
                <Input
                    autoFocus
                    placeholder='Add a comment...'
                    value={userComment}
                    onChange={(e) => setUserComment(e.target.value)}
                    variant="filled"
                    _focus={{ outline: 0 }}
                />
                <Box
                    pos="absolute"
                    right="3"
                    top="50%"
                    transform="translateY(-50%)"
                >
                    <IoSend
                        size={20}
                        cursor="pointer"
                        onClick={() => handleOnClick(currentUserData.name, currentUserData.image_url)}
                        color={useColorModeValue("#718096", "#A0AEC0")}
                    />
                </Box>
            </Box>
        )
    }

    return (
        <>
            <ModalFrame
                isOpen={isOpen}
                onClose={onClose}
                Button={() => (
                    <>
                        {cover ? (
                            <VideoInfo text={commentsCount} onClick={handleChatOpen}>
                                <RiChat3Line
                                    size={controllerSize}
                                />
                            </VideoInfo>
                        ) : (
                            <Box cursor={"pointer"} onClick={handleChatOpen}>
                                <RiChat3Line
                                    size={controllerSize}
                                />
                            </Box>
                        )}
                    </>
                )}
                modalContentFunc={() => (
                    <Box
                        maxH="50vh"
                        minH="40vh"
                        overflow={"scroll"}
                        className={isMac ? "" : "hide-scrollbars"}
                    >
                        <Content />
                    </Box>
                )}
                modalHeaderFunc={() => (
                    <HStack>
                        <RiChat3Line fontSize={24} />
                        <Heading size="md">Comments</Heading>
                    </HStack>
                )}
                modalFooterFunc={() => (
                    <Footer />
                )}
                drawerContentFunc={() => (
                    <Box px={6}>
                        <Content />
                    </Box>
                )}
                drawerHeaderFunc={() => (
                    <>
                        <HStack spacing={6}>
                            <FaChevronLeft onClick={onClose} cursor="pointer" />
                            <Heading size="md">Comments</Heading>

                        </HStack>
                        <Divider mt={5} />
                    </>
                )}
                drawerFooterFunc={() => (
                    <Footer />
                )}

            />
        </>
    )
}


export default React.memo(CommentsSection);
