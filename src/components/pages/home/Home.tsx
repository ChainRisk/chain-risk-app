import AllowanceInfo from '../../common/allowanceInfo/AllowanceInfo.tsx';
import NftsList from '../../common/nftsList/NftsList.tsx';
import BalanceInfo from '../../common/balanceInfo/BalanceInfo.tsx';
import NftsInfo from '../../common/nftsInfo/NftsInfo.tsx';
import { Box } from '@chakra-ui/react';

const Home = () => {
  return (
    <>
      <Box display="flex" flexDirection={{ base: 'column', xl: 'row' }} gap={3} mb={4}>
        <Box width="100%">
          <AllowanceInfo />
        </Box>
        <Box width="100%">
          <BalanceInfo />
        </Box>
      </Box>
      <NftsInfo />
      <NftsList />
    </>
  );
};

export default Home;
