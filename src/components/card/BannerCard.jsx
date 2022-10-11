import { Heading, Text, VStack } from '@chakra-ui/react'
import React from 'react'

const BannerCard = () => {
    return (
        <VStack
            h="30vh"
            align={"start"}
            justify={"center"}
            bgGradient='linear(to-l, #7928CA, #FF0080)'
            w="100%"
            mb={8}
            rounded="md"
            p={20}
        >
            <Heading color="whiteAlpha.600">
                Earn SET by engaging more with the
            </Heading>
            <Text
                color="white"
                fontSize='6xl'
                fontWeight='extrabold'
            >
                Scubr community
            </Text>
        </VStack>
    )
}

export default BannerCard