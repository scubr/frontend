
import {
    Button,
    Flex,
    IconButton,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    useColorModeValue,
    useBreakpointValue,
    useToast

} from '@chakra-ui/react';
import React, { useContext } from 'react'
import { BsThreeDots } from 'react-icons/bs'
import { IoIosShareAlt } from 'react-icons/io'
import { MdReport } from 'react-icons/md'
import { AiOutlineLogout } from 'react-icons/ai';
import { followAnAccount, unfollowAnAccount } from '../../services/accountService';
import { useNavigate } from 'react-router-dom';
import { userContext } from '../../userContext';
import EditProfile from './EditProfile';

const UserOptions = ({
    ownProfile,
    userData,
    isFollowing,
    setIsFollowing,
    followers,
    setFollowers,
}) => {

    const bgColor = useColorModeValue("white", "black");
    const textColor = useColorModeValue("black", "white");
    const textHover = useColorModeValue("blackAlpha.800", "whiteAlpha.800");
    const outlineBtnHover = useColorModeValue("blackAlpha.200", "whiteAlpha.200");
    const btnSize = useBreakpointValue({ base: "sm", lg: "md" });
    const toast = useToast();
    const toastId = 'profile-link-toast';

    const navigate = useNavigate();
    const { setToken } = useContext(userContext);


    const handleFollowButtonClick = async () => {
        setIsFollowing(true);
        setFollowers(followers + 1);
        try {
            await followAnAccount(userData && userData.account_id);
        } catch (error) {
            setIsFollowing(false);
            setFollowers(followers - 1);
        }
    }

    const handleUnfollowButtonClick = async () => {
        if (followers === 0) return;
        setIsFollowing(false);
        setFollowers(followers - 1);
        try {
            await unfollowAnAccount(userData && userData.account_id);
        } catch (error) {
            setIsFollowing(true);
            setFollowers(followers + 1);
        }
    }

    const handleLogout = () => {
        localStorage.removeItem('token');
        setToken(null);
        navigate(`/`);
    }

    const handleProfileCopy = () => {
        navigator.clipboard.writeText(`https://www.scubr.org/profile/${userData && userData.account_id}`);
        if (!toast.isActive(toastId)) {
            toast({
                id: toastId,
                title: "Profile copied to clipboard",
                status: "success",
                duration: 2000,
                position: "top-right"
            });
        }
    }


    if (!ownProfile) {
        return (
            <Flex justify={"end"} paddingX={{ base: '4%', lg: "2%", '2xl': '8%' }} py="3">
                <Button
                    w={32}
                    mr="4"
                    fontSize={'sm'}
                    rounded={'full'}
                    size={{ base: "sm", lg: "md" }}
                    variant="outline"
                    bg={isFollowing ? undefined : textColor}
                    color={isFollowing ? undefined : bgColor}
                    onClick={isFollowing ? handleUnfollowButtonClick : handleFollowButtonClick}
                    _hover={{
                        bg: isFollowing ? outlineBtnHover : textHover,
                    }}
                    _focus={{
                        outline: 'none'
                    }}
                >
                    {isFollowing ? 'following' : 'Follow'}
                </Button>
                <Menu>
                    <MenuButton
                        as={IconButton}
                        aria-label="More profile options"
                        icon={<BsThreeDots />}
                        variant="outline"
                        rounded={"full"}
                        size={btnSize}
                        colorScheme="gray"
                    />
                    <MenuList zIndex={20}>
                        <MenuItem
                            icon={<IoIosShareAlt size={20} />}
                            onClick={handleProfileCopy}
                        >
                            Share
                        </MenuItem>
                        <MenuItem icon={<MdReport size={20} />}>
                            Report
                        </MenuItem>
                    </MenuList>
                </Menu>
            </Flex>
        )
    }

    else {
        return (
            <Flex justify={"end"} paddingX={{ base: '4%', lg: "2%", '2xl': '8%' }} py="3">
                <EditProfile
                    userData={userData}
                />
                <Menu>
                    <MenuButton
                        as={IconButton}
                        aria-label="More profile options"
                        icon={<BsThreeDots />}
                        variant="outline"
                        rounded={"full"}
                        size={btnSize}
                        colorScheme="gray"
                    />
                    <MenuList zIndex={20}>
                        <MenuItem
                            icon={<IoIosShareAlt size={20} />}
                            onClick={handleProfileCopy}
                        >
                            Share
                        </MenuItem>
                        <MenuItem icon={<AiOutlineLogout size={20} />} onClick={handleLogout}>
                            Logout
                        </MenuItem>
                    </MenuList>
                </Menu>
            </Flex>
        )

    }

}

export default UserOptions