import {
  Avatar,
  Box,
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
  Tooltip,
  useToast,
  VStack,
} from '@chakra-ui/react';
import { QuestionOutlineIcon } from '@chakra-ui/icons';
import React, { useEffect } from 'react';
import {
  useAccount,
  useContractRead,
  useContractWrite,
  useWaitForTransaction,
} from 'wagmi';
import { nftABI, nftContractAddress } from '../../../utils/nftABI.ts';
import { formatEther, parseEther } from 'viem';
import { chainLinkABI, chainLinkContractAddress } from '../../../utils/chainLinkABI.ts';
import { useForm } from 'react-hook-form';

interface FormValues {
  value: number;
}

interface BalanceModalProps {
  isOpen: boolean;
  onClose: () => void;
}
const BalanceModal: React.FC<BalanceModalProps> = ({ isOpen, onClose }) => {
  const account = useAccount();

  const { data: balance, isLoading: balanceIsLoading } = useContractRead({
    address: nftContractAddress,
    abi: nftABI,
    functionName: 'getLinkBalance',
    watch: true,
    args: [account?.address || '0x000000'],
  });

  const { data: allowance, isLoading: allowanceIsLoading } = useContractRead({
    address: chainLinkContractAddress,
    abi: chainLinkABI,
    functionName: 'allowance',
    watch: true,
    args: [account?.address || '0x000000', nftContractAddress],
  });

  const formattedAllowance =
    Math.round(parseFloat(formatEther(BigInt(allowance || 0))) * 100) / 100;

  const toast = useToast();

  const { data: approveData, write: approveWrite } = useContractWrite({
    address: chainLinkContractAddress,
    abi: chainLinkABI,
    functionName: 'approve',
  });

  const { isLoading: approveIsLoading } = useWaitForTransaction({
    hash: approveData?.hash,
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
    if (account?.address) {
      approveWrite({
        args: [nftContractAddress, BigInt(200000000000000000)],
      });
    }
  };

  const { data: transferLinkData, write: transferLinkWrite } = useContractWrite({
    address: nftContractAddress,
    abi: nftABI,
    functionName: 'transferLink',
  });

  const { isLoading: transferLinkIsLoading } = useWaitForTransaction({
    hash: transferLinkData?.hash,
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
    clearErrors,
  } = useForm<FormValues>();

  const handleTransfer = ({ value }: FormValues) => {
    transferLinkWrite({
      args: [parseEther(`${value}`)],
    });
  };

  useEffect(() => {
    reset({ value: 0.1 });
  }, [reset, isOpen]);

  useEffect(() => {
    clearErrors();
  }, [allowance, clearErrors]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent mx={3}>
        <form onSubmit={handleSubmit(handleTransfer)}>
          <ModalHeader>Top up your balance</ModalHeader>
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

            <Text fontSize="sm" mb={3} color="gray.600">
              Before minting your NFT, you need to 'Allow' and 'Transfer' LINK tokens.
              This process funds the credit rating data request, allowing the NFT to
              accurately represent your credit score.
            </Text>

            <Box flex={1} display={'flex'} alignItems={'center'} gap={3} mb={4}>
              <Text colorScheme="gray" fontSize={'sm'}>
                Chainlink allowance:{' '}
                <b>{allowanceIsLoading ? 'Loading...' : `${formattedAllowance} LINK`}</b>
                <Tooltip
                  hasArrow
                  label="When you Approve, you are granting permission to the Smart Contract to interact with a specified amount of tokens in your wallet. In this context, by approving, you allow the Smart Contract to take a specific amount of LINK tokens from your wallet to pay for the credit rating data request. This is a standard security measure preventing the smart contract from accessing more tokens than you explicitly allowed."
                >
                  <QuestionOutlineIcon ml={1} mb={0.5} color="gray.500" />
                </Tooltip>
              </Text>
              <Button
                size="xs"
                variant="solid"
                isLoading={approveIsLoading}
                onClick={handleApprove}
              >
                Change
              </Button>
            </Box>

            <Stack spacing={3}>
              <FormControl isInvalid={!!errors.value}>
                <FormLabel htmlFor="apiKey">Transfer amount:</FormLabel>
                <Input
                  type="number"
                  step={0.1}
                  id="value"
                  {...register('value', {
                    required: 'Value is required',
                    max: {
                      value:
                        Math.round(
                          parseFloat(formatEther(BigInt(allowance || 0))) * 100,
                        ) / 100,
                      message: `Increase your Chainlink allowance to transfer more than ${formattedAllowance} LINK`,
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
              Transfer
            </Button>
            <Button onClick={onClose}>Close</Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};

export default BalanceModal;
