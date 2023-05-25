import { Button, Stack } from '@chakra-ui/react';
import { useState } from 'react';
import MintNftModal from '../mintNftModal/MintNftModal.tsx';

const NftsInfo = () => {
  const [showMinNftModal, setShowMintNftModal] = useState(false);

  return (
    <>
      <Stack
        direction="row"
        spacing={4}
        rounded="md"
        align="center"
        justifyContent="flex-end"
        mb={4}
      >
        <Button
          variant="solid"
          colorScheme="blue"
          onClick={() => setShowMintNftModal(true)}
        >
          Mint NFT
        </Button>
      </Stack>
      <MintNftModal isOpen={showMinNftModal} onClose={() => setShowMintNftModal(false)} />
    </>
  );
};

export default NftsInfo;
