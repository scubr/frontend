import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { ChakraProvider, ColorModeScript, extendTheme } from '@chakra-ui/react';
import { mode } from '@chakra-ui/theme-tools';
import App from './App';
import ScrollToTop from './helper/scrollToTop';

const config = {
  initialColorMode: 'light',
  useSystemColorMode: true,
}

const styles = {
  global: props => ({
    body: {
      bg: mode('white', 'black')(props),
    },
  }),
};

const theme = extendTheme({ config, styles })

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <ChakraProvider theme={theme}>
        <ColorModeScript />
        <ScrollToTop />
        <App />
      </ChakraProvider>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);
