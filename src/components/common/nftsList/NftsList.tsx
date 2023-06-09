import { Box } from '@chakra-ui/react';
import { useAccount, useContractRead, useContractReads } from 'wagmi';
import { nftABI, nftContractAddress } from '../../../utils/nftABI.ts';
import NftItemSection from '../nftItemSection/NftItemSection.tsx';

export default function NftsList() {
  const { address } = useAccount();

  const { data: nftsList = [], isLoading: nftsListIsLoading } = useContractRead({
    address: nftContractAddress,
    abi: nftABI,
    functionName: 'getUserNFTS',
    watch: true,
    args: [address || '0x000000'],
  });

  const {
    data: tokenURIList,
    isLoading: tokenURIListIsLoading,
    refetch: refetchTokenURIList,
  } = useContractReads({
    contracts: nftsList.map((nft: bigint) => ({
      address: nftContractAddress,
      abi: nftABI,
      functionName: 'tokenURI',
      args: [nft],
    })),
  });

  const handleRefetchTokenURIList = () => {
    refetchTokenURIList();
  };

  return (
    <>
      {nftsListIsLoading || tokenURIListIsLoading ? (
        <div>Loading...</div>
      ) : (
        <>
          {tokenURIList?.length === 0 ? (
            <Box display="flex" justifyContent="center">
              No NFTs found
            </Box>
          ) : (
            tokenURIList?.map((nft, idx) => {
              const nftURI = `https://ipfs.io/ipfs/${
                (nft.result as string).split('//')[1]
              }`;
              return (
                <NftItemSection
                  key={nftURI}
                  nftURI={nftURI}
                  tokenId={Number(nftsList[idx])}
                  refetchTokenURIList={handleRefetchTokenURIList}
                />
              );
            })
          )}
        </>
      )}
    </>
  );
}
