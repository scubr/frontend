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
import TxToast from '../TxToast';
import web3 from '../../contracts/web3';

const SendTokenModal = ({
    children,
    currentWallet,
    accountBalance
}) => {

    const { isOpen, onOpen, onClose } = useDisclosure();
    const [amount, setAmount] = useState(null);
    const [toAddress, setToAddress] = useState('');
    const [submit, setSubmit] = useState(false);
    const modalSize = useBreakpointValue({ base: "full", md: "xl" });
    const toast = useToast();
    const toastId = 'send-toast';

    const isAmountError = amount > accountBalance || amount <= 0;
    const isAddressError = toAddress === '';

    const handleSubmit = () => {
        setSubmit(true);
        if (amount > accountBalance || amount <= 0) {
            return;
        }

        if (toAddress === '') {
            return;
        }

        if (currentWallet === 'scubr') {
            return;
        } else {

            const sendTransaction = async () => {

                // convert amount from eth to wei
                const amountInWei = web3.utils.toWei(amount.toString(), 'ether');

                const res = SET.methods.transfer(toAddress, amountInWei).send({ from: window.ethereum.selectedAddress });
                onClose();

                // wait for user to confirm transaction in metamask
                const receipt = await res;
                toast({
                    id: toastId,
                    position: 'top-right',
                    render: () => (
                        <TxToast title="Transfer successful" transactionHash={receipt.transactionHash} />
                    ),
                    duration: 5000,
                })

            }

            try {
                sendTransaction();
            }
            catch (err) {
                console.log(err);
                toast({
                    id: toastId,
                    title: "Transfer failed",
                    description: `Something went wrong`,
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                });
            }
        }
    }



    return (
        <>
            <Box onClick={onOpen}>{children}</Box>

            <Modal isOpen={isOpen} onClose={onClose} size={modalSize}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Send SET</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody mt={10}>
                        <FormControl isInvalid={submit && isAmountError} mb={2}>
                            <FormLabel>Amount</FormLabel>
                            <Input
                                variant='filled'
                                placeholder='Amount to send'
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

                        <FormControl isInvalid={submit && isAddressError} my={10}>
                            <FormLabel>To Address</FormLabel>
                            <Input
                                placeholder='To whom you want to send SET?'
                                variant={"filled"}
                                _focus={{ borderColor: "none" }}
                                value={toAddress}
                                onChange={(e) => setToAddress(e.target.value)}
                            />
                            {submit && isAddressError && (
                                <FormErrorMessage>
                                    Please enter a valid address.
                                </FormErrorMessage>
                            )}
                        </FormControl>

                        <Button
                            variant='solid'
                            size='md'
                            w='100%'
                            mb={10}
                            onClick={handleSubmit}
                        >
                            Send
                        </Button>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    )
}

export default SendTokenModal