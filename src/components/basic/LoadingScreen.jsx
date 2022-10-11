import React from 'react'
import {
    Spinner,
    Flex,
    Box
} from '@chakra-ui/react';
import Footer from './Footer';

function LoadingScreen({ size = 'md' }) {
    return (
        <Flex w="100%" h="100%" align="center" justify="center" pos={"relative"}>
            <Spinner size={size} />
            <Box
                pos="absolute"
                left={"50%"}
                transform="translateX(-50%)"
                bottom={6}
                zIndex={40}
                w="100%"
            >
                <Footer />
            </Box>
        </Flex>
    )
}

export default LoadingScreen
