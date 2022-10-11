import React, { useRef, useEffect, useState, useContext } from 'react'
import {
    Box,
    Flex,
    HStack,
    AspectRatio,
    Text,
    Heading,
    VStack,
    Button,
    useBreakpointValue,
    Accordion,
    AccordionItem,
    AccordionButton,
    AccordionPanel,
    AccordionIcon,
    useColorModeValue,
    Avatar,
    Spacer,
    Divider,
    IconButton,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    useToast
} from '@chakra-ui/react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import VideoJS from '../components/video/VideoJs';
import { getVideoById } from '../services/videoService';
import Footer from '../components/basic/Footer';
import LoadingScreen from '../components/basic/LoadingScreen';
import { AiFillHeart, AiFillEye } from 'react-icons/ai';
import { IoGift } from 'react-icons/io5';
import { FaHistory } from 'react-icons/fa';
import { CgDetailsMore } from 'react-icons/cg';
import { BsFillGridFill, BsThreeDots } from 'react-icons/bs';
import MarketplaceVideoCard from '../components/card/MarketplaceVideoCard';
import Carousel from '../components/Carousel';
import { BsFillCaretLeftFill, BsFillCaretRightFill } from 'react-icons/bs';
import AwardModal from '../components/modal/AwardModal';
import { userContext } from '../userContext';
import { IoIosShareAlt } from 'react-icons/io'
import { MdReport } from 'react-icons/md';
import SVT from '../contracts/SVT';
import web3 from '../contracts/web3';

