import { SimpleGrid } from '@chakra-ui/react';
import NftCard from '../nftCard/NftCard.tsx';

export default function NftsList() {
  return (
    <SimpleGrid columns={3} spacingX={12} spacingY={24} py={12}>
      <NftCard />
      <NftCard />
      <NftCard />
      <NftCard />
      <NftCard />
    </SimpleGrid>
  );
}
