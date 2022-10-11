import React, { useState } from 'react';
import {
    useDisclosure,
    useBreakpointValue,
    Button,
    HStack,
    Text,
    VStack,
    Box,
    Image,
    Avatar,
    useColorModeValue,
    Heading,
    SimpleGrid,
    Flex
} from "@chakra-ui/react"
import { IoGift } from 'react-icons/io5';
import { MdOutlineAdd } from 'react-icons/md'
import { FaChevronLeft } from 'react-icons/fa';
import ModalFrame from '../basic/ModalFrame';
import { IoWallet } from 'react-icons/io5';
import { awardStickers } from '../../constants/awards';
import SET from '../../contracts/SET';
import web3 from '../../contracts/web3';

const AwardModal = ({
    creatorName,
    creatorImage,
    totalAwards,
    isCreator,
    children
}) => {

    const { isOpen, onOpen, onClose } = useDisclosure();
    const awardButtonSize = useBreakpointValue({ base: "xs", md: "sm" });
    const secondaryBg = useColorModeValue("gray.100", "gray.800");
    const buttonBg = useColorModeValue("gray.300", "whiteAlpha.200")
    const secondaryText = useColorModeValue("gray.500", "gray.400");
    const hideInMobile = useBreakpointValue({ base: "none", md: "flex" });
    const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;

    const [awards, setAwards] = useState(['Best Video', 'Cap']);


    return (
        <>
            <ModalFrame
                isOpen={isOpen}
                onClose={onClose}
                Button={children ? () => (<Box onClick={onOpen}>{children}</Box>) : () => (
                    <HStack>
                        <HStack display={hideInMobile}>
                            <HStack spacing={1} onClick={onOpen} cursor="pointer">
                                <Box>
                                    {awards.map((award, i) => (
                                        <Avatar
                                            bg="none"
                                            key={i}
                                            src={awardStickers.find(sticker => sticker.name === award).image}
                                            size="xs"
                                            name={"o"}
                                        />
                                    ))}
                                </Box>
                                <Text
                                    fontSize={{ base: "10", md: "12", lg: "13" }}
                                >2 awards</Text>
                            </HStack>
                            <Text color={"gray.500"}>
                                •
                            </Text>
                        </HStack>
                        <Button leftIcon={<IoGift />} size={awardButtonSize} onClick={onOpen} colorScheme="dark" variant="outline">
                            Award
                        </Button>
                    </HStack>
                )}
                modalContentFunc={() => (
                    <>
                        <Box bg={secondaryBg} mb="2" py={4} px={6} borderRadius="md">
                            <Heading size="md" my="2">Received Awards</Heading>
                            <Flex mt="4" overflow={"scroll"} className={isMac ? "" : "hide-scrollbars"}>
                                {awards.map((award, i) => (
                                    <Box>
                                        <VStack
                                            spacing={2}
                                            px={4}
                                            rounded="md"
                                            w="80px"
                                        >
                                            <Image
                                                src={awardStickers.find(sticker => sticker.name === award).image}
                                                w="100px"
                                            />
                                            <VStack spacing={0}>
                                                <Text
                                                    fontWeight="medium"
                                                    color={secondaryText}
                                                >1</Text>
                                            </VStack>
                                        </VStack>
                                    </Box>
                                ))}
                            </Flex>
                        </Box>

                        <Box
                            bg={secondaryBg}
                            mt="6" mb="2" py={4} px={6} borderRadius="md">
                            <HStack mb="4" justify="space-between">
                                <Heading fontSize={"2xl"}>Awards</Heading>
                                <HStack bg={buttonBg} rounded="lg">
                                    <HStack pl={4}>
                                        <IoWallet size="20" />
                                        <Heading fontSize={"md"}>213 SET</Heading>
                                    </HStack>
                                    <Box py={2} cursor="pointer" borderLeft={`1px solid`} borderColor={secondaryBg} px={2}>
                                        <MdOutlineAdd fontSize={20} />
                                    </Box>
                                </HStack>
                            </HStack>
                            <Box
                                maxH="42vh"
                                overflow={"scroll"}
                                className={isMac ? "" : "hide-scrollbars"}
                            >
                                <AwardGrid awards={awards} isCreator={isCreator} setAwards={setAwards} />
                            </Box>
                        </Box>
                    </>
                )}
                modalHeaderFunc={() => (

                    <VStack align={"start"} spacing={6}>
                        <HStack>
                            <IoGift fontSize={24} />
                            <Heading size="md">Award Creator</Heading>
                        </HStack>
                        <HStack spacing={4}>
                            <Avatar bg="gray.300" size={"md"} src={creatorImage} />
                            <VStack align={"start"} direction="column" justify="center" spacing={0}>
                                <Text fontSize={20} fontWeight="bold">{creatorName}</Text>
                                <Text color="gray.500" fontSize={12}>
                                    {totalAwards} total awards
                                </Text>
                            </VStack>
                        </HStack>
                    </VStack>
                )}
                drawerContentFunc={() => (
                    <>
                        <HStack spacing={4} mt={2} mb={0} px={4}>
                            <Avatar bg="gray.300" size={"md"} src={creatorImage} />
                            <VStack align={"start"} direction="column" justify="center" spacing={-1}>
                                <Text fontSize={18} fontWeight="bold">{creatorName}</Text>
                                <Text color="gray.500" fontSize={14}>
                                    {totalAwards} awards
                                </Text>
                            </VStack>
                        </HStack>

                        <Box bg={secondaryBg} mb="2" mt={8} py={4} px={6} mx={4} rounded="lg">
                            <Heading size="sm" my="2">Received Awards</Heading>
                            <Flex mt="4" overflow={"scroll"} className={isMac ? "" : "hide-scrollbars"}>
                                {awards.map((award, i) => (
                                    <Box>
                                        <VStack
                                            spacing={2}
                                            px={4}
                                            rounded="md"
                                            w="80px"
                                        >
                                            <Image
                                                src={awardStickers.find(sticker => sticker.name === award).image}
                                                w="100px"
                                            />
                                            <VStack spacing={0}>
                                                <Text
                                                    fontWeight="medium"
                                                    color={secondaryText}
                                                >1</Text>
                                            </VStack>
                                        </VStack>
                                    </Box>
                                ))}
                            </Flex>
                        </Box>

                        <Box bg={secondaryBg} mt="6" p={6}>
                            <HStack mb="4" justify="space-between">
                                <Heading fontSize={"xl"}>Awards</Heading>
                                <HStack bg={buttonBg} rounded="lg">
                                    <HStack pl={4}>
                                        <IoWallet size="16" />
                                        <Heading fontSize={"sm"}>213 SET</Heading>
                                    </HStack>
                                    <Box py={2} cursor="pointer" borderLeft={`1px solid`} borderColor={secondaryBg} px={2}>
                                        <MdOutlineAdd fontSize={16} />
                                    </Box>
                                </HStack>
                            </HStack>
                            <Box>
                                <AwardGrid isCreator={isCreator} awards={awards} setAwards={setAwards} />
                            </Box>
                        </Box>
                    </>
                )}
                drawerHeaderFunc={() => (
                    <HStack spacing={6}>
                        <FaChevronLeft onClick={onClose} cursor="pointer" />
                        <Heading size="md">Award Creator</Heading>
                    </HStack>
                )}
            />

        </>
    )
}

