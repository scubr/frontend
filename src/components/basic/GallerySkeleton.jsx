import React from 'react';
import { Skeleton, SimpleGrid, AspectRatio } from '@chakra-ui/react'

const GallerySkeleton = () => {
    return (
        <>
            {/* loop through 6 times and return a skeleton */}
            <SimpleGrid minChildWidth='25vw' spacing={{ base: '1px', md: '4px' }}>
                {Array.from(Array(6).keys()).map((i) => (
                    <AspectRatio minW="25vw" ratio={16 / 9} key={i}>
                        <Skeleton
                            height="100%"
                            width="100%"
                            mb="4"
                        />
                    </AspectRatio>
                ))}
            </SimpleGrid>
        </>
    )
}

export default GallerySkeleton