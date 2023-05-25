import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import { configureChains, createConfig, WagmiConfig } from 'wagmi';
import { polygonMumbai } from 'wagmi/chains';
import { ChakraProvider } from '@chakra-ui/react';
import { BrowserRouter } from 'react-router-dom';
import { AxiosError } from 'axios';
import { QueryClient, QueryClientProvider } from 'react-query';
import { alchemyProvider } from '@wagmi/core/providers/alchemy';
import { mainnet } from '@wagmi/core/chains';

const { publicClient, webSocketPublicClient } = configureChains(
  [mainnet, polygonMumbai],
  [alchemyProvider({ apiKey: import.meta.env.VITE_ALCHEMY_KEY })],
);

const config = createConfig({
  autoConnect: true,
  publicClient,
  webSocketPublicClient,
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount: number, error) => {
        if (error instanceof AxiosError) {
          return (
            (!error?.response?.status || error?.response?.status >= 500) &&
            failureCount <= 3
          );
        }
        return failureCount <= 3;
      },
      // useErrorBoundary: (error) => {
      //   if (error instanceof AxiosError) {
      //     return (
      //       !error?.response?.status ||
      //       error?.response?.status === 404 ||
      //       error?.response?.status >= 500
      //     );
      //   }
      //   return true;
      // },
    },
  },
});

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
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
    </QueryClientProvider>
  </React.StrictMode>,
);
