import React from 'react'
import {
    Flex,
    Avatar,
    Heading
} from '@chakra-ui/react';

function TextAvatar({ name, image, size, ...props }) {


    return (
        <Flex {...props} align="center" cursor="pointer">
            <Avatar bg="gray.300" size={size === "md" ? "sm" : "md"} src={image} />
            <Heading size={size === "lg" ? "lg" : "md"} ml="3">{name}</Heading>
        </Flex>
    )
}

export default TextAvatar


