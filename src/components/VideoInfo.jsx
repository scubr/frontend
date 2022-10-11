import React from 'react'
import {
    Flex,
    Text,
    Circle,
    useColorModeValue,
    useBreakpointValue
} from '@chakra-ui/react';


function VideoInfo({
    children,
    onClick,
    text,
}) {

    const textSize = useBreakpointValue({ base: "10", md: "sm", lg: "md" });
    const inVideoBG = useColorModeValue("whiteAlpha.700", "blackAlpha.700");
    const outVideoBG = useColorModeValue("gray.100", "gray.900");
    const paddingCircle = useBreakpointValue({ base: "2", md: "4" });


    return (
        <Flex direction="column" my={2} align="center">
            <Circle p={paddingCircle} bg={useBreakpointValue({ base: inVideoBG, xl: outVideoBG })} color={useColorModeValue('black', 'gray.50')} _hover={{ bg: useColorModeValue('gray.200', 'gray.800') }} cursor="pointer" onClick={onClick}>
                {children}
            </Circle>
            {text && <Text fontSize={textSize} fontWeight="500" mt="1">{text}</Text>}
        </Flex>
    )
}

export default VideoInfo
