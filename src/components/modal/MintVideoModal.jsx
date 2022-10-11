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
import TxToast from '../TxToast';

const MintVideoModal = ({
    children,
    setIsVideoNFT,
    video_id
}) => {

    const { isOpen, onOpen, onClose } = useDisclosure();
    const [royalty, setRoyalty] = useState(8);
    const [submit, setSubmit] = useState(false);
    const toast = useToast();
    const toastId = 'mint-toast';

    const isRoyaltyError = royalty < 0 || royalty === '';


    const handleSubmit = async () => {

        setSubmit(true);
        if (royalty < 0 || royalty === '') {
            return;
        }

        if (royalty > 40) {
            toast({
                id: toastId,
                title: "Royalty too high",
                description: "Royalty must be less than 40%",
                status: "error",
                duration: 5000,
                isClosable: true,
            })
            return;
        }

        try {
            const uri = `https://www.scubr.org/api/tokenURI/${video_id}`;
            var res;
            if (royalty === 8) {
                res = await SVT.methods.mintNFT(window.ethereum.selectedAddress, uri).send({ from: window.ethereum.selectedAddress })
            } else {
                res = await SVT.methods.mint(window.ethereum.selectedAddress, uri, royalty).send({ from: window.ethereum.selectedAddress })
            }
            setIsVideoNFT(true);
            toast({
                id: toastId,
                position: 'top-right',
                render: () => (
                    <TxToast title="Minting successful" transactionHash={res.transactionHash} />
                ),
                duration: 5000,
            })
        }
        catch (err) {
            toast({
                id: toastId,
                title: "Minting failed",
                description: err.message,
                status: "error",
                duration: 5000,
                isClosable: true,
            })
        }

    }


    const content = () => (
        <>
            <FormControl isInvalid={submit && isRoyaltyError} mt={10} mb={2}>
                <FormLabel>Royalty</FormLabel>
                <Input
                    variant='filled'
                    placeholder='Enter royalty in %'
                    _focus={{ borderColor: 'none' }}
                    type='number'
                    value={royalty}
                    onChange={(e) => setRoyalty(e.target.value)}
                    min={0}
                />
                {!(submit && isRoyaltyError) ? (
                    <FormHelperText ml={2}>
                        <HStack spacing={1}>
                            <AiOutlineInfoCircle />
                            <Text fontSize={"xs"}>Royalty is the percentage of the price you will receive when someone buys your video</Text>
                        </HStack>
                    </FormHelperText>
                ) : (
                    <FormErrorMessage>
                        Please enter a valid royalty
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
                Mint
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
                        <Heading size="md">Mint Video</Heading>
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
                        <Heading size="md">Mint Video</Heading>
                    </HStack>
                )}
            />

        </>
    )
}

export default MintVideoModal

