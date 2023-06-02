import AllowanceInfo from '../../common/allowanceInfo/AllowanceInfo.tsx';
import NftsList from '../../common/nftsList/NftsList.tsx';
import BalanceInfo from '../../common/balanceInfo/BalanceInfo.tsx';
import NftsInfo from '../../common/nftsInfo/NftsInfo.tsx';
import { Box } from '@chakra-ui/react';
import { useAccount, useContractRead } from 'wagmi';
import { nftABI, nftContractAddress } from '../../../utils/nftABI.ts';

const Home = () => {
  const { address } = useAccount();

  const { data: nftsList = [] } = useContractRead({
    address: nftContractAddress,
    abi: nftABI,
    functionName: 'getUserNFTS',
    watch: true,
    args: [address || '0x000000'],
  });

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
      {nftsList?.length > 0 ? <NftsList /> : <NftsInfo />}
    </>
  );
};

export default Home;
