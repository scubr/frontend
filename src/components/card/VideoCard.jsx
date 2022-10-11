import React, { useState, useContext } from 'react'
import {
    Box,
    Flex,
    Heading,
    Text,
    AspectRatio,
    HStack,
    Avatar,
    useBreakpointValue,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    IconButton,
    Divider,
    VStack,
    useColorModeValue,

} from '@chakra-ui/react';

import VideoJS from '../video/VideoJs';
import { useNavigate } from 'react-router';
import { getTimeDifference } from '../../helper/timeHelpers';
import { userContext } from '../../userContext';
import VideoControls from '../video/VideoControls';
import VideoControlsBottom from '../video/VideoControlsBottom';
import { IoIosShareAlt } from "react-icons/io";
import { MdReport } from "react-icons/md";
import { BsThreeDots } from 'react-icons/bs';
import AwardModal from '../modal/AwardModal';
import { AiOutlineRight } from 'react-icons/ai';
import { awardStickers } from '../../constants/awards';

const VideoCard = ({
    videoJsOptions,
    video_id,
    title,
    caption,
    creation_timestamp,
    creator_id,
    name,
    image_url,
    liked,
    saved,
    views,
    likes,
    comments,
    onReady,
    isMuted,
    setIsMuted,
    pauseOnLeave,
    handleViews
}) => {

    const { currentUserData } = useContext(userContext);
    const [mouseEnter, setMouseEnter] = useState(false);
    const showControllerBottom = useBreakpointValue({ base: "block", md: "none" });
    const showAwardsMobile = useBreakpointValue({ base: "flex", md: "none" });
    const buyButtonColor = useColorModeValue("red.500", "red.600");
    const borderColor = useColorModeValue("gray.300", "gray.700");
    const buyButtonFontSize = useBreakpointValue({ base: "sm", md: "md" });
    const navigate = useNavigate();


    return (
        <Box position={"relative"}>

            <Box w="100%" px={{ base: 3, md: 0 }}>
                <Flex align="center" justify="space-between">
                    <Box cursor="pointer" onClick={() => navigate(`/profile/${creator_id}`)}>
                        <Flex my="2" align="center" cursor="pointer">
                            <Avatar bg="gray.300" size={useBreakpointValue({ base: "sm", md: "md" })} src={image_url} />
                            <Flex direction="column" ml="3" justify="center">
                                <Heading fontSize={{ base: "14", md: "18", lg: "22" }} >{name}</Heading>
                                <Flex align="center" color="gray.500" fontSize={{ base: "10", md: "12", lg: "13" }}>
                                    <Text >
                                        {getTimeDifference(creation_timestamp)}
                                    </Text>
                                    <Text mx="1" >
                                        •
                                    </Text>
                                    <Text >
                                        {views} views
                                    </Text>
                                </Flex>
                            </Flex>
                        </Flex>
                    </Box>
                    <HStack
                        spacing={{ base: 3, md: 4 }}
                    >
                        <AwardModal
                            creatorName={name}
                            totalAwards={10}
                            creatorImage={image_url}
                            isCreator={currentUserData && currentUserData.account_id === creator_id}
                        />
                        <Box>
                            <Menu>
                                <MenuButton
                                    as={IconButton}
                                    aria-label='Options'
                                    icon={<BsThreeDots fontSize={useBreakpointValue({ base: "20", sm: "24", md: "26", lg: "30" })} />}
                                    variant='ghost'
                                    size={useBreakpointValue({ base: "sm", md: "md" })}
                                />
                                <MenuList zIndex={20}>
                                    <MenuItem icon={<IoIosShareAlt size={20} />}>
                                        Share
                                    </MenuItem>
                                    <MenuItem icon={<MdReport size={20} />}>
                                        Report
                                    </MenuItem>
                                </MenuList>
                            </Menu>
                        </Box>
                    </HStack>
                </Flex>
            </Box>

            <Box
                pos={"relative"}
            // onMouseEnter={() => setMouseEnter(true)}
            // onMouseLeave={() => setMouseEnter(false)}
            >
                <AspectRatio
                    ratio={16 / 9}
                    onClick={() => navigate(`/video/${video_id}`, { state: { navigated: true } })}
                >
                    <VideoJS
                        video_id={video_id}
                        options={videoJsOptions}
                        pauseOnLeave={pauseOnLeave}
                        handleViews={handleViews}
                        onReady={onReady}
                        maintainAspect
                    />

                </AspectRatio>
                <Flex
                    h="100%"
                    direction="column"
                    flex="1"
                    align="center"
                    pos="absolute"
                    zIndex="1"
                    bottom="0"
                    right={{ base: "1", md: "2", lg: "4", xl: "-20" }}
                // opacity={{ base: 1, md: mouseEnter ? 1 : 0, xl: 1 }}
                >
                    <VideoControls
                        video_id={video_id}
                        isMuted={isMuted}
                        setIsMuted={setIsMuted}
                        liked={liked}
                        saved={saved}
                        likes={likes}
                        comments={comments}
                    />
                </Flex>
            </Box>
            <HStack
                px={4}
                cursor="pointer"
                justify={{ base: "space-between", md: "flex-end" }}
                spacing={4}
                py={2}
                role="group"
                onClick={() => navigate(`/nft/${video_id}`)}
                _hover={{
                    bg: buyButtonColor,
                    color: "white"
                }}
            >
                <Text fontWeight={"medium"} fontSize={buyButtonFontSize}>10520 SET</Text>
                <HStack
                    pl={4}
                    spacing={1}
                    borderLeft={useBreakpointValue({ base: "0px", md: "1px" })}
                    borderColor={borderColor}
                    _groupHover={{
                        borderColor: "gray.100"
                    }}
                >
                    <Text fontWeight={"medium"} fontSize={buyButtonFontSize}>Buy now</Text>
                    <AiOutlineRight />
                </HStack>
            </HStack>
            <Divider />
            <Box px={{ base: 3, md: 0 }}>
                <Box display={showControllerBottom}>
                    <VideoControlsBottom
                        video_id={video_id}
                        isMuted={isMuted}
                        setIsMuted={setIsMuted}
                        liked={liked}
                        saved={saved}
                        likes={likes}
                        comments={comments}
                    />
                </Box>
                <HStack
                    spacing={{ base: 1, sm: 2 }}
                    fontSize={"sm"}
                    fontWeight="medium"
                    align="center"
                    px="1"
                >
                    <Text>
                        <Text display={showControllerBottom}>{likes} likes</Text>
                    </Text>
                    <Text mx="1" display={showControllerBottom}>
                        •
                    </Text>
                    <Text >
                        <Text display={showControllerBottom}>{comments} comments</Text>
                    </Text>
                    <Text mx="1" display={showControllerBottom}>
                        •
                    </Text>
                    <AwardModal
                        creatorName={name}
                        totalAwards={10}
                        creatorImage={image_url}
                        isCreator={currentUserData && currentUserData.account_id === creator_id}
                    >
                        <HStack spacing={0} cursor="pointer" display={showAwardsMobile}>
                            <Text
                            >12 awards</Text>
                            <Box>
                                {awardStickers.slice(0, 3).map((award, index) => (
                                    <Avatar
                                        bg="none"
                                        key={index}
                                        src={award.image}
                                        size="xs"
                                        name={"o"}
                                    />
                                ))}
                            </Box>
                        </HStack>
                    </AwardModal>
                </HStack>
                <VStack mt="4" px="1" align={"start"} spacing={0}>
                    <Heading
                        size={useBreakpointValue({ base: "sm", sm: "md", xl: "lg" })}
                        cursor="pointer"
                        onClick={() => navigate(`/video/${video_id}`, { state: { navigated: true } })}
                        noOfLines={1}
                        fontFamily="Azedo"
                        maxW={"max-content"}
                        _hover={{
                            color: useColorModeValue("gray.600", "gray.300")
                        }}
                    >
                        {title}
                    </Heading>
                    <Text fontSize={useBreakpointValue({ base: "xs", sm: "sm", xl: "md" })} color="gray.500">{caption}</Text>
                </VStack>
            </Box>
        </Box>
    )
}

export default VideoCard