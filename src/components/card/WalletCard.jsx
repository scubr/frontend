import {
    Box,
    Heading,
    HStack,
    Avatar,
    VStack,
    Text,
    useColorModeValue,
    useToast,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    useBreakpointValue,
    Flex,
    MenuDivider,
} from '@chakra-ui/react'
import React, { useState, useEffect } from 'react';
import { MdLogout } from 'react-icons/md';
import { HiOutlineChevronDown, HiOutlineRefresh } from 'react-icons/hi';
import { IoCopyOutline } from 'react-icons/io5';
import { FiArrowDown, FiArrowUpRight, FiArrowDownLeft, FiPlus } from 'react-icons/fi';
import { AiFillLock } from 'react-icons/ai';
import { BiRefresh } from 'react-icons/bi';
import { IoAdd } from 'react-icons/io5';
import Fox from "../../assets/metamask.svg";
import SET from '../../contracts/SET';
import StakeModal from '../modal/StakeModal';
import ReceiveTokenModal from '../modal/ReceiveTokenModal';
import SendTokenModal from '../modal/SendTokenModal';
import WithdrawModal from '../modal/WithdrawModal';

const WalletCard = ({ type = 'compact', mobileSize = false, accountBalance, scubrBalance }) => {



    const [currentWallet, setCurrentWallet] = useState("scubr");
    const currentWalletAddress = currentWallet === 'scubr' ? '0x0000000000000000000000000000000000000000' : window.ethereum.selectedAddress;



    return (
        <Box
            bg={useColorModeValue("blackAlpha.200", "whiteAlpha.200")}
            rounded={"lg"}
            w="100%"
            p={type === 'compact' ? (mobileSize ? 5 : 8) : 10}
            pb={mobileSize && 14}
            mb={type === 'compact' && !mobileSize ? 0 : 8}
            height={type === 'compact' && !mobileSize && "50vh"}
            px={type === 'compact' ? undefined : { base: 10, lg: 20 }}

        >
            {type === 'compact' ? (
                <>
                    <WalletHeader
                        currentWallet={currentWallet}
                        setCurrentWallet={setCurrentWallet}
                        currentWalletAddress={currentWalletAddress}
                    />
                    <TotalBalance accountBalance={currentWallet === 'scubr' ? scubrBalance : accountBalance} />
                    {currentWallet === 'scubr' ? (
                        <HStack
                            mt={10}
                            justify={"space-between"}
                        >

                            <WithdrawModal accountBalance={scubrBalance}>
                                <WalletButtons text="Withdraw">
                                    <FiArrowDown size="2.4rem" />
                                </WalletButtons>
                            </WithdrawModal>

                            <SendTokenModal currentWallet={currentWallet} accountBalance={scubrBalance}>
                                <WalletButtons text="Send">
                                    <FiArrowUpRight size="2.4rem" />
                                </WalletButtons>
                            </SendTokenModal>

                            <ReceiveTokenModal currentWalletAddress={currentWalletAddress}>
                                <WalletButtons text="Receive">
                                    <FiArrowDownLeft size="2.4rem" />
                                </WalletButtons>
                            </ReceiveTokenModal>

                            <WalletButtons text="Refresh">
                                <BiRefresh size="2.4rem" />
                            </WalletButtons>

                        </HStack>
                    ) : (
                        <HStack
                            mt={10}
                            justify={"space-between"}
                        >

                            <SendTokenModal currentWallet={currentWallet} accountBalance={accountBalance}>
                                <WalletButtons text="Send">
                                    <FiArrowUpRight size="2.4rem" />
                                </WalletButtons>
                            </SendTokenModal>

                            <ReceiveTokenModal currentWalletAddress={currentWalletAddress}>
                                <WalletButtons text="Receive">
                                    <FiArrowDownLeft size="2.4rem" />
                                </WalletButtons>
                            </ReceiveTokenModal>

                            <StakeModal accountBalance={accountBalance}>
                                <WalletButtons text="Stake">
                                    <AiFillLock size="2.4rem" />
                                </WalletButtons>
                            </StakeModal>

                            <WalletButtons
                                text="Add"
                                onClick={() => {
                                    window.open("https://app.uniswap.org/#/swap?inputCurrency=0x081F67aFA0cCF8c7B17540767BBe95DF2bA8D97F", "_blank")
                                }}
                            >
                                <FiPlus size="2.4rem" />
                            </WalletButtons>

                        </HStack>
                    )}
                </>
            ) : (
                <Flex
                    direction={{ base: 'column', md: 'row' }}
                    justify={"space-between"}
                    align={{ base: 'flex-start', md: 'center' }}
                >
                    <VStack spacing={10} align="start">
                        <WalletHeader
                            currentWallet={currentWallet}
                            setCurrentWallet={setCurrentWallet}
                            currentWalletAddress={currentWalletAddress}
                        />
                        <TotalBalance accountBalance={currentWallet === 'scubr' ? scubrBalance : accountBalance} />
                    </VStack>

                    {currentWallet === 'scubr' ? (
                        <VStack
                            justify={"start"}
                            spacing={6}
                        >
                            <HStack spacing={8}>

                                <WithdrawModal accountBalance={scubrBalance}>
                                    <WalletButtons text="Withdraw">
                                        <FiArrowDown size="2.4rem" />
                                    </WalletButtons>
                                </WithdrawModal>

                                <WalletButtons text="Send">
                                    <FiArrowUpRight size="2.4rem" />
                                </WalletButtons>
                            </HStack>
                            <HStack spacing={8}>
                                <WalletButtons text="Receive">
                                    <FiArrowDownLeft size="2.4rem" />
                                </WalletButtons>

                                <WalletButtons text="Refresh">
                                    <BiRefresh size="2.4rem" />
                                </WalletButtons>

                            </HStack>
                        </VStack>
                    ) : (
                        <VStack
                            justify={"start"}
                            spacing={6}
                        >
                            <HStack spacing={8}>

                                <SendTokenModal currentWallet={currentWallet} accountBalance={accountBalance}>
                                    <WalletButtons text="Send">
                                        <FiArrowUpRight size="2.4rem" />
                                    </WalletButtons>
                                </SendTokenModal>

                                <ReceiveTokenModal currentWalletAddress={currentWalletAddress}>
                                    <WalletButtons text="Receive">
                                        <FiArrowDownLeft size="2.4rem" />
                                    </WalletButtons>
                                </ReceiveTokenModal>

                            </HStack>
                            <HStack spacing={8}>
                                <StakeModal accountBalance={accountBalance}>
                                    <WalletButtons text="Stake">
                                        <AiFillLock size="2.4rem" />
                                    </WalletButtons>
                                </StakeModal>

                                <WalletButtons
                                    text="Add"
                                    onClick={() => {
                                        window.open("https://app.uniswap.org/#/swap?inputCurrency=0x081F67aFA0cCF8c7B17540767BBe95DF2bA8D97F", "_blank");
                                    }}
                                >
                                    <IoAdd size="2.4rem" />
                                </WalletButtons>
                            </HStack>
                        </VStack>
                    )}


                </Flex>
            )}

        </Box>
    )
}


