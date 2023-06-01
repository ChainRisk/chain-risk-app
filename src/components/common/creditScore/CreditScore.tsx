import React from 'react';
import { Box, Text } from '@chakra-ui/react';
import { getBgColor, getColor, getLightColor } from '../../../utils/getScoreColors.ts';

interface CreditScoreProps {
  creditRating: string;
  value: number;
}
const CreditScore: React.FC<CreditScoreProps> = ({ creditRating, value }) => {
  const bgColor = getBgColor(value);
  const color = getColor(value);
  const lightColor = getLightColor(value);

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
