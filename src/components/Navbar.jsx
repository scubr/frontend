import { Box, Center, Flex, HStack, Avatar, IconButton, Link, Spacer, Stack, Text, useColorModeValue, useDisclosure, useBreakpointValue } from '@chakra-ui/react';
import { AiOutlineClose } from "react-icons/ai";
import { GiHamburgerMenu } from "react-icons/gi";
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import { ColorModeSwitcher } from './ColorModeSwitcher';
import { IoWallet } from 'react-icons/io5';
import MenuIcon from './MenuIcon';
import { RiHome5Fill, RiVideoUploadFill, RiStore3Fill } from 'react-icons/ri';
import { userContext } from '../userContext'
import SearchBar from './SearchBar/index';

const Links = [
    { name: 'Home', to: "/", icon: <RiHome5Fill size={26} /> },
    { name: 'Marketplace', to: "/marketplace", icon: <RiStore3Fill size={26} /> },
    { name: 'Create', to: "/upload", icon: <RiVideoUploadFill size={26} /> },
    { name: 'Wallet', to: "/wallet", icon: <IoWallet size={26} /> },
    { name: 'profile', to: "/profile", icon: <Avatar size="sm" /> },
];


const Navbar = () => {

    const { isOpen, onOpen, onClose } = useDisclosure();
    const location = useLocation();
    const url = location.pathname;
    const formattedUrl = url === '/' ? 'home' : url.slice(1);
    const hideBelowMd = useBreakpointValue({ base: 'none', md: 'block' });


    return (
        <Box
            id="navbar"
            w="100vw"
            zIndex={20}
            position={formattedUrl !== "marketplace" && "fixed"}
            bg={useColorModeValue('white', 'black')}
        >
            <Flex
                h="8vh"
                align="center"
                paddingX={{ base: '4%', lg: "2%", '2xl': '8%' }}
            >
                <RouterLink to="/">
                    <Text
                        fontSize={{ base: '1.5em', sm: '2em' }}
                        fontFamily="Ailerons"
                        userSelect="none"
                        cursor="pointer"
                        noOfLines={1}
                    >
                        Scubr
                    </Text>
                </RouterLink>

                <Spacer />
                <Box display={hideBelowMd}>
                    <SearchBar />
                </Box>

                <Spacer />
                <HStack spacing={4}>
                    <userContext.Consumer>
                        {({ currentUserData }) => {
                            return (
                                <HStack
                                    as={'nav'}
                                    spacing={3}
                                    display={{ base: 'none', lg: 'flex' }}>
                                    <MenuIcon
                                        name="home"
                                        icon={<RiHome5Fill size={26} />}
                                    />
                                    <Spacer />
                                    <MenuIcon
                                        name="marketplace"
                                        icon={<RiStore3Fill size={26} />}
                                    />
                                    <Spacer />
                                    <MenuIcon
                                        name="upload"
                                        icon={<RiVideoUploadFill size={26} />}
                                    />
                                    <Spacer />
                                    <MenuIcon
                                        name="wallet"
                                        icon={<IoWallet size={26} />}
                                    />
                                    <Spacer />
                                    <MenuIcon
                                        name="profile"
                                        icon={<Avatar size="sm" src={currentUserData.image_url} />}
                                    />
                                </HStack>
                            );
                        }}
                    </userContext.Consumer>

                    <ColorModeSwitcher />
                    <IconButton
                        size={'md'}
                        icon={isOpen ? <Center><AiOutlineClose /></Center> : <Center><GiHamburgerMenu /></Center>}
                        aria-label={'Open Menu'}
                        display={{ lg: 'none' }}
                        onClick={isOpen ? onClose : onOpen}
                    />
                </HStack>
            </Flex>
            {isOpen ? (
                <Box pb={4} zIndex={50} display={{ lg: 'none' }}>
                    <Stack as={'nav'} spacing={4} px={6}>
                        {Links.map(({ name, to, external, icon }) => (
                            <NavLink key={name} to={to} external={external} close={onClose}>
                                <HStack
                                    spacing={4}
                                >
                                    {icon}
                                    <Text
                                        cursor="pointer"
                                        noOfLines={1}
                                    >
                                        {name}
                                    </Text>
                                </HStack>
                            </NavLink>
                        ))}
                    </Stack>
                </Box>
            ) : null}
        </Box>
    );
};

const NavLink = ({ children, to, close, external }) => {

    const navigate = useNavigate();
    const location = useLocation();
    const url = location.pathname;

    const linkBg = useColorModeValue('gray.200', 'gray.700');

    const handleClick = () => {
        close && close()
        if (external) {
            window.open(to, '_blank');
        } else {
            navigate(to);
        }
    };

    return (
        <Link
            px={3}
            py={2}
            fontWeight="bold"
            fontSize="1em"
            className='noselect'
            rounded={'md'}
            _hover={{
                textDecoration: 'none',
            }}
            //change bg color of the link depending on the current url and its sub-urls
            bg={url === to ? linkBg : 'transparent'}

            onClick={handleClick}
        >
            {children}
        </Link>
    );
};

export default Navbar;
