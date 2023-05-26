import { Box, Button, Stack, Text, useToast } from '@chakra-ui/react';
import {
  useAccount,
  useContractRead,
  useContractWrite,
  useWaitForTransaction,
} from 'wagmi';
import { nftContractAddress } from '../../../utils/nftABI.ts';
import { chainLinkABI, chainLinkContractAddress } from '../../../utils/chainLinkABI.ts';
import { formatEther } from 'viem';

const AllowanceInfo = () => {
  const { address } = useAccount();

  const { data: allowance, isLoading: allowanceIsLoading } = useContractRead({
    address: chainLinkContractAddress,
    abi: chainLinkABI,
    functionName: 'allowance',
    watch: true,
    args: [address || '0x000000', nftContractAddress],
  });

  const toast = useToast();

  const { data, write } = useContractWrite({
    address: chainLinkContractAddress,
    abi: chainLinkABI,
    functionName: 'approve',
  });

  const { isLoading } = useWaitForTransaction({
    hash: data?.hash,
    onSuccess() {
      toast({
        title: 'Success',
        description: `Chainlink allowance successfully approved.`,
        status: 'success',
      });
    },
    onError() {
      toast({
        title: 'Error',
        description: `There was an error approving Chainlink allowance.`,
        status: 'error',
      });
    },
  });

  const handleApprove = () => {
    if (address) {
      write({
        args: [nftContractAddress, BigInt(200000000000000000)],
      });
    }
  };

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
            Chainlink allowance:{' '}
            {allowanceIsLoading
              ? 'Loading...'
              : `${
                  Math.round(parseFloat(formatEther(BigInt(allowance || 0))) * 100) / 100
                } LINK`}
          </Text>
        </Box>
        <Button size="sm" variant="solid" isLoading={isLoading} onClick={handleApprove}>
          Change allowance
        </Button>
      </Stack>
    </>
  );
};

export default AllowanceInfo;
