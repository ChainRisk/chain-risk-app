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
import { useForm } from 'react-hook-form';
import React, { useEffect } from 'react';
import { getAccount } from '@wagmi/core';
import { nftABI, nftContractAddress } from '../../../utils/nftABI.ts';

interface FormValues {
  value: number;
}

interface MintNftModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TransferModal: React.FC<MintNftModalProps> = ({ isOpen, onClose }) => {
  const toast = useToast();
  const account = getAccount();

  const { data, write } = useContractWrite({
    address: nftContractAddress,
    abi: nftABI,
    functionName: 'transferLink',
  });

  const { isLoading } = useWaitForTransaction({
    hash: data?.hash,
    onSuccess() {
      toast({
        title: 'Success',
        description: `Link transferred successfully!`,
        status: 'success',
      });
      onClose();
    },
    onError() {
      toast({
        title: 'Error',
        description: `There was an error transferring Link.`,
        status: 'error',
      });
    },
  });

  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
  } = useForm<FormValues>();

  const handleApprove = ({ value }: FormValues) => {
    write({
      args: [BigInt(value)],
    });
  };

  useEffect(() => {
    reset({ value: 200000000000000000 });
  }, [reset, isOpen]);

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay />
        <form onSubmit={handleSubmit(handleApprove)}>
          <ModalContent mx={3}>
            <ModalHeader>Transfer Link</ModalHeader>
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
                <FormControl isInvalid={!!errors.value}>
                  <FormLabel htmlFor="apiKey">Anount</FormLabel>
                  <Input
                    type="number"
                    id="value"
                    {...register('value', {
                      required: 'Value is required',
                    })}
                  />
                  <FormErrorMessage>
                    {errors.value && (errors.value.message as string)}
                  </FormErrorMessage>
                </FormControl>
              </Stack>
            </ModalBody>

            <ModalFooter>
              <Button type="submit" isLoading={isLoading} colorScheme="blue" mr={3}>
                Approve
              </Button>
              <Button onClick={onClose}>Cancel</Button>
            </ModalFooter>
          </ModalContent>
        </form>
      </Modal>
    </>
  );
};

export default TransferModal;
