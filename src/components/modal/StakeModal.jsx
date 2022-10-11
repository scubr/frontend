import React, { useState } from 'react';
import {
    useDisclosure,
    useBreakpointValue,
    Button,
    HStack,
    Text,
    VStack,
    Box,
    useColorModeValue,
    Heading,
    Select,
    Flex,
    Input,
    FormControl,
    FormLabel,
    FormHelperText,
    FormErrorMessage,
    useToast,
} from "@chakra-ui/react"
import { FaChevronLeft } from 'react-icons/fa';
import ModalFrame from '../basic/ModalFrame';
import { AiFillLock, AiOutlineInfoCircle } from 'react-icons/ai';
import SET from '../../contracts/SET';
import TxToast from '../TxToast';

const StakeModal = ({
    children,
    accountBalance
}) => {

    const { isOpen, onOpen, onClose } = useDisclosure();
    const ButtonSize = useBreakpointValue({ base: "sm", md: "md" });
    const secondaryBg = useColorModeValue("gray.100", "gray.800");
    const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
    const [amount, setAmount] = useState(null);
    const [period, setPeriod] = useState('0');
    const [submit, setSubmit] = useState(false);
    const toast = useToast();
    const toastId = 'stake-toast';

    const isAmountError = amount > accountBalance || amount <= 99;
    const isPeriodError = period === '0' || period === '';


    const handleSubmit = () => {
        setSubmit(true);
        if (amount > accountBalance || amount <= 99) {
            return;
        }
        if (period === '0' || period === '') {
            return;
        }

        // convert amount from eth to wei
        const amountInWei = SET.utils.toWei(amount.toString(), 'ether');

        SET.methods.stakeTokens(amountInWei, period).send({ from: window.ethereum.selectedAddress })
            .then((res) => {
                console.log(res);
                toast({
                    id: toastId,
                    position: 'top-right',
                    render: () => (
                        <TxToast title="Stake successful" transactionHash={res.transactionHash} />
                    ),
                    duration: 5000,
                })
            })
            .catch((err) => {
                console.log(err);
                toast({
                    id: toastId,
                    title: "Stake failed",
                    description: err.message,
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                })
            })
    }

    let reward = 0;

    if (period === '6') {
        reward = amount * 2 / 100;
    } else if (period === '12') {
        reward = amount * 4 / 100;
    } else if (period === '24') {
        reward = amount * 8 / 100;
    }


    const content = () => (
        <>
            <FormControl isInvalid={submit && isAmountError} mt={10} mb={2}>
                <FormLabel>Amount</FormLabel>
                <Input
                    variant='filled'
                    placeholder='Enter staking amount in SET'
                    _focus={{ borderColor: 'none' }}
                    type='number'
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    min={99}
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
                            Minimum staking amount is 100 SET.
                        </FormErrorMessage>
                    )
                )}
            </FormControl>
            <FormControl isInvalid={submit && isPeriodError} mt={10} mb={2}>
                <FormLabel>Period</FormLabel>
                <Select
                    placeholder='Select Staking Period'
                    variant={"filled"}
                    _focus={{ boxShadow: "none" }}
                    value={period}
                    onChange={(e) => setPeriod(e.target.value)}

                >
                    <option value={6}>6 months</option>
                    <option value={12}>12 months</option>
                    <option value={24}>24 months</option>
                </Select>
                {submit && isPeriodError && (
                    <FormErrorMessage>
                        Please select a staking period.
                    </FormErrorMessage>
                )}
            </FormControl>


            <HStack mt={8} mb={3} visibility={(!isAmountError && !isPeriodError) ? 'visible' : 'hidden'}>
                <AiOutlineInfoCircle />
                <Text fontSize={"xs"}>
                    You will receive {reward} SET as a reward for staking {amount} SET for {period} months.
                </Text>
            </HStack>

            <Button
                variant='solid'
                size='md'
                w='100%'
                mb={10}
                onClick={handleSubmit}
            >
                Stake
            </Button>
        </>
    );

    const Transaction = () => {
        return (
            <>
                <Flex mt="4">
                    <Box
                        maxH="42vh"
                        w="100%"
                    >
                        <HStack spacing={4} my={4} justify="space-between">
                            <VStack align={"start"} spacing={0}>
                                <Heading fontSize={"xl"}>210 SET</Heading>
                                <Text color="gray.500" fontSize={"sm"}>6 months - ends in 24 Aug 2014</Text>
                            </VStack>
                            <Button
                                px={6}
                                rounded={'full'}
                                _focus={{
                                    outline: 'none'
                                }}
                                size={ButtonSize}
                                fontSize={"sm"}
                            >
                                Withdraw
                            </Button>
                        </HStack>
                    </Box>
                </Flex>
            </>
        )
    }




    return (
        <>
            <ModalFrame
                isOpen={isOpen}
                onClose={onClose}
                Button={() => (<Box onClick={onOpen}>{children}</Box>)}
                modalContentFunc={() => (
                    <>
                        {content()}
                        <Box
                            bg={secondaryBg}
                            mb="2"
                            py={4}
                            px={6}
                            borderRadius="md"
                            maxH="36vh"
                            overflow={"scroll"}
                            className={isMac ? "" : "hide-scrollbars"}
                        >
                            <Heading size="md" my="2">Recent Staking</Heading>
                            <Transaction />
                            <Transaction />
                            <Transaction />
                            <Transaction />
                        </Box>
                    </>
                )}
                modalHeaderFunc={() => (
                    <VStack align={"start"} spacing={6}>
                        <HStack>
                            <AiFillLock fontSize={24} />
                            <Heading size="md">Stake</Heading>
                        </HStack>
                    </VStack>
                )}
                drawerContentFunc={() => (
                    <>
                        <Box px={6}>
                            {content()}
                        </Box>
                        <Box bg={secondaryBg} mb="2" py={4} px={6}>
                            <Heading size="md" my="2">Recent Staking</Heading>
                            <Transaction />
                        </Box>
                    </>
                )}
                drawerHeaderFunc={() => (
                    <HStack spacing={6}>
                        <FaChevronLeft onClick={onClose} cursor="pointer" />
                        <Heading size="md">Stake</Heading>
                    </HStack>
                )}
            />

        </>
    )
}

export default StakeModal

