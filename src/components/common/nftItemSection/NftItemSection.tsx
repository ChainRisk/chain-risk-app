import {
  Box,
  Button,
  Heading,
  Image,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Skeleton,
  Tag,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import React, { useState } from 'react';
import { getColor, getLightColor } from '../../../utils/getScoreColors.ts';
import { fromUnixTime } from 'date-fns';
import UpdateScoreModal from '../updateScoreModal/UpdateScoreModal.tsx';
import { useQuery } from 'react-query';
import { useAccount, useContractRead } from 'wagmi';
import { nftABI, nftContractAddress } from '../../../utils/nftABI.ts';
import { formatEther } from 'viem';

interface NftItemSectionProps {
  nftURI: string;
  tokenId: number;
  refetchTokenURIList: () => void;
}

function removeNonPrintableChars(str: string) {
  return str.replace(/[^ -~]+/g, '');
}

const NftItemSection: React.FC<NftItemSectionProps> = ({
  nftURI,
  tokenId,
  refetchTokenURIList,
}) => {
  const [showUpdateScoreModal, setShowUpdateScoreModal] = useState(false);
  const { address } = useAccount();
  const { data, isLoading: dataIsLoading } = useQuery<{
    name: string;
    image: string;
    description: string;
    attributes: { trait_type: string; value: string | number }[];
  }>(['nft', tokenId], () =>
    fetch(removeNonPrintableChars(nftURI), { cache: 'no-cache' }).then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        console.error('Error fetching nft data');
      }
    }),
  );

  const { data: balance, isLoading: balanceIsLoading } = useContractRead({
    address: nftContractAddress,
    abi: nftABI,
    functionName: 'getLinkBalance',
    watch: true,
    args: [address || '0x000000'],
  });

  const image = data?.image
    ? `https://ipfs.io/ipfs/${(data?.image as string).split('//')[1]}`
    : '';
  const blendedScore = data?.attributes?.find(
    (attr) => attr.trait_type === 'blendedScore',
  )?.value as number;
  const creditRating = data?.attributes?.find(
    (attr) => attr.trait_type === 'creditRating',
  )?.value;
  const mintDate = fromUnixTime(
    data?.attributes?.find((attr) => attr.trait_type === 'Mint date')?.value as number,
  ).toDateString();
  const expirationDate = fromUnixTime(
    data?.attributes?.find((attr) => attr.trait_type === 'Expiration date')
      ?.value as number,
  ).toDateString();

  const color = getColor(blendedScore);
  const lightColor = getLightColor(blendedScore);

  return (
    <>
      <Box
        marginTop={{ base: '1', xl: '5' }}
        display="flex"
        flexDirection={{ base: 'column', xl: 'row' }}
        justifyContent="space-between"
        background={useColorModeValue('white', 'gray.800')}
        paddingLeft={{ base: 3, xl: 4 }}
        paddingRight={{ base: 3, xl: 8 }}
        paddingTop={{ base: 3, xl: 4 }}
        paddingBottom={{ base: 3, xl: 6 }}
        borderRadius="xl"
      >
        <Box
          display="flex"
          flex="1"
          marginRight={{ base: 0, xl: 3 }}
          position="relative"
          alignItems="center"
        >
          <Box
            width={{ base: '100%', xl: '85%' }}
            zIndex="2"
            marginLeft={{ base: '0', xl: '5%' }}
            marginTop="5%"
          >
            {dataIsLoading ? (
              <Skeleton height="260px" width="100%" borderRadius="lg" />
            ) : (
              <Image
                borderRadius="lg"
                src={image}
                alt="some good alt text"
                objectFit="contain"
                width="100%"
                maxHeight="350px"
              />
            )}
          </Box>
          <Box zIndex="1" width="100%" position="absolute" height="100%">
            <Box
              bgGradient={useColorModeValue(
                'radial(orange.600 1px, transparent 1px)',
                'radial(orange.300 1px, transparent 1px)',
              )}
              backgroundSize="20px 20px"
              opacity="0.4"
              height="100%"
            />
          </Box>
        </Box>
        <Box
          display="flex"
          flex="1"
          flexDirection="column"
          justifyContent="center"
          marginTop={{ base: '3', xl: '0' }}
        >
          <Box mb={3}>
            <Box
              display={'flex'}
              justifyContent={'space-between'}
              flexDirection={{ base: 'column', md: 'row' }}
              alignItems={{ base: 'flex-end', md: 'flex-start' }}
              gap={4}
            >
              <Box width={'100%'}>
                <Skeleton isLoaded={!dataIsLoading} noOfLines={1}>
                  <Heading
                    fontWeight={'bold'}
                    display={'flex'}
                    alignItems={'center'}
                    gap={4}
                  >
                    <span>Credit rating:</span>
                    <Box
                      color={color}
                      background={lightColor}
                      px={2}
                      py={1}
                      borderRadius={'md'}
                    >
                      {creditRating}
                    </Box>
                  </Heading>
                </Skeleton>
                <Skeleton mt={3} isLoaded={!dataIsLoading} noOfLines={1}>
                  <Text fontSize="md">Blended credit score of {blendedScore}</Text>
                </Skeleton>
              </Box>
              <Box>
                {Math.round(parseFloat(formatEther(BigInt(balance || 0))) * 100) / 100 >=
                0.1 ? (
                  <Button
                    isDisabled={dataIsLoading || balanceIsLoading}
                    onClick={() => setShowUpdateScoreModal(true)}
                  >
                    Update score
                  </Button>
                ) : (
                  <Popover>
                    <PopoverTrigger>
                      <Button isDisabled={balanceIsLoading}>Update score</Button>
                    </PopoverTrigger>
                    <PopoverContent>
                      <PopoverArrow />
                      <PopoverCloseButton />
                      <PopoverHeader fontWeight="bold">Not enough LINK</PopoverHeader>
                      <PopoverBody>
                        <Text>You need at least 0.1 LINK to update NFT score.</Text>
                      </PopoverBody>
                    </PopoverContent>
                  </Popover>
                )}
              </Box>
            </Box>
          </Box>

          <Text
            as="p"
            marginTop="2"
            marginBottom={4}
            color={useColorModeValue('gray.700', 'gray.200')}
            fontSize="lg"
          >
            Unleash the power of your credit score with ChainRisk! This game-changing
            innovation harnesses Chainlink technology to store your credit ratings from
            multiple agencies in a dynamic NFT, paving the way for exclusive on-chain
            benefits and personalized borrowing rates. It's your financial future,
            reimagined.
          </Text>

          <Box
            display={'flex'}
            flexDirection={{ base: 'column', xl: 'row' }}
            gap={2}
            alignItems="flex-end"
          >
            <Skeleton isLoaded={!dataIsLoading}>
              <Tag
                size={'md'}
                variant="solid"
                background="blue.50"
                color="blue.600"
                display={'flex'}
                justifyContent={'space-between'}
                alignContent={'center'}
                gap={3}
              >
                <span>Mint date:</span>
                <span>{mintDate}</span>
              </Tag>
            </Skeleton>
            <Skeleton isLoaded={!dataIsLoading}>
              <Tag
                size={'md'}
                variant="solid"
                background="gray.100"
                color="gray.700"
                display={'flex'}
                justifyContent={'space-between'}
                alignContent={'center'}
                gap={3}
              >
                <span>Expiration date:</span>
                <span>{expirationDate}</span>
              </Tag>
            </Skeleton>
          </Box>
        </Box>
      </Box>
      <UpdateScoreModal
        tokenId={tokenId}
        isOpen={showUpdateScoreModal}
        onClose={() => setShowUpdateScoreModal(false)}
        refetchTokenURIList={refetchTokenURIList}
      />
    </>
  );
};

export default NftItemSection;
