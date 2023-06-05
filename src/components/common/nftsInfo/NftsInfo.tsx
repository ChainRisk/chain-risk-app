import {
  Box,
  Button,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Text,
} from '@chakra-ui/react';
import { useState } from 'react';
import MintNftModal from '../mintNftModal/MintNftModal.tsx';
import { useAccount, useContractRead } from 'wagmi';
import { nftABI, nftContractAddress } from '../../../utils/nftABI.ts';
import { formatEther } from 'viem';

const NftsInfo = () => {
  const [showMinNftModal, setShowMintNftModal] = useState(false);
  const { address } = useAccount();
  const { data: balance, isLoading: balanceIsLoading } = useContractRead({
    address: nftContractAddress,
    abi: nftABI,
    functionName: 'getLinkBalance',
    watch: true,
    args: [address || '0x000000'],
  });

  return (
    <>
      <Box rounded="md" background="whiteAlpha.900" p={8} mb={4}>
        <Text fontSize={'lg'} color={'gray.600'} mb={4}>
          <Text mb={3} fontSize="xl" fontWeight="bold">
            Welcome to a new era of financial empowerment.
          </Text>
          <Text mb={3}>
            ChainRisk unique dynamic NFT takes your credit score to the next level by
            securely storing ratings from multiple agencies on the blockchain, providing a
            unique risk identity.
          </Text>
          <Text mb={3}>
            Experience unrivaled on-chain perks and tailor-made borrowing rates that truly
            reflect your financial credibility. Your future starts here, with a credit
            score that unlocks more than ever before.
          </Text>
          <Text>Get ready to reimagine your financial journey!</Text>
        </Text>

        {Math.round(parseFloat(formatEther(BigInt(balance || 0))) * 100) / 100 >= 0.1 ? (
          <Button
            variant="solid"
            colorScheme="blue"
            onClick={() => setShowMintNftModal(true)}
          >
            Mint NFT
          </Button>
        ) : (
          <Popover placement="left">
            <PopoverTrigger>
              <Button colorScheme="blue" isDisabled={balanceIsLoading}>
                Mint NFT
              </Button>
            </PopoverTrigger>
            <PopoverContent>
              <PopoverArrow />
              <PopoverCloseButton />
              <PopoverHeader fontWeight="bold">Not enough LINK</PopoverHeader>
              <PopoverBody>
                <Text>You need at least 0.1 LINK to mint an NFT.</Text>
              </PopoverBody>
            </PopoverContent>
          </Popover>
        )}
      </Box>
      <MintNftModal isOpen={showMinNftModal} onClose={() => setShowMintNftModal(false)} />
    </>
  );
};

export default NftsInfo;
