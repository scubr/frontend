import React, { useState } from 'react';
import Web3 from 'web3';
import {
    Flex,
    Heading,
    Text,
    Spinner,
    Center,
    useToast,
    useBreakpointValue,
    VStack,
    Box
} from '@chakra-ui/react';
import './Onboarding.css';
import { useNavigate } from 'react-router-dom';
import { login } from '../../services/authService';
import Footer from '../../components/basic/Footer';

import BGVideo from '../../assets/scubrlBgVideo/scubrVideo.mp4';
import {
    checkAlreadyRegistered,
    getNonce,
} from '../../services/accountService';

function LandingPage({ setToken }) {
    const navigate = useNavigate();
    const [registerLoading, setRegisterLoading] = useState(false);
    const spinnerSize = useBreakpointValue({ base: "xs", md: "sm", lg: "lg" });
    const toast = useToast();

    const enableMetamask = async () => {
        try {
            if (!window.ethereum) {
                toast({
                    title: 'Metamask is not installed',
                    description: 'Install metamask browser extension',
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                });
                return false;
            }
            return await window.ethereum.enable();
        } catch (error) {
            toast({
                title: 'Request rejected',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
            return false;
        }
    };

    const signMessage = async (publicAddress, nonce) => {
        try {
            const web3 = new Web3(window.ethereum);
            const signature = await web3.eth.personal.sign(
                `I am signing my one-time nonce: ${nonce}`,
                publicAddress
            );
            return signature;
        } catch (error) {
            toast({
                title: 'Request rejected',
                description: 'Sign the nonce to login',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
            return;
        }
    };

    const handleExploreButton = async () => {
        try {
            setRegisterLoading(true);

            const isEnabled = await enableMetamask();

            if (!isEnabled) {

                setRegisterLoading(false);
                return;
            }

            //   setPublicAddress(window.ethereum.selectedAddress);
            const publicAddress = window.ethereum.selectedAddress;

            // Check if the selected account is already registered
            //   const publicAddress = window.ethereum.selectedAddress;
            const registerQuery = await checkAlreadyRegistered({
                publicAddress,
            });
            const isAlreadyRegistered = registerQuery.data;

            if (isAlreadyRegistered) {
                const nonceResult = await getNonce({
                    publicAddress,
                });
                const nonce = nonceResult.data.nonce;
                const signature = await signMessage(publicAddress, nonce);
                if (!signature) {
                    toast({
                        title: 'Cannot sign nonce',
                        status: 'error',
                        duration: 5000,
                        isClosable: true,
                    });
                    setRegisterLoading(false);
                    return;
                }

                const loginResult = await login({ signature, publicAddress });
                setRegisterLoading(false);
                if (loginResult.status === 200) {
                    // localStorage.setItem('token', loginResult.data);
                    const token = loginResult.data;
                    localStorage.setItem('token', token);
                    setToken(token);
                    window.location.reload();
                } else {
                    toast({
                        title: 'Error in login',
                        status: 'error',
                        duration: 5000,
                        isClosable: true,
                    });
                }
            } else {
                setRegisterLoading(false);
                navigate('/registration', {
                    state: { publicAddress },
                });
            }
        } catch (error) {
            toast({
                title: 'Network error',
                description: 'Check yout internet connection',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
            setRegisterLoading(false);
        }
    };

    return (
        <Flex h="100vh" overflow="hidden" w="100%" pos={"relative"}>
            <video loop muted autoPlay className="bgTextVideo">
                <source src={BGVideo} type="video/mp4" />
            </video>
            <Flex
                className="landingText"
            >
                <Flex
                    direction="column"
                    align="flex-end"
                    color="black"
                >
                    <Heading fontSize={{ base: "26vw", md: "18vw" }}>Scubr</Heading>
                    <Flex
                        w={{ base: "50vw", md: "36vw" }}
                        direction="column"
                        textAlign="right"
                        position="relative"
                        minH="34vh"
                        mt="-4vw"
                    >
                        <Heading fontSize={{ base: "4vw", md: "3vw" }}>
                            Discover the planet in a bigger screen
                        </Heading>
                        <Flex
                            onClick={() => {
                                return registerLoading ? null : handleExploreButton();
                            }}
                            _hover={{ opacity: !registerLoading && 0.5, cursor: 'pointer' }}
                            alignSelf="end"
                            mt={{ base: "4", md: "8" }}
                            w={{ base: "24", md: "40", lg: "50", xl: "60" }}
                            h={{ base: "8", md: "12", lg: "16" }}
                            borderRadius="40"
                            border="2px solid black"
                            justifyContent="center"
                        >
                            <Center>
                                {registerLoading ? (
                                    <Spinner size={spinnerSize} />
                                ) : (
                                    <Text fontSize={{ base: "2vw", lg: "1.5vw" }}>Explore</Text>
                                )}
                            </Center>
                        </Flex>
                    </Flex>
                    <Box
                        pos="absolute"
                        left={"50%"}
                        transform="translateX(-50%)"
                        bottom={6}
                        zIndex={40}
                    >
                        <Footer />
                    </Box>
                </Flex>
            </Flex>
        </Flex>
    );
}

export default LandingPage;