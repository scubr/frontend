import {
    Box,
    Flex,
    Heading,
    Image,
    Text,
    useBreakpointValue,
    useColorModeValue,
    HStack,
    Tabs,
    TabList,
    TabPanels,
    Tab,
    Avatar,
    TabPanel,
    useToast

} from '@chakra-ui/react'
import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router';
import { RiCopperCoinFill } from 'react-icons/ri'
import { BsFillCalendarEventFill } from 'react-icons/bs'
import { userContext } from '../userContext';
import { getAccountDetails } from '../services/accountService';
import LoadingScreen from '../components/basic/LoadingScreen';
import UserOptions from '../components/profile/UserOptions';
import SavedVideos from '../components/profile/SavedVideos';
import CollectedVideos from '../components/profile/CollectedVideos';
import FollowersModal from '../components/modal/FollowersModal';
import { IoCopyOutline } from 'react-icons/io5';
import Footer from '../components/basic/Footer';
import CoverPlaceholder from '../assets/coverplaceholder.png'

const Profile = () => {

    const bgColor = useColorModeValue("white", "black");
    const textColor = useColorModeValue("black", "white");
    const isSmallScreen = useBreakpointValue({ base: true, lg: false });
    const { currentUserData } = useContext(userContext);
    const [userData, setUserData] = useState({});
    const [isFollowing, setIsFollowing] = useState(false);
    const [followers, setFollowers] = useState(null);
    const params = useParams();
    const navigate = useNavigate();
    const toast = useToast();
    const toastId = 'clipboard-toast';
    const ownProfile = (!params.id || currentUserData.account_id === parseInt(params.id)) ? true : false;
    const profileId = ownProfile ? currentUserData.account_id : params.id;

    console.warn(currentUserData);


    useEffect(() => {

        if (!currentUserData) return;

        const getUserData = async () => {

            if (!ownProfile) {
                try {
                    const response = await getAccountDetails(params.id);
                    setIsFollowing(response.data.following);
                    setFollowers(response.data.followers);
                    setUserData(response.data);
                } catch (error) {
                    navigate('/not-found');
                }

            } else {
                setFollowers(currentUserData.followers);
                setUserData(currentUserData);
            }
        }

        getUserData();

    }, [params.id, currentUserData, ownProfile, navigate]);



    if (!ownProfile && !userData) {
        return <LoadingScreen />
    }


    const trimString = (str) => {
        // leave first 6 characters and last 4 characters and replace the rest with ...
        return str.slice(0, 6) + '...' + str.slice(-4);
    };

    const handleAddressCopy = (address) => {
        navigator.clipboard.writeText(address);
        if (!toast.isActive(toastId)) {
            toast({
                id: toastId,
                title: "Address copied to clipboard",
                status: "success",
                duration: 2000,
                position: "top-right"
            });
        }
    }

    return (
        <Box>
            <Box pos="relative" w="100%" h={{ base: "12rem", sm: "14rem", md: "16rem", lg: "18rem", xl: "20rem" }}>
                <Image
                    src={CoverPlaceholder}
                    alt='Cover'
                    objectFit="cover"
                    w="100%"
                    h="100%"
                    objectPosition={"center"}
                />
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
                        boxSize={{ base: "6rem", lg: "8rem" }}
                        src={userData.image_url}
                        alt='Dan Abramov'
                        border={`4px solid ${bgColor}`}
                    />
                </Flex>
            </Box>

            <UserOptions
                ownProfile={ownProfile}
                isFollowing={isFollowing}
                setIsFollowing={setIsFollowing}
                followers={followers}
                setFollowers={setFollowers}
                userData={userData}
            />


            <Box paddingX={{ base: '4%', lg: "2%", '2xl': '8%' }} mt={{ base: "0.5rem", lg: "2rem" }}>
                <Heading
                    noOfLines={1}
                >{userData.name}</Heading>

                {userData.bio && (
                    <Text
                        mt="2"
                        mb="4"
                        maxW="2xl"
                        fontSize={{ base: "sm", lg: "md" }}
                        color='gray.500'
                        noOfLines={2}
                    >
                        {userData.bio}
                    </Text>
                )}

                <HStack spacing={6} mt={{ base: 1, md: 2 }}>
                    {ownProfile && (
                        <HStack
                            role="group"
                        >
                            <RiCopperCoinFill
                                size="1.5rem"
                                color='gray'
                            />
                            <HStack
                                spacing={1}
                                cursor="pointer"
                                onClick={() => handleAddressCopy(window.ethereum.selectedAddress)}
                            >
                                <Text
                                    color="gray.600"
                                    _groupHover={{
                                        color: textColor,
                                    }}
                                    fontWeight="semibold"
                                    fontSize={{ base: "sm", lg: "md" }}
                                >
                                    {trimString(window.ethereum.selectedAddress)}
                                </Text>
                                <Box
                                    color="gray.600"
                                    _groupHover={{
                                        color: textColor,
                                    }}
                                >
                                    <IoCopyOutline
                                        size="1.2rem"

                                    />
                                </Box>
                            </HStack>
                        </HStack>
                    )}
                    <HStack>
                        <BsFillCalendarEventFill
                            size="1.2rem"
                            color='gray'
                        />
                        <Text
                            color="gray.600"
                            fontWeight="semibold"
                            fontSize={{ base: "sm", lg: "md" }}
                        >
                            Joined February 2022
                        </Text>
                    </HStack>
                </HStack>

                <HStack spacing={6} mt={{ base: 3, md: 6 }}>
                    <FollowersModal
                        ownProfile={ownProfile}
                        account_id={profileId}
                        ownProfileId={currentUserData.account_id}
                        type="Followers"
                        noOfUsers={followers}
                    />
                    <FollowersModal
                        ownProfile={ownProfile}
                        account_id={profileId}
                        ownProfileId={currentUserData.account_id}
                        type="Following"
                        noOfUsers={userData.followings}
                    />
                </HStack>

            </Box>


            <Tabs paddingX={{ base: '0%', lg: "2%", '2xl': '7%' }} isLazy mt="8" isFitted={isSmallScreen}>
                <TabList>
                    <Tab
                        fontWeight="800"
                        color="gray"
                        _selected={{ borderBottom: `3px solid ${textColor}`, color: textColor }}
                        _focus={{ boxShadow: "none" }}
                        minW={{ base: "50px", lg: "200px" }}
                    >
                        <HStack>
                            <Heading size="sm">Collected</Heading>
                            {/* <Text
                                color="gray.500"
                                fontSize={{ base: "xs", lg: "sm" }}
                                display={{ base: "none", md: "block" }}
                            >
                                (2345)
                            </Text> */}
                        </HStack>
                    </Tab>
                    <Tab
                        fontWeight="800"
                        color="gray"
                        _selected={{ borderBottom: `3px solid ${textColor}`, color: textColor }}
                        _focus={{ boxShadow: "none" }}
                        minW={{ base: "50px", lg: "200px" }}
                    >
                        <HStack>
                            <Heading size="sm">Created</Heading>
                            {/* <Text
                                color="gray.500"
                                fontSize={{ base: "xs", lg: "sm" }}
                                display={{ base: "none", md: "block" }}
                            >
                                (168)
                            </Text> */}
                        </HStack>
                    </Tab>
                    <Tab
                        fontWeight="800"
                        color="gray"
                        _selected={{ borderBottom: `3px solid ${textColor}`, color: textColor }}
                        _focus={{ boxShadow: "none" }}
                        minW={{ base: "50px", lg: "200px" }}
                        cursor={!ownProfile && 'not-allowed'}
                        isDisabled={!ownProfile}
                    >
                        <Heading size="sm">Saved</Heading>
                    </Tab>
                </TabList>
                <TabPanels>
                    <TabPanel p={{ base: 0, md: 4 }}>
                        <CollectedVideos />
                    </TabPanel>
                    <TabPanel p={{ base: 0, md: 4 }}>
                        <CollectedVideos />
                    </TabPanel>
                    <TabPanel p={{ base: 0, md: 4 }}>
                        {ownProfile && (
                            <SavedVideos />
                        )}
                    </TabPanel>
                </TabPanels>
            </Tabs>
            <Box pb={8} pt={20}>
                <Footer />
            </Box>
        </Box>
    )
}

export default Profile