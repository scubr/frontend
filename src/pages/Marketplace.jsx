import React, { useEffect, useState, useContext } from 'react'
import {
  Tabs,
  TabList,
  Tab,
  Flex,
  Grid,
  useBreakpointValue,
  useColorModeValue,
  Box
} from '@chakra-ui/react';
import Footer from '../components/basic/Footer';


import MarketplaceVideoCard from '../components/card/MarketplaceVideoCard';
import SVT from '../contracts/SVT';
import axios from 'axios';
import { userContext } from '../userContext';
import { getAllOwnedVideos } from '../services/accountService';
import LoadingScreen from '../components/basic/LoadingScreen';
import { getAllVideos } from '../services/videoService';

function Marketplace() {

  const [tabIndex, setTabIndex] = useState(0);
  const itemPerRow = useBreakpointValue({ sm: 1, md: 2, lg: 2, xl: 3, xxl: 4 });
  const selectedBg = useColorModeValue("black", "gray.50");
  const selectedText = useColorModeValue("white", "black");
  const bg = useColorModeValue("#EDECEC", "gray.900");
  const [marketplaceVideos, setMarketplaceVideos] = useState([]);
  const { currentUserData } = useContext(userContext);
  const [loading, setLoading] = useState(true);
  const [marketplaceLoading, setMarketplaceLoading] = useState(true);
  const [userOwnedVideos, setUserOwnedVideos] = useState([]);


  //get user owned video
  useEffect(() => {

    if (!currentUserData) return;

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

    getUserOwnedVideos(currentUserData.account_id);

  }, [currentUserData]);

  useEffect(() => {
    setMarketplaceLoading(true);

    async function fetchFeed() {
      const response = await getAllVideos();
      setMarketplaceLoading(false);
      setMarketplaceVideos(response);
    }

    fetchFeed();

  }, []);

  if (loading || marketplaceLoading) return <LoadingScreen />;






  return (
    <>
      <Flex flex="1" py="12" px={{ base: "4", lg: "6", xl: "12" }} pb="0">

        <Tabs variant="unstyled" onChange={(index) => setTabIndex(index)}>

          <TabList className="alignFixedHorizontalCenter">
            <Tab borderLeftRadius="6" minW={{ base: "150", sm: "160", md: "200" }} bg={bg} _selected={{ color: selectedText, bg: selectedBg }} _focus={{ boxShadow: "none" }}>Discover</Tab>
            <Tab borderRightRadius="6" minW={{ base: "150", sm: "160", md: "200" }} bg={bg} _selected={{ color: selectedText, bg: selectedBg }} _focus={{ boxShadow: "none" }}>Inventory</Tab>
          </TabList>

        </Tabs>

        {tabIndex === 0 && (

          <Grid w="100%" pt="40" pb="40" templateColumns={"repeat(" + itemPerRow + ", 1fr)"} gap={2} rowGap={4}>
            {marketplaceVideos.map(video => <MarketplaceVideoCard title={video.title} name={video.name} video_id={video.video_id} videoUrl={video.video_url} type="buy" />)}
          </Grid>
        )}

        {tabIndex === 1 && (

          <Grid w="100%" pt="40" pb="40" templateColumns={"repeat(" + itemPerRow + ", 1fr)"} gap={2} rowGap={4}>
            {userOwnedVideos.map((video) => (
              <MarketplaceVideoCard video_id={video.video_id} videoUrl={video.video_url} title={video.title} name={video.name} type="manage" />
            ))}
          </Grid>
        )}

      </Flex>
      <Box pb={8}>
        <Footer />
      </Box>
    </>
  )
}

export default Marketplace
