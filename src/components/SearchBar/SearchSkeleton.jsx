import React from 'react';
import {
    Skeleton,
    AspectRatio,
    HStack,
    SkeletonCircle,
    Box,
    SkeletonText
} from '@chakra-ui/react'

const SearchSkeleton = ({ type }) => {

    if (type === 'accounts') {
        return (
            <Box px={4}>
                {Array.from(Array(3).keys()).map((i) => (
                    <HStack py={2}>
                        <SkeletonCircle size='10' />
                        <Skeleton height='20px' width="100%" />
                    </HStack>
                ))}
            </Box>
        )
    } else {
        return (
            <Box px={4}>
                {Array.from(Array(3).keys()).map((i) => (
                    <HStack py={2} key={i} align="start">
                        <AspectRatio
                            ratio={16 / 9}
                            minW={"10vw"}
                        >
                            <Skeleton />
                        </AspectRatio>
                        <SkeletonText noOfLines={3} height='20px' width="100%" />
                    </HStack>
                ))}
            </Box>
        )
    }
}

export default SearchSkeleton