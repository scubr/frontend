import React from 'react'
import {
    HStack,
    Text,
    VStack,
    Box,
    Heading,
    Link
} from "@chakra-ui/react"
import { AiFillCheckCircle } from 'react-icons/ai';

const TxToast = ({ title, transactionHash }) => {
    return (
        <Box
            p={3}
            bg="green.500"
            borderRadius="md"
            boxShadow="md"
        >
            <HStack align={"start"}>
                <AiFillCheckCircle size={22} />
                <VStack spacing={1} align="start">
                    <Heading fontSize={"lg"}>{title}</Heading>
                    <Text color="white">View transaction on <Link
                        href={`${process.env.REACT_APP_CSC_EXPLORER_URL}${transactionHash}`}
                        isExternal
                        textDecoration={"underline"}
                    >Coinex Explorer</Link></Text>
                </VStack>
            </HStack>
        </Box>
    )
}

export default TxToast