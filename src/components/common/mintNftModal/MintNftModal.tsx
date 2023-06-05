import {
  Avatar,
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
  useToast,
  VStack,
} from '@chakra-ui/react';
import { useContractWrite, useWaitForTransaction } from 'wagmi';
import { nftABI, nftContractAddress } from '../../../utils/nftABI.ts';
import { useForm } from 'react-hook-form';
import React, { useEffect } from 'react';
import { getAccount } from '@wagmi/core';
import { useUserScore } from '../../../data/hooks/userScore.ts';
import CreditScore from '../creditScore/CreditScore.tsx';

interface FormValues {
  apiKey: string;
}

interface MintNftModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const MintNftModal: React.FC<MintNftModalProps> = ({ isOpen, onClose }) => {
  const toast = useToast();
  const account = getAccount();

  const { data: ratingData, write: requestRatingData } = useContractWrite({
    address: nftContractAddress,
    abi: nftABI,
    functionName: 'requestRatingData',
    onError() {
      toast({
        title: 'Error',
        description: `There was an error requesting rating data.`,
        status: 'error',
      });
    },
  });

  const { data: mintNFTData, write: writeMintNFT } = useContractWrite({
    address: nftContractAddress,
    abi: nftABI,
    functionName: 'mintNFT',
    onError() {
      toast({
        title: 'Error',
        description: `There was an error minting your NFT.`,
        status: 'error',
      });
    },
  });

  const { isLoading: ratingDataIsLoading } = useWaitForTransaction({
    hash: ratingData?.hash,
    confirmations: 10,
    onSuccess() {
      if (account?.address) {
        writeMintNFT({
          args: [account.address],
        });
      }
    },
    onError() {
      toast({
        title: 'Error',
        description: `There was an error requesting rating data.`,
        status: 'error',
      });
    },
  });

  const { isLoading: mintNFTIsLoading } = useWaitForTransaction({
    hash: mintNFTData?.hash,
    onSuccess() {
      toast({
        title: 'Success',
        description: `Successfully minted your NFT!`,
        status: 'success',
      });
      onClose();
    },
    onError() {
      toast({
        title: 'Error',
        description: `There was an error minting your NFT.`,
        status: 'error',
      });
    },
  });

  const { handleSubmit, reset } = useForm<FormValues>({
    mode: 'onChange',
  });

  const handleMintNft = async ({ apiKey }: FormValues) => {
    console.log('apiKey', apiKey);

    if (account?.address) {
      requestRatingData();
    }
  };

  useEffect(() => {
    reset();
  }, [reset, isOpen]);

  const {
    data: userScore,
    isLoading: userScoreIsLoading,
    error: userScoreError,
  } = useUserScore();

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay />
        <form onSubmit={handleSubmit(handleMintNft)}>
          <ModalContent mx={3}>
            <ModalHeader>Mint NFT</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Stack spacing={4}>
                <Stack direction={'row'}>
                  <Avatar
                    size={'sm'}
                    src={
                      'https://images.unsplash.com/photo-1618556450994-a6a128ef0d9d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1664&q=80'
                    }
                  />
                  <VStack
                    display="flex"
                    alignItems="flex-start"
                    spacing="1px"
                    ml="2"
                    overflow="hidden"
                  >
                    <Text
                      overflow="hidden"
                      overflowWrap="normal"
                      width="100%"
                      textOverflow="ellipsis"
                      fontSize="sm"
                    >
                      {account?.address}
                    </Text>
                    <Text fontSize="xs" color="gray.600">
                      {account?.connector?.name}
                    </Text>
                  </VStack>
                </Stack>

                <Text color="gray.600">
                  To mint an NFT, ChainRisk will need to fetch and apply your latest
                  credit score. Please bear in mind that you will need to approve two
                  wallet pop-ups: one to request the score and one to mint your NFT.
                </Text>

                {userScoreIsLoading && <Text>Loading...</Text>}
                {!!userScoreError && <Text>Api key is invalid</Text>}
                {userScore && (
                  <CreditScore
                    value={userScore.value}
                    creditRating={userScore.creditRating}
                  />
                )}
              </Stack>
            </ModalBody>

            <ModalFooter>
              <Button
                type="submit"
                isLoading={mintNFTIsLoading || ratingDataIsLoading}
                colorScheme="blue"
                mr={3}
              >
                Mint
              </Button>
              <Button onClick={onClose}>Cancel</Button>
            </ModalFooter>
          </ModalContent>
        </form>
      </Modal>
    </>
  );
};

export default MintNftModal;
