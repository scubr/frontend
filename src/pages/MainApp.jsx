import { Outlet } from 'react-router-dom';
import { Box } from '@chakra-ui/layout';
import NavBar from "../components/Navbar.jsx";

const MainApp = (props) => {

  return (
    <>
      <NavBar userData={{ ...props }} />
      <Box w="100%" h="100vh">
        <Outlet />
      </Box>
    </>
  );
};

export default MainApp;