export default AwardModal


const AwardGrid = ({ isCreator, awards, setAwards }) => {

    const buttonBg = useColorModeValue("gray.300", "whiteAlpha.200")
    const secondaryText = useColorModeValue("gray.500", "gray.400")
    const isMobileSize = useBreakpointValue({ base: true, md: false });

    const handleAwardClick = (award) => {

        const handleBurning = async () => {

            const amountInWei = web3.utils.toWei(award.token.toString(), 'ether');

            await SET.methods.burn(amountInWei).send({ from: window.ethereum.selectedAddress });

            // send the award to the creator
            setAwards([...awards, award.name])
        }

        handleBurning()
    }



    return (
        <SimpleGrid minChildWidth={isMobileSize ? '120px' : '140px'} spacing={{ base: '1px', md: '4px' }} mt={4}>
            {awardStickers.map((sticker, i) => (
                <VStack
                    spacing={2}
                    mb={6}
                    p={4}
                    cursor={isCreator ? "not-allowed" : "pointer"}
                    rounded="md"
                    onClick={() => !isCreator && handleAwardClick(sticker)}
                    _hover={{
                        bg: buttonBg
                    }}
                >
                    <Image
                        src={sticker.image}
                        w={isMobileSize ? "60px" : "80px"}
                    />
                    <VStack spacing={0}>
                        <Text textAlign={"center"} fontWeight={isMobileSize ? "medium" : "bold"} fontSize={isMobileSize ? 12 : 14}>{sticker.name}</Text>
                        <Text
                            color={secondaryText}
                            fontSize={isMobileSize ? 11 : 12}
                            fontWeight="medium"
                        >{sticker.token} SET</Text>
                    </VStack>
                </VStack>
            ))}
        </SimpleGrid>
    )
}
