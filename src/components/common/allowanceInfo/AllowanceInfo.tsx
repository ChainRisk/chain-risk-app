import { Box, Button, Stack, Text } from '@chakra-ui/react';
import { useAccount, useContractRead } from 'wagmi';
import { nftContractAddress } from '../../../utils/nftABI.ts';
import { useState } from 'react';
import { chainLinkABI, chainLinkContractAddress } from '../../../utils/chainLinkABI.ts';
import ChainlinkAllowanceModal from '../chainlinkAllowanceModal/ChainlinkAllowanceModal.tsx';
import { formatEther } from 'viem';

const AllowanceInfo = () => {
  const { address } = useAccount();

  const [showApproveModal, setShowApproveModal] = useState(false);

  const { data: allowance, isLoading: allowanceIsLoading } = useContractRead({
    address: chainLinkContractAddress,
    abi: chainLinkABI,
    functionName: 'allowance',
    watch: true,
    args: [address || '0x000000', nftContractAddress],
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
            Chainlink allowance:{' '}
            {allowanceIsLoading
              ? 'Loading...'
              : `${formatEther(BigInt(allowance || 0))} LINK`}
          </Text>
        </Box>
        <Button size="sm" variant="solid" onClick={() => setShowApproveModal(true)}>
          Change allowance
        </Button>
      </Stack>
      <ChainlinkAllowanceModal
        isOpen={showApproveModal}
        onClose={() => setShowApproveModal(false)}
      />
    </>
  );
};

export default AllowanceInfo;
