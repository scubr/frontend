import React, { useState, useEffect, useContext } from 'react'
import {
    SimpleGrid, useBreakpointValue
} from '@chakra-ui/react';
import { userContext } from '../../userContext';
import { getAllSavedVideos } from '../../services/accountService';
import CenteredMessage from '../basic/CenteredMessage';
import GalleryCard from '../card/GalleryCard';
import GallerySkeleton from '../basic/GallerySkeleton';

const SavedVideos = () => {

    const { currentUserData } = useContext(userContext);
    const [savedVideos, setSavedVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const gridSpacing = useBreakpointValue({ base: '1px', md: '4px' });




    useEffect(() => {
        setLoading(true);
        getAllSavedVideos(currentUserData.account_id)
            .then(res => {

                setSavedVideos(res);
                setLoading(false);
            })
            .catch(err => {
                setLoading(false);
            })
    }, [currentUserData.account_id]);


    if (loading) return <GallerySkeleton />;

    return (
        <SimpleGrid minChildWidth='25vw' spacing={gridSpacing} >
            {!loading && savedVideos.length === 0 && <CenteredMessage>You have no saved videos</CenteredMessage>}
            {savedVideos && savedVideos.map((video) => {
                return (
                    <GalleryCard
                        key={video.video_id}
                        video_id={video.video_id}
                        url={video.video_url}
                    />
                )
            })}
        </SimpleGrid>
    )
}

export default SavedVideos