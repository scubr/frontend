import { useState, useRef, useEffect } from 'react';
import Web3 from 'web3';
import { Button } from '@chakra-ui/button';
import {
    Input,
    Textarea,
    FormControl,
    FormLabel,
    useToast,
    Avatar,
    Flex,
    Box,
    Image,
    useColorModeValue,
    Container,
    VStack,
    Heading,
    Text
} from '@chakra-ui/react';
import CoverPlaceholder from '../../assets/coverplaceholder.png';

import { createAccount } from '../../services/accountService';
import { useLocation, useNavigate } from 'react-router-dom';
import { uploadImage } from '../../services/imageService';

const RegistrationPage = ({ setToken }) => {
    const { state } = useLocation();
    const navigate = useNavigate();

    const toast = useToast();
    //reference to input type file
    const fileInputRef = useRef();
    const coverInputRef = useRef();

    const [name, setName] = useState('');
    const [bio, setBio] = useState('');
    const [fileData, setFileData] = useState(null);
    const [coverData, setCoverData] = useState(null);
    const [imgUrl, setImgUrl] = useState(null);
    const [coverUrl, setCoverUrl] = useState(null);
    const [submitLoading, setSubmitLoading] = useState(false);
    const bgColor = useColorModeValue("white", "black");
    const publicAddress = state && state.publicAddress;

    useEffect(() => {

        if (!publicAddress) {
            navigate('/');
        }
    }, [publicAddress, navigate]);

    const handleImageUpload = async (fileData) => {

        try {
            const ipfsResult = await uploadImage(fileData);
            return `https://cloudflare-ipfs.com/ipfs/${ipfsResult}`;
        } catch (error) {
            toast({
                title: 'Error uploading data',
                description: 'Please check your internet connection',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        }
    };

    const handleImage = (fileData) => {
        setFileData(fileData);
        var reader = new FileReader();
        var url = reader.readAsDataURL(fileData);
        reader.onloadend = function (e) {
            setImgUrl(reader.result);
        };
    };

    const handleCoverImage = (fileData) => {
        setCoverData(fileData);
        var reader = new FileReader();
        var url = reader.readAsDataURL(fileData);
        reader.onloadend = function (e) {
            setCoverUrl(reader.result);
        };
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

    const handleSubmit = async () => {
        try {
            if (name === '' || bio === '' || publicAddress === '') {
                toast({
                    title: 'All fields are required',
                    description: 'Fill all fields',
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                });
                return;
            } else if (fileData == null) {
                toast({
                    title: 'Select your profile picture',
                    description:
                        'Click on the avatar icon in the top to select your profile picture',
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                });
                return;
            }

            setSubmitLoading(true);

            const imageUrl = await handleImageUpload(fileData);
            if (!imageUrl) {
                toast({
                    title: 'Error in image uploading',
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                });
                return;
            }

            const nonce = Math.floor(Math.random() * 1000000);
            const signature = await signMessage(publicAddress, nonce);

            if (!signature) {
                toast({
                    title: 'Cannot sign nonce',
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                });
                setSubmitLoading(false);
                return;
            }

            // Send the data to the backend
            const serverResult = await createAccount({
                publicAddress,
                name,
                bio,
                imageUrl,
                nonce,
                signature,
            });
            setSubmitLoading(false);

            if (serverResult.status === 201) {
                const token = serverResult.headers['x-auth-token'];
                localStorage.setItem('token', token);
                setToken(token);
                navigate('/');
                window.location.reload();
            } else
                toast({
                    title: 'Error in registration',
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                });
        } catch (error) {
            // Display error
            if (error.response.status === 400) {
                toast({
                    title: error.response.data.error,
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                });
            }
            setSubmitLoading(false);
            return;
        }
    };


    return (
        <Box h="100vh" w="100vw">
            <Container maxW="container.md" pt={20}>
                <VStack mb={10}>
                    <Heading fontSize="4xl" fontFamily={"Poppins"}>Welcome to Scubr</Heading>
                    <Text color="gray.600">Explore the world in a bigger screen. Create your free account now</Text>
                </VStack>

                <Box pos="relative" w="100%" h="12rem">
                    <Image
                        src={coverUrl ?? CoverPlaceholder}
                        onClick={() => coverInputRef.current.click()}
                        alt='Cover'
                        objectFit="cover"
                        w="100%"
                        h="100%"
                        rounded={"lg"}
                        objectPosition={"center"}
                    />
                    <Input
                        display="none"
                        ref={coverInputRef}
                        type="file"
                        accept="image/png, image/jpeg"
                        onChange={(event) => {
                            handleCoverImage(event.target.files[0])
                        }}
                    />
                    <Flex
                        pos="absolute"
                        left={"50%"}
                        top={"50%"}
                        transform={"translate(-50%, -50%)"}
                    >
                        <Text fontWeight={"medium"}>Upload cover photo</Text>
                    </Flex>
                    <Flex
                        pos="absolute"
                        bottom="0"
                        transform="translateY(60%)"
                        left="0"
                        align={"center"}
                        paddingX={{ base: '4%', lg: "2%", '2xl': '8%' }}
                    >
                        <Avatar
                            borderRadius='full'
                            cursor="pointer"
                            src={imgUrl}
                            _hover={{ bg: "gray" }}
                            onClick={() => fileInputRef.current.click()}
                            boxSize="7rem"
                            alt='Profile picture'
                            border={`4px solid ${bgColor}`}
                        />
                        <Input
                            display="none"
                            ref={fileInputRef}
                            type="file"
                            accept="image/png, image/jpeg"
                            onChange={(event) => {
                                handleImage(event.target.files[0])
                            }}
                        />
                    </Flex>
                </Box>
                <VStack px={6} mb={6} mt={24} spacing={10} align="end">
                    <FormControl>
                        <FormLabel fontSize="xl" fontWeight="700">
                            Username
                        </FormLabel>
                        <Input
                            variant="filled"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            focusBorderColor="#D3D9E4"
                            placeholder='Enter name'
                        />
                    </FormControl>

                    <FormControl>
                        <FormLabel fontSize="xl" fontWeight="700">
                            Bio
                        </FormLabel>
                        <Textarea
                            variant="filled"
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            focusBorderColor="#D3D9E4"
                            placeholder='Enter Bio'
                            maxHeight="200px"
                        />
                    </FormControl>
                    <Button
                        colorScheme="blue"
                        mt={8}
                        onClick={handleSubmit}
                        isLoading={submitLoading}
                        loadingText="Processing"
                    >
                        Create Account
                    </Button>
                </VStack>
            </Container>
        </Box>
    )
};

export default RegistrationPage;