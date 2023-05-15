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
import { useContractWrite } from 'wagmi';
import { myTokenABI } from '../../../utils/myTokenABI.ts';
import { useForm } from 'react-hook-form';
import React, { useEffect } from 'react';
import { getAccount } from '@wagmi/core';

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

  const { isLoading, write } = useContractWrite({
    address: '0xFa315Ca811F341e05fdb83A62D8B4DEBA98dbf62',
    abi: myTokenABI,
    functionName: 'safeMint',
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

  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
    // watch,
  } = useForm<FormValues>();

  // const watchApiKey = watch('apiKey');

  const handleMintNft = ({ apiKey }: FormValues) => {
    console.log('apiKey', apiKey);

    if (account?.address) {
      write({
        args: [account.address, 'spacebear_1.json'],
      });
    }
  };

  useEffect(() => {
    reset();
  }, [reset, isOpen]);

  // const {
  //   data: userScore,
  //   isLoading: userScoreIsLoading,
  //   error: userScoreError,
  // } = useUserScore(watchApiKey);

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay />
        <form onSubmit={handleSubmit(handleMintNft)}>
          <ModalContent mx={3}>
            <ModalHeader>Mint NFT</ModalHeader>
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
                    display={{ base: 'none', md: 'flex' }}
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
                    })}
                  />
                  <FormErrorMessage>
                    {errors.apiKey && (errors.apiKey.message as string)}
                  </FormErrorMessage>
                </FormControl>
              </Stack>
            </ModalBody>

            <ModalFooter>
              <Button type="submit" isLoading={isLoading} colorScheme="blue" mr={3}>
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
