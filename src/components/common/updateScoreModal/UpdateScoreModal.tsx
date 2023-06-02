import {
  Avatar,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
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

interface UpdateScoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  tokenId: number;
  refetchTokenURIList: () => void;
}

const UpdateScoreModal: React.FC<UpdateScoreModalProps> = ({
  isOpen,
  onClose,
  tokenId,
  refetchTokenURIList,
}) => {
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

  const { data: updateURIData, write: writeUpdateURI } = useContractWrite({
    address: nftContractAddress,
    abi: nftABI,
    functionName: 'updateURI',
    onError() {
      toast({
        title: 'Error',
        description: `There was an error updating score data.`,
        status: 'error',
      });
    },
  });

  const { isLoading: ratingDataIsLoading } = useWaitForTransaction({
    hash: ratingData?.hash,
    confirmations: 10,
    onSuccess() {
      if (account?.address) {
        writeUpdateURI({
          args: [BigInt(tokenId)],
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

  const { isLoading: updateURIDataIsLoading } = useWaitForTransaction({
    hash: updateURIData?.hash,
    confirmations: 5,
    onSuccess() {
      refetchTokenURIList();
      toast({
        title: 'Success',
        description: `Successfully updated score data.`,
        status: 'success',
      });
      onClose();
    },
    onError() {
      toast({
        title: 'Error',
        description: `There was an error updating score data.`,
        status: 'error',
      });
    },
  });

  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
    watch,
  } = useForm<FormValues>({
    mode: 'onChange',
  });

  const watchApiKey = watch('apiKey');

  const handleUpdateScore = async ({ apiKey }: FormValues) => {
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
  } = useUserScore(watchApiKey, watchApiKey?.length === 16);

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay />
        <form onSubmit={handleSubmit(handleUpdateScore)}>
          <ModalContent mx={3}>
            <ModalHeader>Update score</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              <Stack spacing={3}>
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
                <FormControl isInvalid={!!errors.apiKey}>
                  <FormLabel htmlFor="apiKey">API key</FormLabel>
                  <Input
                    id="apiKey"
                    type="password"
                    {...register('apiKey', {
                      required: 'API key is required',
                      minLength: {
                        value: 16,
                        message: 'API key must be 16 characters long',
                      },
                      maxLength: {
                        value: 16,
                        message: 'API key must be 16 characters long',
                      },
                    })}
                  />
                  <FormErrorMessage>
                    {errors.apiKey && (errors.apiKey.message as string)}
                  </FormErrorMessage>
                </FormControl>

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
                isLoading={updateURIDataIsLoading || ratingDataIsLoading}
                colorScheme="blue"
                mr={3}
              >
                Update
              </Button>
              <Button onClick={onClose}>Cancel</Button>
            </ModalFooter>
          </ModalContent>
        </form>
      </Modal>
    </>
  );
};

export default UpdateScoreModal;
