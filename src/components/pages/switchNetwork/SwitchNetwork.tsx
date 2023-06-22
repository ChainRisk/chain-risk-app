import { Button, Container, Heading, Text } from '@chakra-ui/react';
import { polygonMumbai } from 'wagmi/chains';
import { useSwitchNetwork } from 'wagmi';
import { ReactComponent as Logo } from '../../../assets/Logo.svg';

const SwitchNetwork = () => {
  const { isLoading, pendingChainId, switchNetwork } = useSwitchNetwork();

  return (
    <Container pt={24} maxW="2xl">
      <Heading fontSize={'4xl'} display={'flex'} alignItems={'center'} gap={3} mb={8}>
        <Logo height={40} width={40} />
        ChainRisk
      </Heading>

      <Text fontSize="3xl" fontWeight="bold">
        You are on the wrong network
      </Text>
      <Text color="gray.600" fontSize="lg">
        Please switch to <b>Polygon Mumbai</b> using the button below or change the
        network in your wallet to continue.
      </Text>
      <Button
        colorScheme="blue"
        mt={6}
        disabled={!switchNetwork}
        onClick={() => switchNetwork?.(polygonMumbai.id)}
        isLoading={isLoading && pendingChainId === polygonMumbai.id}
      >
        Switch to Polygon Mumbai
      </Button>
    </Container>
  );
};

export default SwitchNetwork;
