import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import { configureChains, createConfig, WagmiConfig } from 'wagmi';
import { ChakraProvider } from '@chakra-ui/react';
import { localhost } from 'wagmi/chains';
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc';
import { BrowserRouter } from 'react-router-dom';
import { AxiosError } from 'axios';
import { QueryClient, QueryClientProvider } from 'react-query';

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
