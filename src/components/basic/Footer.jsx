import { VStack, Link, Text, Flex, useColorModeValue } from '@chakra-ui/react'
import React from 'react'

const Footer = ({ w = "100%" }) => {

    const color = useColorModeValue("gray.600", "gray.500")


    return (
        <VStack
            fontSize={{ base: "xs", md: "sm" }}
            align={{ base: "start", sm: "center" }}
            px={6}
            w={w}
            color={color}
        >
            <Flex flexWrap="wrap">
                <Link mr={4}>Terms of Service</Link>
                <Link mr={4}>Privacy Policy</Link>
                <Link
                    mr={4}
                    href="https://scubr-litepaper.tiiny.site/"
                    isExternal
                >Whitepaper</Link>
                <Link mr={4}>Contact Us</Link>
            </Flex>
            <Text>@2022 Scubr</Text>
        </VStack>
    )
}

export default Footer