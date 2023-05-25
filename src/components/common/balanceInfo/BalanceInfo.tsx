import { Box, Button, Stack, Text } from '@chakra-ui/react';
import { useContractRead } from 'wagmi';
import { nftContractAddress } from '../../../utils/nftABI.ts';
import { useState } from 'react';
import TransferModal from '../transferModal/TransferModal.tsx';
import { chainLinkABI, chainLinkContractAddress } from '../../../utils/chainLinkABI.ts';
import { formatEther } from 'viem';

const BalanceInfo = () => {
  const [showTransferModal, setShowTransferModal] = useState(false);

  const { data: balance, isLoading: balanceIsLoading } = useContractRead({
    address: chainLinkContractAddress,
    abi: chainLinkABI,
    functionName: 'balanceOf',
    watch: true,
    args: [nftContractAddress],
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
          <Text colorScheme="gray" fontSize="sm">
            Total NFT contact balance:{' '}
            {balanceIsLoading
              ? 'Loading...'
              : `${formatEther(BigInt(balance || 0))} LINK`}
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
