import { Box, Heading, Image, Tag, Text, useColorModeValue } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { getColor, getLightColor } from '../../../utils/getScoreColors.ts';

const IMAGE =
  'https://images.unsplash.com/photo-1642104704074-907c0698cbd9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2232&q=80';

interface NftItemSectionProps {
  nftURI: string;
}

function removeNonPrintableChars(str: string) {
  return str.replace(/[^ -~]+/g, '');
}

const NftItemSection: React.FC<NftItemSectionProps> = ({ nftURI }) => {
  const [data, setData] = useState({
    score: '',
    image: '',
  });

  useEffect(() => {
    if (nftURI) {
      fetch(removeNonPrintableChars(nftURI))
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else {
            console.error('Error fetching nft data');
          }
        })
        .then((jsonResponse) => setData(jsonResponse))
        .catch((error) => console.error(error));
    }
  }, [nftURI]);

  const value = 84;

  const color = getColor(value);
  const lightColor = getLightColor(value);

  return (
    <Box
      marginTop={{ base: '1', lg: '5' }}
      display="flex"
      flexDirection={{ base: 'column', lg: 'row' }}
      justifyContent="space-between"
      background={useColorModeValue('white', 'gray.800')}
      paddingLeft={{ base: 3, lg: 4 }}
      paddingRight={{ base: 3, lg: 8 }}
      paddingTop={{ base: 3, lg: 4 }}
      paddingBottom={{ base: 3, lg: 6 }}
      borderRadius="xl"
    >
      <Box
        display="flex"
        flex="1"
        marginRight={{ base: 0, lg: 3 }}
        position="relative"
        alignItems="center"
      >
        <Box
          width={{ base: '100%', lg: '85%' }}
          zIndex="2"
          marginLeft={{ base: '0', lg: '5%' }}
          marginTop="5%"
        >
          <Image
            borderRadius="lg"
            src={data?.image || IMAGE}
            alt="some good alt text"
            objectFit="cover"
            width="100%"
            maxHeight="300px"
          />
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
        marginTop={{ base: '3', lg: '0' }}
      >
        <Box mb={3}>
          <Box display={'flex'} alignItems={'center'}>
            <Box>
              <Heading fontWeight={'bold'} display={'flex'} alignItems={'center'} gap={4}>
                <span>Credit rating:</span>
                <Box
                  color={color}
                  background={lightColor}
                  px={2}
                  py={1}
                  borderRadius={'md'}
                >
                  {data?.score}
                </Box>
              </Heading>
              <Box display="inline-flex" fontSize="md">
                Blended credit score of {value}
              </Box>
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
          Unleash the power of your credit score with RiskPass! This game-changing
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
            <span>{new Date().toLocaleDateString()}</span>
          </Tag>
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
            <span>{new Date().toLocaleDateString()}</span>
          </Tag>
        </Box>
      </Box>
    </Box>
  );
};

export default NftItemSection;
