import { SimpleGrid } from '@chakra-ui/react';
import NftCard from '../nftCard/NftCard.tsx';

export default function NftsList() {
  return (
    <SimpleGrid minChildWidth="320px" columns={3} spacingX={12} spacingY={20} py={12}>
      <NftCard />
      <NftCard />
      <NftCard />
      <NftCard />
      <NftCard />
    </SimpleGrid>
  );
}
