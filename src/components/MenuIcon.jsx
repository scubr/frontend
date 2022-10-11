import { useNavigate } from 'react-router-dom';
import { IconButton } from '@chakra-ui/button';
import { useLocation } from 'react-router';

const MenuIcon = ({ name, icon }) => {

  const navigate = useNavigate();
  const location = useLocation();
  const url = location.pathname;
  const formattedUrl = url === '/' ? 'home' : url.slice(1);

  const handleClick = () => {
    navigate(`/${name}`);
  };

  return (
    <IconButton
      size="md"
      icon={icon}
      _focus={{}}
      onClick={handleClick}
      variant={name === formattedUrl ? null : "ghost"}

    />
  )

};

export default MenuIcon;
