import {
  Flex,
  Heading,
  useBreakpointValue
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {

  const navigate = useNavigate();

  const HeadingSize = useBreakpointValue({ base: 'xl', md: '2xl', lg: '4xl' });
  const TextSize = useBreakpointValue({ base: 'sm', md: 'md', lg: 'lg' });

  return (
    <Flex align="center" justify="center" h="100vh" direction="column">
      <Heading
        color="gray.500"
        size={TextSize}
      >Sorry, this page isn't available.
      </Heading>
      <Heading
        mt="2"
        size={HeadingSize}
        onClick={() => navigate('/')}
        cursor="pointer"
        _hover={{ color: 'blue.700' }}
      >Head back to Scubr
      </Heading>
    </Flex>
  )
};

export default NotFound;
