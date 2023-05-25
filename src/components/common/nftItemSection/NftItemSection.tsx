import {
  Box,
  Heading,
  HStack,
  Image,
  Tag,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';

// const IMAGE =
//   'https://images.unsplash.com/photo-1642104704074-907c0698cbd9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2232&q=80';

interface NftItemSectionProps {
  nftURI: string;
}

function removeNonPrintableChars(str: string) {
  return str.replace(/[^ -~]+/g, '');
}

const NftItemSection: React.FC<NftItemSectionProps> = ({ nftURI }) => {
  console.log('nftURI', nftURI);
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

  console.log('data', data?.score);
  console.log('data', data?.image);

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
            src={data?.image || 'https://via.placeholder.com/300'}
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
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Heading marginTop="1">{data?.score}</Heading>
          <HStack spacing={2} justifyContent="flex-end">
            <Tag size={'md'} variant="solid" colorScheme="gray">
              {`Expiration: ${new Date().toLocaleDateString()}`}
            </Tag>
          </HStack>
        </Box>

        <Text
          as="p"
          marginTop="2"
          marginBottom={4}
          color={useColorModeValue('gray.700', 'gray.200')}
          fontSize="lg"
        >
          Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem
          Ipsum has been the industry's standard dummy text ever since the 1500s, when an
          unknown printer took a galley of type and scrambled it to make a type specimen
          book.
        </Text>
        <Box>
          <Text fontWeight="medium">Minted: {new Date().toLocaleDateString()}</Text>
        </Box>
      </Box>
    </Box>
  );
};

export default NftItemSection;
