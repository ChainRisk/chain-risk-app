import { Button, Flex, Heading, Stack, Text, useColorModeValue } from '@chakra-ui/react';
import { useConnect } from 'wagmi';

export const Connect = () => {
  const { connect, connectors, error, isLoading, pendingConnector } = useConnect();

  return (
    <Flex
      minH={'100vh'}
      align={'center'}
      justify={'center'}
      bg={useColorModeValue('gray.50', 'gray.800')}
    >
      <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
        <Stack align={'center'}>
          <Heading fontSize={'4xl'}>Connect to your wallet 🚀</Heading>
        </Stack>

        <Stack spacing={3}>
          {connectors.map((connector) => (
            <Button
              bg={'gray.500'}
              color={'white'}
              _hover={{
                bg: 'gray.600',
              }}
              disabled={!connector.ready}
              key={connector.id}
              onClick={() => connect({ connector })}
              isLoading={isLoading && connector.id === pendingConnector?.id}
            >
              {connector.name}
              {!connector.ready && ' (unsupported)'}
            </Button>
          ))}

          {error && (
            <Text color={'red.500'}>
              Something went wrong. Try to connect again or use another wallet.
            </Text>
          )}
        </Stack>
      </Stack>
    </Flex>
  );
};
