import React from 'react'
import {
    Heading,
    Image,
    VStack
} from '@chakra-ui/react';
import EmptyBox from "../../assets/empty-box.png";

function CenteredMessage({ children }) {
    return (
        <VStack spacing="4" w="100%" h="100%" mt={5}>
            <Image src={EmptyBox} boxSize="100px" />
            <Heading fontSize="24">{children}</Heading>
        </VStack>
    )
}

export default CenteredMessage
