import { useQuery } from 'react-query';
import { userScoreKeys } from '../queryKeys.ts';
import { fetchUserScore } from '../api/userScore.ts';

export const useUserScore = (key: string) =>
  useQuery(userScoreKeys.detail(key), () => fetchUserScore(), {
    retry: false,
    enabled: !!key,
  });