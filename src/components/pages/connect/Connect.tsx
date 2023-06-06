import {
  Box,
  Button,
  Flex,
  Heading,
  SimpleGrid,
  Stack,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import { useConnect } from 'wagmi';
import { ReactComponent as Logo } from '../../../assets/Logo.svg';

export const Connect = () => {
  const { connect, connectors, error, isLoading, pendingConnector } = useConnect();

  return (
    <Flex
      minH={'100vh'}
      align={'center'}
      justify={'center'}
      bg={useColorModeValue('gray.50', 'gray.800')}
    >
      <Box
        mx={'auto'}
        maxW={860}
        py={12}
        px={6}
        display={'flex'}
        flexDirection={'column'}
        alignItems={'flex-start'}
        justifyContent={'center'}
      >
        <Stack mb={6}>
          <Heading fontSize={'4xl'} display={'flex'} alignItems={'center'} gap={3} mb={4}>
            <Logo height={40} width={40} />
            ChainRisk
          </Heading>
          <Text fontSize={'lg'} color={'gray.600'}>
            <Text mb={3}>Welcome to a new era of financial empowerment.</Text>
            <Text mb={3}>
              ChainRisk unique dynamic NFT takes your credit score to the next level by
              securely storing ratings from multiple agencies on the blockchain, providing
              a unique risk identity.
            </Text>
            <Text mb={3}>
              Experience unrivaled on-chain perks and tailor-made borrowing rates that
              truly reflect your financial credibility. Your future starts here, with a
              credit score that unlocks more than ever before.
            </Text>
            <Text>Get ready to reimagine your financial journey!</Text>
          </Text>
        </Stack>

        <Stack spacing={3} width={'100%'} mb={6}>
          <Text fontSize={'lg'} color={'gray.600'} fontWeight={'bold'} mb={2}>
            Connect your wallet to get started:
          </Text>
          <SimpleGrid columns={{ base: 1, md: 3, lg: 4 }} spacing={3}>
            {connectors.map((connector) => (
              <Button
                bg={'gray.200'}
                color="gray.700"
                _hover={{
                  bg: 'gray.300',
                }}
                // colorScheme={'blue'}
                variant="solid"
                disabled={!connector.ready}
                key={connector.id}
                onClick={() => connect({ connector })}
                isLoading={isLoading && connector.id === pendingConnector?.id}
              >
                {connector.name}
                {!connector.ready && ' (unsupported)'}
              </Button>
            ))}
          </SimpleGrid>

          {error && (
            <Text color={'red.500'}>
              Something went wrong. Try to connect again or use another wallet.
            </Text>
          )}
        </Stack>
      </Box>
    </Flex>
  );
};
