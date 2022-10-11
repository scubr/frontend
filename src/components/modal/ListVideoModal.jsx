import React, { useState } from 'react';
import {
    useDisclosure,
    Button,
    HStack,
    Text,
    VStack,
    Box,
    Heading,
    Input,
    FormControl,
    FormLabel,
    FormHelperText,
    FormErrorMessage,
    useToast
} from "@chakra-ui/react"
import { FaChevronLeft } from 'react-icons/fa';
import ModalFrame from '../basic/ModalFrame';
import { AiOutlineInfoCircle } from 'react-icons/ai';
import SVT from '../../contracts/SVT';
import web3 from '../../contracts/web3';
import TxToast from '../TxToast';

const ListVideoModal = ({
    children,
    setIsVideoListed
}) => {

    const { isOpen, onOpen, onClose } = useDisclosure();
    const [price, setPrice] = useState(null);
    const [submit, setSubmit] = useState(false);
    const toast = useToast();
    const toastId = 'list-toast';

    const isPriceError = price <= 0 || price === '';


    const handleSubmit = () => {
        setSubmit(true);
        if (price <= 0 || price === '') {
            return;
        }

        const priceInWei = web3.utils.toWei(price.toString(), 'ether');

        SVT.methods.listToken(0, priceInWei).send({ from: window.ethereum.selectedAddress })
            .then((res) => {
                console.log(res);
                setIsVideoListed(true);
                toast({
                    id: toastId,
                    position: 'top-right',
                    render: () => (
                        <TxToast title="Listing successful" transactionHash={res.transactionHash} />
                    ),
                    duration: 5000,
                })
            })
            .catch((err) => {
                console.log(err);
                toast({
                    id: toastId,
                    title: "Listing failed",
                    description: err.message,
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                })
            })
    }


    const content = () => (
        <>
            <FormControl isInvalid={submit && isPriceError} mt={10} mb={2}>
                <FormLabel>Price</FormLabel>
                <Input
                    variant='filled'
                    placeholder='Enter price in SET'
                    _focus={{ borderColor: 'none' }}
                    type='number'
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    min={1}
                />
                {!(submit && isPriceError) ? (
                    <FormHelperText ml={2}>
                        <HStack justify={"space-between"}>
                            <Text>{price && `$ ${price}`}</Text>
                            <HStack spacing={1}>
                                <Text>$ 1 = 1 SET</Text>
                                <AiOutlineInfoCircle />
                            </HStack>
                        </HStack>
                    </FormHelperText>
                ) : (
                    <FormErrorMessage>
                        Please enter a valid price
                    </FormErrorMessage>
                )}
            </FormControl>

            <Button
                variant='solid'
                size='md'
                w='100%'
                mt={10}
                mb={6}
                onClick={handleSubmit}
            >
                List
            </Button>
        </>
    );


    return (
        <>
            <ModalFrame
                isOpen={isOpen}
                onClose={onClose}
                Button={() => (<Box onClick={onOpen}>{children}</Box>)}
                modalContentFunc={() => content()}
                modalHeaderFunc={() => (
                    <VStack align={"start"} spacing={6}>
                        <Heading size="md">List Video</Heading>
                    </VStack>
                )}
                drawerContentFunc={() => (
                    <>
                        <Box px={6}>
                            {content()}
                        </Box>
                    </>
                )}
                drawerHeaderFunc={() => (
                    <HStack spacing={6}>
                        <FaChevronLeft onClick={onClose} cursor="pointer" />
                        <Heading size="md">List Video</Heading>
                    </HStack>
                )}
            />

        </>
    )
}

export default ListVideoModal

