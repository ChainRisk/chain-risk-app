import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Flex, Text } from '@chakra-ui/react';
import { CloseIcon } from '@chakra-ui/icons';
import { FaArrowLeft } from 'react-icons/all';

interface GlobalErrorBoundaryFallbackProps {
  error: Error;
}

export const GlobalErrorBoundaryFallback: React.FC<GlobalErrorBoundaryFallbackProps> = ({
  error,
}) => {
  const navigate = useNavigate();
  const handleReset = () => {
    navigate('/');
  };

  return (
    <Box textAlign="center" py={10} px={6}>
      <Box display="inline-block">
        <Flex
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          bg={'red.500'}
          rounded={'50px'}
          w={'55px'}
          h={'55px'}
          textAlign="center"
        >
          <CloseIcon boxSize={'20px'} color={'white'} />
        </Flex>
      </Box>
      <Text as="h2" size="xl" mt={6} mb={2}>
        Something went wrong
      </Text>
      <Text color={'gray.500'}>{error.message}</Text>
      <Button
        onClick={handleReset}
        mt={6}
        colorScheme="blue"
        display="inline-flex"
        gap={2}
      >
        <FaArrowLeft /> Return to the homepage
      </Button>
    </Box>
  );
};
