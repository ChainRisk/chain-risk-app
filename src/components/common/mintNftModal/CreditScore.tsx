import React from 'react';
import { Box, Text } from '@chakra-ui/react';

interface CreditScoreProps {
  creditRating: string;
  value: number;
}
const CreditScore: React.FC<CreditScoreProps> = ({ creditRating, value }) => {
  const bgColor = value <= 35 ? 'red.50' : value <= 65 ? 'orange.50' : 'green.50';
  const color = value <= 35 ? 'red.500' : value <= 65 ? 'orange.500' : 'green.500';
  const lightColor = value <= 35 ? 'red.100' : value <= 65 ? 'orange.100' : 'green.100';

  return (
    <Box
      display={'flex'}
      alignItems={'center'}
      background={bgColor}
      padding={4}
      borderRadius={6}
    >
      <Box
        background={color}
        width={16}
        height={16}
        borderRadius={6}
        mr={4}
        display={'flex'}
        alignItems={'center'}
        justifyContent={'center'}
        color={lightColor}
        fontWeight={'bold'}
        fontSize={'sm'}
      >
        {creditRating}
      </Box>
      <Box>
        <Text fontWeight={'bold'} color={color}>
          Credit rating: {creditRating}
        </Text>
        <Text fontSize="sm" color={color}>
          Blended credit score of {value}
        </Text>
      </Box>
    </Box>
  );
};

export default CreditScore;
