import React, { useState, useRef, useContext, useEffect } from 'react'
import {
    Flex,
    Heading,
    Box,
    Input,
    Avatar,
    Button,
    useToast,
    useDisclosure,
    HStack,
    Spacer,
    Image,
    useColorModeValue,
    FormLabel,
    FormControl,
    useBreakpointValue,
    Textarea,
    Text

} from '@chakra-ui/react';
import ModalFrame from '../basic/ModalFrame';

import { userContext } from '../../userContext';
import { uploadImage } from '../../services/imageService';
import { updateAccount } from '../../services/accountService';
import { AiFillCloseCircle } from 'react-icons/ai';
import CoverPlaceholder from '../../assets/coverplaceholder.png';

const EditProfile = ({ userData }) => {

    const { currentUserData, setCurrentUserData } = useContext(userContext);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const bgColor = useColorModeValue("white", "#2D3748");
    const [name, setName] = useState(userData.name);
    const [bio, setBio] = useState(userData.bio);
    const [imgUrl, setImgUrl] = useState(userData.image_url);
    const [fileData, setFileData] = useState(null);
    const [coverData, setCoverData] = useState(null);
    const [coverUrl, setCoverUrl] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [checkIfChanged, setCheckIfChanged] = useState(false);
    const fileInputRef = useRef();
    const coverInputRef = useRef();
    const toast = useToast();
    const btnSize = useBreakpointValue({ base: "sm", lg: "md" });
    const initialRef = React.useRef(null)



    const handleImage = (fileData) => {
        setFileData(fileData);
        var reader = new FileReader();
        var url = reader.readAsDataURL(fileData);
        reader.onloadend = function (e) {
            setImgUrl(reader.result);
        };
    }

    const handleCoverImage = (fileData) => {
        setCoverData(fileData);
        var reader = new FileReader();
        var url = reader.readAsDataURL(fileData);
        reader.onloadend = function (e) {
            setCoverUrl(reader.result);
        };
    };

    const handleImageUpload = async (fileData) => {
        try {
            const ipfsResult = await uploadImage(fileData);
            return `https://cloudflare-ipfs.com/ipfs/${ipfsResult}`;
        } catch (error) {
            handleError('Error uploading data', 'Please check your internet connection');
            setIsLoading(false);
        }
    }


    const handleSubmit = async () => {

        if (!name) {
            handleError("Name is required");
        } else if (!bio) {
            handleError("Bio is required");
        } else if (!imgUrl) {
            handleError("Image is required");
        }
        else {
            setIsLoading(true);

            let imageUrl;
            if (imgUrl !== userData.image_url) {
                imageUrl = await handleImageUpload(fileData);
            } else {
                imageUrl = imgUrl;
            }

            const account = {
                name,
                bio,
                imageUrl
            }
            try {
                const result = await updateAccount(userData.account_id, account);
                if (result) {
                    setCurrentUserData(result.data);
                    toast({
                        title: 'Account updated successfully',
                        status: 'success',
                        duration: 9000,
                        isClosable: true,
                    });
                    setIsLoading(false);
                }
            }
            catch (error) {
                handleError('Error updating account', 'Please check your internet connection');
                setIsLoading(false);
            }
        }

    }

    const handleError = (title, error) => {
        toast({
            title: title,
            description: error,
            status: 'error',
            duration: 9000,
            isClosable: true,
        });
    }

    useEffect(() => {
        checkIfAllStateValueChanged();
    }, [currentUserData, name, bio, imgUrl]);


    const checkIfAllStateValueChanged = () => {
        if (name !== currentUserData.name || bio !== currentUserData.bio || imgUrl !== currentUserData.image_url) {
            setCheckIfChanged(true);
        } else {
            setCheckIfChanged(false);
        }
    }

    const header = () => {
        return (
            <HStack spacing={6}>
                <AiFillCloseCircle fontSize={24} onClick={onClose} cursor="pointer" />
                <Heading size="md">Edit profile</Heading>
                <Spacer />
                <Button
                    mr="4"
                    px={6}
                    fontSize={'sm'}
                    size="sm"
                    rounded={'full'}
                    onClick={handleSubmit}
                    isLoading={isLoading}
                    isDisabled={!checkIfChanged}
                >
                    Save
                </Button>
            </HStack>
        )
    }

    const bodyContent = () => {
        return (
            <Box>
                <Box pos="relative" w="100%" h="12rem">
                    <Image
                        src={coverUrl ?? CoverPlaceholder}
                        onClick={() => coverInputRef.current.click()}
                        cursor="pointer"
                        alt='Cover'
                        objectFit="cover"
                        w="100%"
                        h="100%"
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
                        onClick={() => coverInputRef.current.click()}
                        cursor="pointer"
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
                <Box px={6} mb={6} mt={24}>

                    <FormControl>
                        <FormLabel fontSize="2xl" fontWeight="800">
                            Username
                        </FormLabel>
                        <Input
                            variant="filled"
                            ref={initialRef}
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            focusBorderColor="#D3D9E4"
                            placeholder='Enter name'
                        />
                    </FormControl>

                    <FormControl mt={6}>
                        <FormLabel fontSize="2xl" fontWeight="800">
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
                </Box>
            </Box>

        )
    }


    return (
        <ModalFrame
            isOpen={isOpen}
            onClose={onClose}
            showCloseBtn={false}
            modalBodyPadding={0}
            initialFocusRef={initialRef}
            HeaderProps={{
                pt: "2",
                pb: "1",
                px: "4",
            }}
            BodyProps={{
                px: "0",
            }}
            Button={() => (
                <Button
                    px={10}
                    mr="4"
                    fontSize={'sm'}
                    rounded={'full'}
                    size={btnSize}
                    variant="outline"
                    onClick={onOpen}
                >
                    Edit Profile
                </Button>
            )}
            modalHeaderFunc={header}
            modalContentFunc={bodyContent}
            drawerHeaderFunc={header}
            drawerContentFunc={bodyContent}

        />
    )
}

export default EditProfile