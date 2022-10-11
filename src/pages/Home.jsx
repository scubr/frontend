import React, { useState, useEffect, useRef } from 'react'
import {
  Flex,
  Text,
  useBreakpointValue,
  Button,
} from '@chakra-ui/react';

import HomeVideoCard from '../components/card/HomeVideoCard';
import TextAvatar from '../components/basic/TextAvatar.jsx';
import SmallThumbnailVideo from '../components/card/SmallThumbnailVideo';
import LoadingScreen from '../components/basic/LoadingScreen';
import { useNavigate } from 'react-router-dom';

import { getTopAccountsAndVideos } from '../services/searchService';
import { followAnAccount } from '../services/accountService';
import { getAllVideos } from '../services/videoService';


function Home() {

  const sideTabShow = useBreakpointValue({ base: 'none', xl: 'flex' });
  const [isMuted, setIsMuted] = useState(true);
  const [feed, setFeed] = useState([]);
  const [popularVideos, setpopularVideos] = useState([]);
  const [popularAccounts, setpopularAccounts] = useState([]);
  const [loading, setLoading] = useState(false);
  const mounted = useRef(true);
  const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;

  //fetch popular videos and accounts
  useEffect(() => {
    mounted.current = true;
    if (popularVideos.length > 1 && popularAccounts.length > 1) return;

    async function fetchPopularVideosAndAccounts() {
      const response = await getTopAccountsAndVideos();

      if (mounted.current) {
        setpopularVideos(response.videos.slice(0, 4));
        setpopularAccounts(response.accounts.slice(0, 4));
      }
    }

    fetchPopularVideosAndAccounts();

    return () => {
      mounted.current = false;
    }

  }, [popularAccounts.length, popularVideos.length]);


  // fetch feed
  useEffect(() => {
    setLoading(true);
    if (feed.length > 1) return;

    async function fetchFeed() {
      const response = await getAllVideos();
      setLoading(false);
      if (mounted.current) {
        setFeed(response);
      }
    }

    fetchFeed();

    return () => {
      mounted.current = false;
    }

  }, []);


  if (loading) return <LoadingScreen size='xl' />;

  return (
    <Flex minH="100vh">
      <Flex
        direction={"column"}
        flex="1"
        maxH="100vh"
        overflow={"scroll"}
        className={isMac ? "" : "hide-scrollbars"}
        pt="8vh"
        display={sideTabShow}
      >
        <Flex flex="1" align="center" ml={{ lg: "2vw", "2xl": "8vw" }}>
          <Flex direction="column" position="fixed" overflow="hidden">
            <Text mb="2" fontWeight="bold" color="gray">Popular accounts</Text>
            {popularAccounts.map((account) => {
              return (
                <PopularAccounts
                  key={account.account_id}
                  account_id={account.account_id}
                  name={account.name}
                  image={account.image_url}
                  following={account.following}
                />
              )
            })}
          </Flex>
        </Flex>
        <Flex flex="1.6" ml={{ lg: "2vw", "2xl": "8vw" }}>
          <Flex direction="column" position="fixed">
            <Text mb="2" fontWeight="bold" color="gray">Popular Videos</Text>
            {popularVideos.map((video) => {
              return (
                <SmallThumbnailVideo
                  key={video.video_id}
                  video_id={video.video_id}
                  url={video.video_url}
                  minW="10vw"
                  muted
                  py={1}
                />
              )
            })}
          </Flex>
        </Flex>
      </Flex>

      <Flex flex="3" align="center" justify="center" flexDirection="column">
        {feed.map((video) => {
          return (
            <HomeVideoCard
              key={video.video_id}
              video={video}
              isMuted={isMuted}
              setIsMuted={setIsMuted}
            />
          )
        })}
      </Flex>
    </Flex >
  )
}

export default Home

const PopularAccounts = ({ account_id, name, image, following }) => {

  const [isFollowing, setIsFollowing] = useState(following);
  const navigate = useNavigate();


  const handleFollowButtonClick = async () => {
    setIsFollowing(true);
    try {
      await followAnAccount(account_id);
    } catch (error) {
      setIsFollowing(false);
    }
  }

  return (
    <Flex align="center" cursor="pointer">
      <div onClick={() => navigate(`/profile/${account_id}`)}>
        <TextAvatar mr="3" size="md" my="2" name={name} image={image} />
      </div>
      {!isFollowing && (
        <Button onClick={handleFollowButtonClick} size="xs" colorScheme="teal" variant="outline">
          Follow
        </Button>
      )}
    </Flex>
  )
}
