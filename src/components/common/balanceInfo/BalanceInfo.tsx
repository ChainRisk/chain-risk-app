import { Box, Button, Stack, Text } from '@chakra-ui/react';
import { useAccount, useContractRead } from 'wagmi';
import { nftABI, nftContractAddress } from '../../../utils/nftABI.ts';
import { useState } from 'react';
import TransferModal from '../transferModal/TransferModal.tsx';
import { formatEther } from 'viem';

const BalanceInfo = () => {
  const { address } = useAccount();

  const [showTransferModal, setShowTransferModal] = useState(false);

  const { data: balance, isLoading: balanceIsLoading } = useContractRead({
    address: nftContractAddress,
    abi: nftABI,
    functionName: 'getLinkBalance',
    watch: true,
    args: [address || '0x000000'],
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
      >
        <Box flex={1}>
          <Text colorScheme="gray" fontSize="sm">
            LINK balance:{' '}
            {balanceIsLoading
              ? 'Loading...'
              : `${
                  Math.round(parseFloat(formatEther(BigInt(balance || 0))) * 100) / 100
                } LINK`}
          </Text>
        </Box>
        <Button size="sm" variant="solid" onClick={() => setShowTransferModal(true)}>
          Transfer
        </Button>
      </Stack>
      <TransferModal
        isOpen={showTransferModal}
        onClose={() => setShowTransferModal(false)}
      />
    </>
  );
};

export default BalanceInfo;
