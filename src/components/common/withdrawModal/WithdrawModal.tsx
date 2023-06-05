import {
  Avatar,
  Button,
  Divider,
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
import { formatEther, parseEther } from 'viem';
import React, { useEffect } from 'react';
import {
  useAccount,
  useContractRead,
  useContractWrite,
  useWaitForTransaction,
} from 'wagmi';
import { nftABI, nftContractAddress } from '../../../utils/nftABI.ts';
import { useForm } from 'react-hook-form';

interface FormValues {
  value: number;
}

interface WithdrawModalProps {
  isOpen: boolean;
  onClose: () => void;
}
const WithdrawModal: React.FC<WithdrawModalProps> = ({ isOpen, onClose }) => {
  const toast = useToast();
  const account = useAccount();

  const { data: balance, isLoading: balanceIsLoading } = useContractRead({
    address: nftContractAddress,
    abi: nftABI,
    functionName: 'getLinkBalance',
    watch: true,
    args: [account?.address || '0x000000'],
  });

  const formattedBalance =
    Math.round(parseFloat(formatEther(BigInt(balance || 0))) * 100) / 100;

  const { data: transferLinkData, write: transferLinkWrite } = useContractWrite({
    address: nftContractAddress,
    abi: nftABI,
    functionName: 'withdrawLink',
  });

  const { isLoading: transferLinkIsLoading } = useWaitForTransaction({
    hash: transferLinkData?.hash,
    onSuccess() {
      toast({
        title: 'Success',
        description: `LINK withdrawn successfully.`,
        status: 'success',
      });
      onClose();
    },
    onError() {
      toast({
        title: 'Error',
        description: `There was an error withdrawing your LINK.`,
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

  const handleTransfer = ({ value }: FormValues) => {
    transferLinkWrite({
      args: [parseEther(`${value}`)],
    });
  };

  useEffect(() => {
    reset({ value: 0.1 });
  }, [reset, isOpen]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent mx={3}>
        <form onSubmit={handleSubmit(handleTransfer)}>
          <ModalHeader>Withdraw LINK</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <Stack direction={'row'} mb={3}>
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
                  Current balance:{' '}
                  <b>
                    {balanceIsLoading
                      ? 'Loading...'
                      : `${
                          Math.round(
                            parseFloat(formatEther(BigInt(balance || 0))) * 100,
                          ) / 100
                        } LINK`}
                  </b>
                </Text>
              </VStack>
            </Stack>

            <Divider mb={3} />

            <Stack spacing={3}>
              <FormControl isInvalid={!!errors.value}>
                <FormLabel htmlFor="apiKey">Withdraw amount:</FormLabel>
                <Input
                  type="number"
                  step={0.1}
                  id="value"
                  {...register('value', {
                    required: 'Value is required',
                    max: {
                      value: formattedBalance,
                      message: `You don't have enough LINK`,
                    },
                  })}
                />
                <FormErrorMessage>
                  {errors.value && (errors.value.message as string)}
                </FormErrorMessage>
              </FormControl>
            </Stack>
          </ModalBody>

          <ModalFooter>
            <Button
              type="submit"
              isLoading={transferLinkIsLoading}
              colorScheme="blue"
              mr={3}
            >
              Withdraw
            </Button>
            <Button onClick={onClose}>Close</Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};

export default WithdrawModal;
