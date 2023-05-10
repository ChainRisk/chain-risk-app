import { Box, Heading, Image, Stack, Text, useColorModeValue } from '@chakra-ui/react';

const IMAGE =
  'https://images.unsplash.com/photo-1642104704074-907c0698cbd9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2232&q=80';

const NftCard = () => {
  return (
    <Box
      role={'group'}
      p={6}
      w={'full'}
      bg={useColorModeValue('white', 'gray.800')}
      boxShadow={'2xl'}
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
          top: 5,
          left: 0,
          backgroundImage: `url(${IMAGE})`,
          filter: 'blur(15px)',
          zIndex: -1,
        }}
        _groupHover={{
          _after: {
            filter: 'blur(20px)',
          },
        }}
      >
        <Image rounded={'lg'} height={230} objectFit={'cover'} src={IMAGE} />
      </Box>
      <Stack pt={10}>
        <Stack align={'center'} direction={'row'} justify={'space-between'}>
          <Heading fontSize={'2xl'} fontFamily={'body'} fontWeight={500}>
            NFT Title
          </Heading>
          <Text color={'gray.500'} fontSize={'sm'} textTransform={'uppercase'}>
            NFT type
          </Text>
        </Stack>
        <Box>
          <Text color={'gray.500'} fontSize="sm">
            Created at 2021-04-16
          </Text>
        </Box>
      </Stack>
    </Box>
  );
};

export default NftCard;
