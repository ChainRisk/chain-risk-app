import { Box, Heading, Image, Stack, Text, useColorModeValue } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';

// const IMAGE =
//   'https://images.unsplash.com/photo-1642104704074-907c0698cbd9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2232&q=80';

interface NftCardProps {
  nftURI: string;
}

function removeNonPrintableChars(str: string) {
  return str.replace(/[^ -~]+/g, '');
}

const NftCard: React.FC<NftCardProps> = ({ nftURI }) => {
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

  return (
    <Box
      role={'group'}
      p={6}
      w={'full'}
      bg={useColorModeValue('white', 'gray.800')}
      boxShadow={'lg'}
      rounded={'lg'}
      pos={'relative'}
      zIndex={1}
    >
      <Box
        rounded={'lg'}
        mt={-12}
        pos={'relative'}
        height={'230px'}
        _after={{
          transition: 'all .3s ease',
          content: '""',
          w: 'full',
          h: 'full',
          pos: 'absolute',
          top: 3,
          left: 0,
          backgroundImage: `url(${data?.image})`,
          filter: 'blur(15px)',
          zIndex: -1,
        }}
        _groupHover={{
          _after: {
            filter: 'blur(20px)',
          },
        }}
      >
        <Image
          rounded={'lg'}
          height={230}
          width={'100%'}
          objectFit={'cover'}
          src={data?.image}
        />
      </Box>
      <Stack pt={10}>
        <Stack align={'center'} direction={'row'} justify={'space-between'}>
          <Heading fontSize={'2xl'} fontFamily={'body'} fontWeight={500}>
            {data?.score}
          </Heading>
          {/*<Text color={'gray.500'} fontSize={'sm'} textTransform={'uppercase'}>*/}
          {/*  NFT type*/}
          {/*</Text>*/}
        </Stack>
        <Box>
          <Text color={'gray.500'} fontSize="sm">
            {nftURI}
          </Text>
        </Box>
      </Stack>
    </Box>
  );
};

export default NftCard;
