import { Box, Button, Stack, Text, useToast } from '@chakra-ui/react';
import { useAccount, useContractRead, useContractWrite } from 'wagmi';
import { myTokenABI } from '../../../utils/myTokenABI.ts';

const BalanceInfo = () => {
  const { address } = useAccount();
  const toast = useToast();

  const { data: symbol, isLoading: symbolLoading } = useContractRead({
    address: '0xFa315Ca811F341e05fdb83A62D8B4DEBA98dbf62',
    abi: myTokenABI,
    functionName: 'symbol',
    watch: true,
  });

  const { data: name, isLoading: nameIsLoading } = useContractRead({
    address: '0xFa315Ca811F341e05fdb83A62D8B4DEBA98dbf62',
    abi: myTokenABI,
    functionName: 'name',
    watch: true,
  });

  const { data: balanceData, isLoading: balanceDataIsLoading } = useContractRead({
    address: '0xFa315Ca811F341e05fdb83A62D8B4DEBA98dbf62',
    abi: myTokenABI,
    functionName: 'balanceOf',
    args: [address],
    watch: true,
  });

  const { isLoading, write } = useContractWrite({
    address: '0xFa315Ca811F341e05fdb83A62D8B4DEBA98dbf62',
    abi: myTokenABI,
    functionName: 'safeMint',
    onSuccess() {
      toast({
        title: 'Success',
        description: `Successfully minted your NFT!`,
        status: 'success',
      });
    },
    onError() {
      toast({
        title: 'Error',
        description: `There was an error minting your NFT.`,
        status: 'error',
      });
    },
  });

  return (
    <>
      <Stack
        direction="row"
        spacing={4}
        rounded="md"
        align="center"
        background="whiteAlpha.900"
        p={4}
        mb={4}
      >
        <Box flex={1}>
          <Text fontSize="lg" fontWeight="bold">
            {nameIsLoading ? 'Loading...' : String(name)}(
            {symbolLoading ? 'Loading...' : String(symbol)})
          </Text>
          <Text color="gray.500" fontSize="sm">
            Ballance: {balanceDataIsLoading ? 'Loading...' : Number(balanceData)}{' '}
          </Text>
        </Box>
        <Button
          variant="solid"
          colorScheme="blue"
          isLoading={isLoading}
          onClick={() =>
            write({
              args: [address, 'spacebear_1.json'],
            })
          }
        >
          Mint the NFT
        </Button>
      </Stack>
    </>
  );
};

export default BalanceInfo;
