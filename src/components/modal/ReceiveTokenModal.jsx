import {
    Box,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
    Button,
    Text,
    Input,
    useDisclosure,
    InputGroup,
    InputRightElement,
    useToast,
    useBreakpointValue,
    VStack,
    useColorModeValue
} from '@chakra-ui/react'
import React from 'react';
import QRCode from "react-qr-code";
import { IoCopyOutline } from 'react-icons/io5';

const ReceiveTokenModal = ({ currentWalletAddress, children }) => {

    const { isOpen, onOpen, onClose } = useDisclosure();
    const toast = useToast();
    const toastId = 'receive-toast';
    const modalSize = useBreakpointValue({ base: "full", md: "xl" });
    const qrBgcolor = useColorModeValue("#EDF2F7", "#1A202C");
    const qrColor = useColorModeValue("black", "#ffffffFA");

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
        <>
            <Box onClick={onOpen}>{children}</Box>
            <Modal isOpen={isOpen} onClose={onClose} size={modalSize}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Receive SET</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody mt={10}>
                        <InputGroup size='md'>
                            <Input
                                pr='4.5rem'
                                type='text'
                                value={currentWalletAddress}
                                _focus={{ borderColor: 'none' }}
                            />
                            <InputRightElement width='4.5rem'>
                                <Button h='1.75rem' size='sm' onClick={() => handleAddressCopy(currentWalletAddress)}>
                                    <IoCopyOutline
                                        size="1rem"

                                    />
                                </Button>
                            </InputRightElement>
                        </InputGroup>
                        <VStack p={10}>
                            <Text fontSize="xl" fontWeight="bold" mb={5}>Or scan this QR code</Text>
                            <Box
                                p={4}
                                bg={qrBgcolor}
                                rounded="lg"
                                border="2 solid red"
                            >
                                <QRCode
                                    value={currentWalletAddress}
                                    bgColor={qrBgcolor}
                                    title="SET"
                                    fgColor={qrColor}
                                />
                            </Box>
                        </VStack>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    )
}

export default ReceiveTokenModal