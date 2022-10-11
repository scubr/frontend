import React, { useState, useEffect, useContext } from 'react'
import {
    SimpleGrid,
    useBreakpointValue
} from '@chakra-ui/react';
import { userContext } from '../../userContext';
import { getAllOwnedVideos } from '../../services/accountService';
import CenteredMessage from '../basic/CenteredMessage';
import GalleryCard from '../card/GalleryCard';
import { useParams } from 'react-router';
import GallerySkeleton from '../basic/GallerySkeleton';

const CollectedVideos = () => {

    const { currentUserData } = useContext(userContext);
    const gridSpacing = useBreakpointValue({ base: '1px', lg: '4px' });
    const [userOwnedVideos, setUserOwnedVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const params = useParams();
    const ownProfile = (!params.id || currentUserData.account_id === parseInt(params.id)) ? true : false;




    //get user owned video
    useEffect(() => {

        if (!currentUserData) return;
        let id;

        if (ownProfile) {
            id = currentUserData.account_id;
        } else {
            id = params.id;
        }

        const getUserOwnedVideos = async (account_id) => {

            try {
                setLoading(true);
                const response = await getAllOwnedVideos(account_id);
                setUserOwnedVideos(response);
                setLoading(false);
            } catch (error) {
                console.log(error);
            }

        }

        getUserOwnedVideos(id);

    }, [params.id, currentUserData, ownProfile]);

    if (loading) return <GallerySkeleton />;

    return (
        <SimpleGrid minChildWidth='25vw' spacing={gridSpacing}>
            {!loading && userOwnedVideos.length === 0 && <CenteredMessage>No videos owned</CenteredMessage>}
            {userOwnedVideos && userOwnedVideos.map((video) => {
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

export default CollectedVideos