import React, { useState, useEffect } from 'react';
import ModalFrame from '../basic/ModalFrame';
import {
    useDisclosure,
    Button,
    Skeleton,
    HStack,
    Text,
    VStack,
    SkeletonCircle,
    Avatar,
    useColorModeValue,
    Heading,
    useToast,
    Spacer,
    useBreakpointValue
} from "@chakra-ui/react";
import { getAllFollowers, getAllFollowing } from '../../services/accountService';
import { useNavigate } from 'react-router';
import { unfollowAnAccount, followAnAccount } from '../../services/accountService';
import { FaChevronLeft } from 'react-icons/fa';

const FollowersModal = ({
    account_id,
    type,
    noOfUsers,
    ownProfile,
    ownProfileId
}) => {

    const { isOpen, onOpen, onClose } = useDisclosure();
    const [users, setUsers] = useState([]);
    const [currentUserFollowing, setCurrentUserFollowing] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentUserFollowingLoading, setCurrentUserFollowingLoading] = useState(false);
    const hoverBg = useColorModeValue("gray.100", "gray.800");
    const bgColor = useColorModeValue("white", "black");
    const textColor = useColorModeValue("black", "white");
    const textHover = useColorModeValue("blackAlpha.800", "whiteAlpha.800");
    const outlineBtnHover = useColorModeValue("blackAlpha.200", "whiteAlpha.200");
    const avatarSize = useBreakpointValue({ base: "sm", md: "md" });
    const btnSize = useBreakpointValue({ base: "xs", md: "sm" })
    const toast = useToast();
    const navigate = useNavigate();



    // get user Following and Followers
    useEffect(() => {

        if (noOfUsers === 0 || !account_id) return;

        const getUserFollowersAndFollowing = async () => {
            setLoading(true);
            try {
                if (type === 'Followers') {
                    const followers = await getAllFollowers(account_id);
                    setUsers(followers);
                } else {
                    const following = await getAllFollowing(account_id);
                    setUsers(following);
                }
                setLoading(false);
            } catch (error) {
                toast({
                    title: 'Error',
                    description: error.message,
                    status: 'error',
                    duration: 9000,
                    isClosable: true
                });
                setLoading(false);
            }
        }

        getUserFollowersAndFollowing();

    }, [account_id, noOfUsers, ownProfile, toast, type]);


    // get current user following
    useEffect(() => {

        if (!ownProfileId || noOfUsers === 0) return;

        const getCurrentUserFollowing = async () => {
            setCurrentUserFollowingLoading(true);
            try {
                const following = await getAllFollowing(ownProfileId);
                setCurrentUserFollowing(following);
                setCurrentUserFollowingLoading(false);
            } catch (error) {
                setCurrentUserFollowingLoading(false);
                toast({
                    title: 'Error',
                    description: error.message,
                    status: 'error',
                    duration: 9000,
                    isClosable: true
                });
            }
        }

        getCurrentUserFollowing();

    }, [account_id, noOfUsers, ownProfile, toast, ownProfileId]);


    const handleClick = (user_id) => {
        navigate(`/profile/${user_id}`);
        onClose();
    }

    const handleUnfollowButtonClick = async (user_id) => {
        const accountType = type === "Following" ? 'followee_id' : 'follower_id';
        try {
            await unfollowAnAccount(user_id);
            if (ownProfile && type === "Following") {
                const newUsers = users.filter(user => user[accountType] !== user_id);
                setUsers(newUsers);
            } else {
                const newFollowing = currentUserFollowing.filter(user => user.followee_id !== user_id);
                setCurrentUserFollowing(newFollowing);
            }
        } catch (error) {
            toast({
                title: 'Error',
                description: error.message,
                status: 'error',
                duration: 9000,
                isClosable: true
            });
        }
    }

    const handleFollowButtonClick = async (user_id) => {
        const accountType = type === "Following" ? 'followee_id' : 'follower_id';
        try {
            await followAnAccount(user_id);
            const newFollowing = users.find(user => user[accountType] === user_id);
            setCurrentUserFollowing([...currentUserFollowing, newFollowing]);
        } catch (error) {
            toast({
                title: 'Error',
                description: error.message,
                status: 'error',
                duration: 9000,
                isClosable: true
            });
        }
    }

    const FollowButton = ({ accountId }) => {
        return (
            <Button
                w={{ base: 24, md: 28 }}
                fontSize={btnSize}
                rounded={'full'}
                size={btnSize}
                bg={textColor}
                color={bgColor}
                onClick={() => handleFollowButtonClick(accountId)}
                _hover={{
                    bg: textHover,
                }}
                _focus={{
                    outline: 'none'
                }}
            >
                Follow
            </Button>
        )
    }

    const UnfollowButton = ({ accountId }) => {

        return (
            <Button
                w={{ base: 24, md: 28 }}
                fontSize={btnSize}
                rounded={'full'}
                size={btnSize}
                variant="outline"
                onClick={() => handleUnfollowButtonClick(accountId)}
                _hover={{
                    bg: outlineBtnHover,
                }}
                _focus={{
                    outline: 'none'
                }}
            >
                Following
            </Button>
        )
    }


    const renderContent = () => {
        return (
            <VStack
                align="stretch"
                spacing={4}
                overflowY="auto"
                maxH="60vh"
                mb={6}
            >
                {loading && currentUserFollowingLoading ? (
                    <>
                        {[...Array(noOfUsers)].map((_, index) => (
                            <HStack>
                                <SkeletonCircle size='12' />
                                <Skeleton height='20px' width="100%" />
                            </HStack>
                        ))}
                    </>
                ) : (
                    users.map((user) => {
                        const accountId = type === "Following" ? user.followee_id : user.follower_id;
                        const isFollowing = currentUserFollowing.some(user => user.followee_id === accountId);
                        return (
                            <HStack
                                key={accountId}
                                px={4}
                                py={2}
                                rounded="md"
                                _hover={{
                                    bg: hoverBg
                                }}
                            >
                                <HStack
                                    onClick={() => handleClick(accountId)}
                                    cursor="pointer"
                                    spacing={4}
                                >
                                    <Avatar
                                        size={avatarSize}
                                        src={user.image_url}
                                        bg="gray.500"
                                        color="white"
                                    />
                                    <Text
                                        fontSize={{ base: "md", lg: "lg" }}
                                        fontWeight="bold"
                                    >
                                        {user.name}
                                    </Text>
                                </HStack>
                                <Spacer />
                                {type === "Following" && ownProfile ? (
                                    <UnfollowButton accountId={accountId} />
                                ) : (
                                    isFollowing ? (
                                        <UnfollowButton accountId={accountId} />
                                    ) : (
                                        <FollowButton accountId={accountId} />
                                    )
                                )}
                            </HStack>
                        );
                    })
                )}
            </VStack>
        )
    }


    const RenderHeader = () => {
        return (
            <Heading
                fontSize={{ base: "md", lg: "lg" }}
                fontWeight="bold"
            >
                {type}
            </Heading>
        )
    }




    return (
        <ModalFrame
            isOpen={isOpen}
            onClose={onClose}
            Button={() => (
                <HStack
                    cursor={noOfUsers !== 0 ? "pointer" : "default"}
                    onClick={noOfUsers !== 0 ? onOpen : undefined}
                    role="group"
                >
                    <Text
                        fontWeight="bold"
                        fontSize={{ base: "md", lg: "lg", xl: "xl" }}
                    >
                        {noOfUsers}
                    </Text>
                    <Text
                        color={"gray.500"}
                        fontWeight="medium"
                        fontSize={{ base: "sm", lg: "md", xl: "lg" }}
                        _groupHover={{
                            color: "white"
                        }}
                    >
                        {type}
                    </Text>
                </HStack>
            )}
            modalHeaderFunc={() => (
                <RenderHeader />
            )}
            modalContentFunc={() => (
                renderContent()
            )}
            drawerHeaderFunc={() => (
                <HStack spacing={6}>
                    <FaChevronLeft onClick={onClose} cursor="pointer" />
                    <Heading
                        fontSize={{ base: "md", lg: "lg" }}
                        fontWeight="bold"
                    >
                        {type}
                    </Heading>
                </HStack>
            )}
            drawerContentFunc={() => (
                renderContent()
            )}
        />
    )
}

export default FollowersModal