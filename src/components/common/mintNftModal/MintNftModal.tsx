import {
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
  useToast,
} from '@chakra-ui/react';
import { useAccount, useContractWrite } from 'wagmi';
import { myTokenABI } from '../../../utils/myTokenABI.ts';
import { useForm } from 'react-hook-form';
import React, { useEffect } from 'react';

interface FormValues {
  address: `0x${string}`;
  apiKey: string;
}

interface MintNftModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const MintNftModal: React.FC<MintNftModalProps> = ({ isOpen, onClose }) => {
  const toast = useToast();
  const { address } = useAccount();

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
  } = useForm<FormValues>();

  const handleMintNft = ({ apiKey, address: addressValue }: FormValues) => {
    console.log('apiKey', apiKey);

    write({
      args: [addressValue, 'spacebear_1.json'],
    });
  };

  useEffect(() => {
    reset({
      address,
    });
  }, [reset, address]);

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
                <FormControl isInvalid={!!errors.address}>
                  <FormLabel htmlFor="address">Address</FormLabel>
                  <Input
                    id="address"
                    {...register('address', {
                      required: 'Address is required',
                    })}
                  />
                  <FormErrorMessage>
                    {errors.address && (errors.address.message as string)}
                  </FormErrorMessage>
                </FormControl>
                <FormControl isInvalid={!!errors.apiKey}>
                  <FormLabel htmlFor="apiKey">API key</FormLabel>
                  <Input
                    id="apiKey"
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
