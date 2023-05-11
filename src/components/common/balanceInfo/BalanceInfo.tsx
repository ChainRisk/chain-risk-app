import { Box, Button, Stack, Text } from '@chakra-ui/react';
import { useAccount, useContractRead } from 'wagmi';
import { myTokenABI } from '../../../utils/myTokenABI.ts';
import { useState } from 'react';
import MintNftModal from '../mintNftModal/MintNftModal.tsx';

const BalanceInfo = () => {
  const { address } = useAccount();

  const [showMinNftModal, setShowMintNftModal] = useState(false);

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
    args: [address || '0x000000'],
    watch: true,
    enabled: !!address,
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
          <Text colorScheme="gray" fontSize="sm">
            Balance: {balanceDataIsLoading ? 'Loading...' : Number(balanceData)}{' '}
          </Text>
        </Box>
        <Button
          variant="solid"
          colorScheme="blue"
          onClick={() => setShowMintNftModal(true)}
        >
          Mint NFT
        </Button>
      </Stack>
      <MintNftModal isOpen={showMinNftModal} onClose={() => setShowMintNftModal(false)} />
    </>
  );
};

export default BalanceInfo;