const WalletButtons = ({ children, text, onClick }) => {

    const mobileSize = useBreakpointValue({ base: true, sm: false });

    return (
        <VStack
            onClick={onClick}
        >
            <Flex
                bg={useColorModeValue("blackAlpha.200", "whiteAlpha.200")}
                _hover={{
                    bg: useColorModeValue("blackAlpha.300", "whiteAlpha.300"),
                }}
                cursor="pointer"
                boxSize={mobileSize ? "60px" : "70px"}
                borderRadius="26"
                align="center"
                justify="center"
            >
                {children}
            </Flex>
            <Text
                fontWeight="semibold"
                fontSize="xs"
                mt={2}
            >
                {text}
            </Text>
        </VStack>
    )
};


const TotalBalance = ({ accountBalance }) => {


    const accountBalanceLength = accountBalance.toString().length;

    // show only 2 demicals
    const accountBalanceFixed = accountBalance.toFixed(2);


    return (
        <VStack mt={10} align="start" spacing={1}>
            <Text
                color="gray.600"
                fontWeight="semibold"
                fontSize="md"
            >
                Total Balance
            </Text>
            <HStack>
                <Heading
                    size={accountBalanceLength > 14 ? "lg" : accountBalanceLength > 9 ? "xl" : accountBalanceLength > 6 ? "2xl" : "3xl"}
                >
                    {accountBalanceFixed}
                </Heading>
                <Heading size="md">SET</Heading>
            </HStack>
            <Heading fontSize={"lg"} pl={1} color="green.400">$ 228.12</Heading>
        </VStack>
    )
}

const WalletHeader = ({ currentWallet, setCurrentWallet, currentWalletAddress }) => {

    const textColor = useColorModeValue("gray.700", "gray.500");
    const toast = useToast();
    const toastId = 'clipboard-toast';


    const changeWallet = () => {
        if (currentWallet === "scubr") {
            setCurrentWallet("metamask");
        } else {
            setCurrentWallet("scubr");
        }
    }

    const trimString = (str) => {
        // leave first 6 characters and last 4 characters and replace the rest with ...
        return str.slice(0, 10) + '...' + str.slice(-4);
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
        <HStack spacing={3}>
            {currentWallet === 'scubr' ? <Avatar size="md" /> : <Avatar bg="none" src={Fox} size="md" />}
            <Box>
                <Menu isLazy>
                    <MenuButton>
                        <HStack cursor="pointer">
                            <Heading
                                size={"md"}
                            >
                                {currentWallet === 'scubr' ? 'Scubr Wallet' : 'MetaMask Wallet'}
                            </Heading>
                            <HiOutlineChevronDown />
                        </HStack>
                    </MenuButton>
                    <MenuList>
                        <MenuItem
                            onClick={changeWallet}
                        >
                            <Avatar
                                boxSize='2rem'
                                borderRadius='full'
                                src={currentWallet === 'scubr' ? Fox : null}
                                alt='Wallet icon'
                                mr='12px'
                                bg="none"
                            />
                            <span>
                                <Text
                                    fontWeight={"medium"}
                                >
                                    {currentWallet === 'scubr' ? 'MetaMask Wallet' : 'Scubr Wallet'}
                                </Text>
                            </span>
                        </MenuItem>
                        <MenuDivider />
                        <MenuItem icon={<HiOutlineRefresh fontSize="16" />}>Refresh funds</MenuItem>
                        <MenuItem icon={<MdLogout fontSize="16" />}>Log out</MenuItem>
                    </MenuList>
                </Menu>
                <HStack
                    spacing={1}
                    role="group"
                    cursor="pointer"
                    onClick={() => handleAddressCopy(currentWalletAddress)}
                >
                    <Text
                        color="gray.600"
                        _groupHover={{
                            color: textColor,
                        }}
                        fontWeight="semibold"
                        fontSize="sm"
                    >
                        {trimString(currentWalletAddress)}
                    </Text>
                    <Box
                        color="gray.600"
                        _groupHover={{
                            color: textColor,
                        }}
                    >
                        <IoCopyOutline
                            size="1rem"

                        />
                    </Box>
                </HStack>
            </Box>
        </HStack>
    )
}

export default WalletCard