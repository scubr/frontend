import React, { useState } from 'react';
import {
    useDisclosure,
    useBreakpointValue,
    Button,
    Box,
    Input,
    FormControl,
    FormLabel,
    FormHelperText,
    FormErrorMessage,
    useToast,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
} from "@chakra-ui/react";
import SET from '../../contracts/SET';

const WithdrawModal = ({
    children,
    accountBalance
}) => {

    const { isOpen, onOpen, onClose } = useDisclosure();
    const [amount, setAmount] = useState(null);
    const [submit, setSubmit] = useState(false);
    const modalSize = useBreakpointValue({ base: "full", md: "xl" });
    const toast = useToast();
    const toastId = 'withdraw-toast';

    const isAmountError = amount > accountBalance || amount <= 0;

    const handleSubmit = () => {
        setSubmit(true);
        if (amount > accountBalance || amount <= 0) {
            return;
        }

        SET.methods.withdrawTokens(window.ethereum.selectedAddress, amount).send({ from: window.ethereum.selectedAddress })
            .then((res) => {
                console.log(res);
                toast({
                    id: toastId,
                    title: "Withdraw successful",
                    description: `Withdrew ${amount} SET`,
                    status: "success",
                    duration: 9000,
                    isClosable: true,
                })
            })
            .catch((err) => {
                console.log(err);
                toast({
                    id: toastId,
                    title: "Withdraw failed",
                    description: `Failed to withdraw ${amount} SET`,
                    status: "error",
                    duration: 9000,
                    isClosable: true,
                })
            })
    }



    return (
        <>
            <Box onClick={onOpen}>{children}</Box>

            <Modal isOpen={isOpen} onClose={onClose} size={modalSize}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Withdraw SET</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody mt={10}>
                        <FormControl isInvalid={submit && isAmountError} mb={10}>
                            <FormLabel>Amount</FormLabel>
                            <Input
                                variant='filled'
                                placeholder='Amount to withdraw to metamask'
                                _focus={{ borderColor: 'none' }}
                                type='number'
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                min={1}
                                max={accountBalance}
                            />
                            {!(submit && isAmountError) ? (
                                <FormHelperText ml={2}>
                                    Available balance: {accountBalance} SET
                                </FormHelperText>
                            ) : (
                                amount > accountBalance ? (
                                    <FormErrorMessage>
                                        Amount cannot be greater than your account balance.
                                    </FormErrorMessage>
                                ) : (
                                    <FormErrorMessage>
                                        Amount cannot be less than or equal to 0.
                                    </FormErrorMessage>
                                )
                            )}
                        </FormControl>

                        <Button
                            variant='solid'
                            size='md'
                            w='100%'
                            mb={10}
                            onClick={handleSubmit}
                        >
                            Withdraw
                        </Button>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    )
}

export default WithdrawModal