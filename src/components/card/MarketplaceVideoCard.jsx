import React, { useRef, useState } from 'react'
import {
    Box,
    Flex,
    Heading,
    Text,
    Skeleton,
    useColorModeValue,
    Button,
    Tag,
    HStack
} from '@chakra-ui/react';


import VideoJS from '../video/VideoJs';
import LazyLoad from 'react-lazyload';
import { useNavigate } from 'react-router';
import ListVideoModal from '../modal/ListVideoModal';
import MintVideoModal from '../modal/MintVideoModal';

function MarketplaceVideoCard({ videoUrl, video_id, isNFT, isListed, type, title, name }) {


    const playerRef = useRef(null);
    const [delayHandler, setDelayHandler] = useState(null);
    const bg = useColorModeValue("gray.200", "gray.900");
    const navigate = useNavigate();
    const [isVideoNFT, setIsVideoNFT] = useState(isNFT);
    const [isVideoListed, setIsVideoListed] = useState(isListed);


    const videoJsOptions = {
        autoplay: false,
        responsive: true,
        height: '300px',
        loadingSpinner: false,
        width: '600px',
        loop: true,
        techOrder: ["theta_hlsjs", "html5"],
        preload: 'auto',
        sources: [{
            src: videoUrl,
            type: "application/vnd.apple.mpegurl",
            label: "1080p"
        }]
    }


    const handlePlayerReady = (player) => {
        playerRef.current = player;

    };

    const handleMouseEnter = () => {

        if (!playerRef.current) return;
        setDelayHandler(setTimeout(() => {
            playerRef.current.play();
        }, 800));

    }

    const handleMouseLeave = () => {

        if (!playerRef.current) return;
        playerRef.current.pause();
        clearTimeout(delayHandler)
    }


    const handleBuy = async () => {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        console.log(accounts);
        const account = accounts[0];
        console.log(account);
        //await SVT.methods.buyToken(token_id).send({ from: account });
        navigate('/marketplace');
    }


    const handleCancelListing = async () => {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const account = accounts[0];
        //await SVT.methods.unlistToken(token_id).send({ from: account });
        navigate('/marketplace');
    }



    const handleClick = () => {
        if (type === 'buy') {
            handleBuy();
        } else if (isVideoListed) {
            handleCancelListing();
        }
    }





    return (
        <Flex
            maxW="600px"
            borderRadius="8"
            overflow="hidden"
            flexDirection="column"
        >
            <LazyLoad height={460} placeholder={<Skeleton h="460" />} offset={2000}>
                <Box
                    h="300"
                    overflow="hidden"
                    onMouseOver={handleMouseEnter}
                    onMouseOut={handleMouseLeave}
                    position="relative"
                    cursor={"pointer"}
                    onClick={() => navigate(`/nft/${video_id}`)}
                >
                    <VideoJS options={videoJsOptions} onReady={handlePlayerReady} />
                    <Box
                        position={"absolute"}
                        top={4}
                        right={4}

                    >
                        <HStack>
                            {isVideoListed && (
                                <Tag size={'md'} variant='solid' bg='teal.600'>
                                    Listed
                                </Tag>
                            )}
                            {isVideoNFT && (
                                <Tag size={'md'} variant='solid' bg='blue.600' >
                                    NFT
                                </Tag>
                            )}
                        </HStack>
                    </Box>


                </Box>
                <Flex h="180" bg={bg} p="5" flexDirection="column" justify="space-between" cursor={"pointer"}>
                    <Box>
                        <Heading
                            noOfLines={1}
                            size="lg"
                            fontFamily="Elianto"
                            cursor={"pointer"}
                            onClick={() => navigate(`/nft/${video_id}`)}
                        >
                            {title}
                        </Heading>
                        <Heading noOfLines={1} size="sm" color={"gray.500"}>
                            {name}
                        </Heading>
                    </Box>
                    <Flex justify="space-between" align="end">
                        <Box>
                            {isVideoListed && (
                                <>
                                    <Text size="lg" fontWeight={"medium"}>Total Price</Text>
                                    <Flex align="center">
                                        <Heading size="lg" >3.22 SET</Heading>
                                    </Flex>
                                </>
                            )}
                        </Box>
                        <Box textAlign="end">
                            {type === 'buy' ? (
                                <SubmitButton onClick={handleClick}>Buy Now</SubmitButton>
                            )
                                :
                                isVideoListed ? (
                                    <SubmitButton onClick={handleClick}>Cancel Sale</SubmitButton>
                                )
                                    :
                                    isVideoNFT ? (
                                        <ListVideoModal setIsVideoListed={setIsVideoListed} video_id={video_id}>
                                            <SubmitButton>List NFT</SubmitButton>
                                        </ListVideoModal>

                                    ) : (
                                        <MintVideoModal setIsVideoNFT={setIsVideoNFT} video_id={video_id}>
                                            <SubmitButton>Mint NFT</SubmitButton>
                                        </MintVideoModal>
                                    )
                            }
                        </Box>
                    </Flex>
                </Flex>
            </LazyLoad>
        </Flex>
    )
}

const SubmitButton = ({ children, onClick }) => {
    return (
        <Button
            px={10}
            size="md"
            bg={useColorModeValue("gray.50", "whiteAlpha.100")}
            _hover={{ bg: useColorModeValue("gray.100", "whiteAlpha.200") }}
            onClick={onClick}
        >
            {children}
        </Button>
    )
}

export default MarketplaceVideoCard
