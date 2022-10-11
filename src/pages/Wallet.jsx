import { Flex, useBreakpointValue, useColorModeValue, Box, VStack, Text, Heading, HStack } from '@chakra-ui/react'
import React, { useState, useEffect } from 'react'
import WalletCard from '../components/card/WalletCard';
import WalletTransactions from '../components/WalletTransactions';
import BannerCard from '../components/card/BannerCard';
import { AiFillLock } from 'react-icons/ai'
import Footer from '../components/basic/Footer';
import StakeModal from '../components/modal/StakeModal';
import SET from '../contracts/SET';

const Wallet = () => {


  const hideBelowLg = useBreakpointValue({ base: 'none', xl: 'flex' });
  const hideAboveLg = useBreakpointValue({ base: 'flex', xl: 'none' });
  const walletType = useBreakpointValue({ base: "compact", md: "wide" });
  const mobileSize = useBreakpointValue({ base: true, md: false });
  const [accountBalance, setAccountBalance] = useState(0);
  const [scubrBalance, setScubrBalance] = useState(372);

  useEffect(() => {

    const getBalance = async () => {
      const address = window.ethereum.selectedAddress;
      let balance = await SET.methods.balanceOf(address).call();
      balance = balance / 10 ** 18;
      setAccountBalance(balance);
    }

    getBalance();
  }, []);


  return (
    <Flex
      minH="100vh"
      paddingX={{ base: '4%', lg: "2%", '2xl': '8%' }}
      pt="8vh"
    >

      <Flex
        flex="auto"
        mt={10}
        direction="column"
      >
        <Box display={hideAboveLg}>
          <WalletCard
            scubrBalance={scubrBalance}
            accountBalance={accountBalance}
            type={walletType}
            mobileSize={mobileSize}
          />
        </Box>
        <Box
          display={hideBelowLg}
        >
          <BannerCard />
        </Box>
        <WalletTransactions />
        <Box pt={20} pb={8}>
          <Footer
            w="auto"
          />
        </Box>
      </Flex>



      <Box
        display={hideBelowLg}
        mt={10}
        ml={8}
        w="380px"
      >
        <Flex
          direction="column"
          pos="fixed"
        >
          <WalletCard
            scubrBalance={scubrBalance}
            accountBalance={accountBalance}
            mobileSize={mobileSize}
          />
          <BannerSmall accountBalance={accountBalance} />
        </Flex>
      </Box>

    </Flex>
  )
}



const BannerSmall = ({ accountBalance }) => {
  return (
    <VStack
      h="31vh"
      align={"start"}
      justify={"center"}
      bg={useColorModeValue("blackAlpha.200", "whiteAlpha.200")}
      rounded="md"
      p={10}
      mt="8"
      w="100%"
    >
      <StakeModal accountBalance={accountBalance}>
        <HStack
          cursor={"pointer"}
          spacing={1}
        >
          <Heading
            bgClip='text'
            size="2xl"
            bgGradient='linear(to-l, #7928CA, #FF0080)'
          >
            Stake
          </Heading>
          <AiFillLock fontSize={"34"} color='#7928CA' />
        </HStack>
      </StakeModal>
      <Text
        color={useColorModeValue("gray.600", "gray.400")}
        fontSize="lg"
        fontWeight={"medium"}
      >
        Stake our native token to <br /> earn rewards
      </Text>
    </VStack>
  )
}


export default Wallet