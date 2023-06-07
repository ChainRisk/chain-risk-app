import { Box, Button, Stack, Text, Tooltip } from '@chakra-ui/react';
import { useAccount, useContractRead } from 'wagmi';
import { nftABI, nftContractAddress } from '../../../utils/nftABI.ts';
import { useState } from 'react';
import { formatEther } from 'viem';
import BalanceModal from '../balanceModal/BalanceModal.tsx';
import WithdrawModal from '../withdrawModal/WithdrawModal.tsx';
import { QuestionOutlineIcon } from '@chakra-ui/icons';

const BalanceInfo = () => {
  const { address } = useAccount();

  const [showBalanceModal, setShowBalanceModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);

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
        direction={{ base: 'column', lg: 'row' }}
        spacing={4}
        rounded="lg"
        align={{ base: 'stretch', lg: 'center' }}
        background="whiteAlpha.900"
        p={4}
      >
        <Box flex={1}>
          <Box maxWidth={700}>
            <Text colorScheme="gray" fontWeight="bold">
              ChainRisk balance:{' '}
              {balanceIsLoading
                ? 'Loading...'
                : `${
                    Math.round(parseFloat(formatEther(BigInt(balance || 0))) * 100) / 100
                  } LINK`}
              <Tooltip
                hasArrow
                label="The ChainRisk contract uses LINK to retrieve your Credit Rating. Please ensure you have approved LINK spending and transferred enough LINK tokens to Mint or Update Score."
              >
                <QuestionOutlineIcon ml={1} mb={0.5} color="gray.500" />
              </Tooltip>
            </Text>
            <Text fontSize="sm" color="gray.600">
              Minting or updating an NFT costs <b>0.1 LINK</b>
            </Text>
          </Box>
        </Box>

        <Button variant="solid" onClick={() => setShowWithdrawModal(true)}>
          Withdraw
        </Button>
        <Button
          colorScheme="blue"
          variant="solid"
          onClick={() => setShowBalanceModal(true)}
        >
          Top up
        </Button>
      </Stack>
      <BalanceModal
        isOpen={showBalanceModal}
        onClose={() => setShowBalanceModal(false)}
      />
      <WithdrawModal
        isOpen={showWithdrawModal}
        onClose={() => setShowWithdrawModal(false)}
      />
    </>
  );
};

export default BalanceInfo;