const NFT = () => {

    const { state } = useLocation();
    const params = useParams();
    const navigate = useNavigate();

    const playerRef = useRef(null);
    const mounted = useRef(true);

    const [videoInfo, setvideoInfo] = useState({});

    const [isMuted] = useState((state && state.navigated) ? false : true);
    const [loading, setLoading] = useState(true);
    const [video, setvideo] = useState({});
    const secondaryBg = useColorModeValue("gray.100", "whiteAlpha.200");
    const textColor = useColorModeValue("gray.700", "gray.400");
    const btnSize = useBreakpointValue({ base: "sm", lg: "md" });
    const { currentUserData } = useContext(userContext);
    const toast = useToast();
    const toastId = 'NFT-link-toast';

    useEffect(() => {

        if (!playerRef.current) return;
        if (isMuted) {
            playerRef.current.muted(true);
        } else {
            playerRef.current.muted(false);
        }

    }, [isMuted]);


    // useEffect(() => {

    //     SVT.methods.getTokenInfo(tokenId).call().then((res) => {
    //         setvideoInfo(res);
    //         setLoading(false);
    //     }
    //     ).catch((err) => {
    //         console.log(err);
    //         setLoading(false);
    //     });

    // }, []);


    const handleBuy = () => {

        // call buyToken function from SVT contract
        const amountInWei = web3.utils.toWei('11000', 'ether');
        SVT.methods.buyToken(0).send({
            from: currentUserData.address,
            value: amountInWei
        }).then((res) => {
            console.log(res);
            toast({
                id: toastId,
                title: "Token purchased successfully.",
                status: "success",
                duration: 5000,
                isClosable: true,
            });
        }
        ).catch((err) => {
            console.log(err);
            toast({
                id: toastId,
                title: "Error while purchasing token.",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        }
        );
    }







    useEffect(() => {

        mounted.current = true;

        if (!params.id && video) return;
        setLoading(true);

        async function fetchVideo() {
            try {
                const response = await getVideoById(params.id);
                console.log(response);
                // if (!response.is_nft) {
                // navigate('/not-found');  UNCOMMENT THIS LATER TO REDIRECT TO 404 PAGE IF VIDEO IS NOT NFT
                // }
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
        autoplay: false,
        loadingSpinner: false,
        responsive: true,
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

    const handleMouseEnter = (e) => {

        if (!playerRef.current) return;
        playerRef.current.play();
    }

    const handleMouseLeave = (e) => {

        if (!playerRef.current) return;
        playerRef.current.pause();
    }

    const handleNFTShare = () => {
        navigator.clipboard.writeText(`https://www.scubr.org/nft/${video && video.video_id}`);
        if (!toast.isActive(toastId)) {
            toast({
                id: toastId,
                title: "NFT copied to clipboard",
                status: "success",
                duration: 2000,
                position: "top-right"
            });
        }
    }


    if (loading) {
        return <LoadingScreen />
    }



    return (
        <>
            <Box
                paddingX={{ base: '4%', lg: "2%", '2xl': '8%' }}
                pt="14vh"
                pb="20"
            >
                <Flex
                    flex={1}
                    minH="100vh"
                    direction={{ base: 'column', xl: 'row' }}
                >
                    <Box w="100%" maxW={{ base: '100%', xl: '50vw' }}>
                        <AspectRatio
                            ratio={16 / 9}
                            onMouseEnter={handleMouseEnter}
                            onMouseLeave={handleMouseLeave}
                        >
                            <VideoJS
                                options={videoJsOptions}
                                class="vjs-theme-sea"
                                onReady={handlePlayerReady}
                                maintainAspect
                            />
                        </AspectRatio>
                        <Box display={{ base: 'none', xl: 'block' }}>
                            <Details video={video} />
                        </Box>
                    </Box>

                    <Box py={4} ml={{ base: 0, xl: 8 }} w="100%" maxW={{ base: "100%", xl: "600px" }}>

                        <HStack align={"start"}>
                            <VStack align={"start"} spacing={0}>
                                <Text color="blue.500" fontWeight={"bold"} fontSize={{ base: "14", md: "16" }}>{video.name}</Text>
                                <Heading as="h1" size="xl" mb={2} noOfLines={2} fontSize={{ base: "20", md: "24" }}>{video.title}</Heading>
                            </VStack>
                            <Spacer />
                            <Menu>
                                <MenuButton
                                    as={IconButton}
                                    aria-label="More profile options"
                                    icon={<BsThreeDots />}
                                    variant="outline"
                                    rounded={"lg"}
                                    size={btnSize}
                                    colorScheme="gray"
                                    _focus={{ boxShadow: "none" }}
                                />
                                <MenuList zIndex={20}>
                                    <MenuItem
                                        icon={<IoIosShareAlt size={20} />}
                                        onClick={handleNFTShare}
                                    >
                                        Share
                                    </MenuItem>
                                    <MenuItem icon={<MdReport size={20} />}>
                                        Report
                                    </MenuItem>
                                </MenuList>
                            </Menu>
                        </HStack>
                        <Text fontSize={{ base: "14", md: "16" }}>Owned By <Text cursor={"pointer"} as="span" color="blue.500" fontWeight={"bold"}>{video.name}</Text></Text>

                        <HStack spacing={4} mt={6} fontWeight="medium" fontSize={{ base: "12", sm: "14", md: "16" }} color="gray.600">
                            <HStack spacing={1}>
                                <AiFillHeart size="20" />
                                <Text>{video.likes} likes</Text>
                            </HStack>
                            <HStack spacing={1}>
                                <AiFillEye size="20" />
                                <Text>{video.views} Views</Text>
                            </HStack>
                            <AwardModal
                                creatorName={video.name}
                                totalAwards={10}
                                creatorImage={video.image_url}
                                isCreator={currentUserData && currentUserData.account_id === video.creator_id}
                            >
                                <HStack spacing={1} cursor="pointer" _hover={{ color: textColor }}>
                                    <IoGift size="20" />
                                    <Text>12 Awards</Text>
                                </HStack>
                            </AwardModal>
                        </HStack>

                        <VStack mt={10} align="start" spacing={1} bg={secondaryBg} py={3} px={4} rounded="lg">
                            <Text
                                color="gray.600"
                                fontWeight="semibold"
                                fontSize="md"
                            >
                                Total Price
                            </Text>
                            <HStack align={"end"}>
                                <Heading size="2xl" lineHeight={0.9}>11000</Heading>
                                <Heading size="md">SET</Heading>
                            </HStack>
                            <Heading fontSize={"lg"} pl={1} pt={1} color="green.400">$ 228.12</Heading>
                        </VStack>
                        <VStack pt={2} pl={1} color="gray.600">
                            <HStack justify={"space-between"} w="100%">
                                <Heading fontSize={"md"} >Price</Heading>
                                <Heading fontSize={"md"} >10000 SET</Heading>
                            </HStack>
                            <HStack justify={"space-between"} w="100%">
                                <Heading fontSize={"md"} >Royalties (8 %)</Heading>
                                <Heading fontSize={"md"} >800 SET</Heading>
                            </HStack>
                            <HStack justify={"space-between"} w="100%">
                                <Heading fontSize={"md"}>Charges (2 %)</Heading>
                                <Heading fontSize={"md"} >200 SET</Heading>
                            </HStack>
                        </VStack>

                        <Button
                            colorScheme="blue"
                            size="lg"
                            mt={8}
                            w="100%"
                            onClick={handleBuy}
                        >Buy Now</Button>
                        <Box display={{ base: 'block', xl: 'none' }}>
                            <Details video={video} />
                        </Box>
                        <SaleHistory />
                    </Box>
                </Flex>
                <OtherVideos video={video} />
            </Box>
            <Box pb={8}>
                <Footer />
            </Box>
        </>
    )
}

const OtherVideos = ({ video }) => {
    const secondaryBg = useColorModeValue("gray.100", "whiteAlpha.200");
    const borderColor = useColorModeValue("#D3D9E4", "#1A202C");
    const iconSizes = useBreakpointValue({ base: "18", sm: "24" });
    const prevRef = useRef(null);
    const nextRef = useRef(null);

    return (
        <Box mt={8} bg={secondaryBg} border={`2px solid ${borderColor}`} rounded={"lg"} py={6} px={{ base: 3, sm: 6 }}>
            <HStack mb={4}>
                <BsFillGridFill size={iconSizes} />
                <Heading fontSize={{ base: "md", sm: "xl" }} >More from this creator</Heading>
                <Spacer />
                <HStack spacing={{ base: 2, sm: 4 }}>
                    <div ref={prevRef}>
                        <BsFillCaretLeftFill cursor={"pointer"} size="24" />
                    </div>
                    <div ref={nextRef}>
                        <BsFillCaretRightFill cursor={"pointer"} size="24" />
                    </div>

                </HStack>
            </HStack>
            <Divider borderColor={borderColor} />
            <Box mt={6} fontWeight="medium">
                <Carousel
                    ref={{
                        prevRef: prevRef,
                        nextRef: nextRef
                    }}
                >
                    <MarketplaceVideoCard title="Bingo Bingo!!" name="Santhosh" video_id={22} videoUrl="https://media.thetavideoapi.com/video_vitsfywtiydxhuva2vhd6j8drf/master.m3u8" />
                    <MarketplaceVideoCard title="Say my name" name="vijay" video_id={22} videoUrl="https://media.thetavideoapi.com/video_0ba6nuk9svrty6a7dpfdm573uc/master.m3u8" />
                    <MarketplaceVideoCard title="gaming now" name="naveen" video_id={22} videoUrl="https://media.thetavideoapi.com/srvacc_3z8e4t0g2jkfr57xsz3gqvpj0/video_kzh225ce37vvpsjvpqt8kh8ki5/1631659816016.m3u8" />
                    <MarketplaceVideoCard title="good Bingo!!" name="akash" video_id={22} videoUrl="https://media.thetavideoapi.com/video_0ba6nuk9svrty6a7dpfdm573uc/master.m3u8" />
                </Carousel>
            </Box>
        </Box>
    )
}

const Details = ({ video }) => {

    const secondaryBg = useColorModeValue("gray.100", "whiteAlpha.200");
    const borderColor = useColorModeValue("#D3D9E4", "#1A202C");

    return (
        <Box mt={8} bg={secondaryBg} border={`2px solid ${borderColor}`} rounded={"lg"} py={6} px={{ base: 3, sm: 6 }}>
            <HStack mb={4}>
                <CgDetailsMore size="24" />
                <Heading fontSize="xl" >Details</Heading>
            </HStack>
            <Divider borderColor={borderColor} />
            <Box mt={6} fontWeight="medium">
                <Text>By <Text as={'span'} fontWeight="bold" color={"blue.500"} cursor="pointer">{video.name}</Text></Text>
                <Text>{video.caption}</Text>
                <Box mt={4}>
                    <HStack justify={"space-between"} my={2}>
                        <Text>Created on</Text>
                        <Text>{dayjs(video.creation_timestamp).format('DD MMM, YYYY')}</Text>
                    </HStack>
                    <HStack justify={"space-between"} my={2}>
                        <Text>Chain</Text>
                        <Text>Coinex</Text>
                    </HStack>
                    <HStack justify={"space-between"} my={2}>
                        <Text>Creator Earnings</Text>
                        <Text>2.5 %</Text>
                    </HStack>
                </Box>
            </Box>
        </Box>
    )
}


const SaleHistory = () => {

    const secondaryBg = useColorModeValue("gray.100", "whiteAlpha.200");
    const borderColor = useColorModeValue("#D3D9E4", "#1A202C");
    const avatarSize = useBreakpointValue({ base: "sm", sm: "md" });

    return (
        <Accordion defaultIndex={[0]} allowMultiple mt={8}>
            <AccordionItem
                border={`1px solid ${borderColor}`}
                rounded="lg"
            >
                <h2>
                    <AccordionButton
                        py={6}
                        px={{ base: 3, sm: 6 }}
                        bg={secondaryBg}
                        _focus={{ boxShadow: "none" }}
                        rounded="lg"
                        _hover={{ bg: secondaryBg }}
                        _expanded={{ roundedBottom: "0", borderBottom: `1px solid ${borderColor}` }}
                    >
                        <Box flex='1' textAlign='left'>
                            <HStack>
                                <FaHistory size="20" />
                                <Text fontWeight={"bold"}>Sale History</Text>
                            </HStack>
                        </Box>
                        <AccordionIcon />
                    </AccordionButton>
                </h2>
                <AccordionPanel pb={4} bg={secondaryBg} px={{ base: 3, sm: 6 }}>
                    {/* loop through for 4 times and show the data */}
                    {[{
                        name: "Santhosh",
                        price: "14500",
                        date: "1 day ago",
                        dollar: "50",
                        image: "https://bit.ly/sage-adebayo"
                    }, {
                        name: "Vijay",
                        price: "17000",
                        date: "2 day ago",
                        dollar: "80",
                        image: "https://bit.ly/dan-abramov"
                    }].map((item, index) => (

                        <HStack my={6}>
                            <HStack>
                                <Avatar size={avatarSize} name="Dan Abrahmov" src={item.image} />
                                <VStack align={"start"} spacing={0}>
                                    <Text cursor={"pointer"} fontSize={{ base: "xs", sm: "md" }} fontWeight="bold" noOfLines={1}>{item.name}<Text as={'span'} color="gray.600" fontWeight={"medium"}> purchased for</Text></Text>
                                    <Text fontSize={{ base: "9", sm: "sm" }} fontWeight={"medium"}>{item.date}</Text>
                                </VStack>
                            </HStack>
                            <Spacer />
                            <VStack align={"end"} spacing={0} flexShrink={0}>
                                <Text fontSize={{ base: "xs", sm: "md" }} fontWeight="bold">{item.price} SET</Text>
                                <Text fontSize={{ base: "9", sm: "sm" }} fontWeight={"medium"}>${item.dollar}</Text>
                            </VStack>
                        </HStack>
                    ))}
                </AccordionPanel>
            </AccordionItem>
        </Accordion>
    )
}

export default NFT