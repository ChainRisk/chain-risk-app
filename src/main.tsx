import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import { configureChains, createConfig, WagmiConfig } from 'wagmi';
import { ChakraProvider } from '@chakra-ui/react';
import { localhost } from 'wagmi/chains';
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc';
import { BrowserRouter } from 'react-router-dom';

const { publicClient, webSocketPublicClient } = configureChains(
  [localhost],
  [
    jsonRpcProvider({
      rpc: () => ({
        http: `http://127.0.0.1:7545`,
      }),
    }),
  ],
);

const config = createConfig({
  autoConnect: true,
  publicClient,
  webSocketPublicClient,
});

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <WagmiConfig config={config}>
      <BrowserRouter>
        <ChakraProvider
          toastOptions={{
            defaultOptions: {
              position: 'bottom-right',
              duration: 5000,
              isClosable: true,
            },
          }}
        >
          <App />
        </ChakraProvider>
      </BrowserRouter>
    </WagmiConfig>
  </React.StrictMode>,
);
