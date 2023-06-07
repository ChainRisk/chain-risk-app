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
            Before minting your NFT, you need to 'Approve' and 'Transfer' LINK tokens.
            This process funds the credit rating data request, allowing the NFT to
            accurately represent your credit score.
          </Text>
          <Text mb={3}>
            Minting or updating an NFT costs <b>0.1 LINK</b>. This is a one-time fee that
            covers the cost of the credit rating data request.
          </Text>
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
          <Popover>
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
