import { useQuery } from 'react-query';
import { userScoreKeys } from '../queryKeys.ts';
import { fetchUserScore } from '../api/userScore.ts';

export const useUserScore = () =>
  useQuery(userScoreKeys.detail(''), () => fetchUserScore(), {
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });
