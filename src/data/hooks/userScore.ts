import { useQuery } from 'react-query';
import { userScoreKeys } from '../queryKeys.ts';
import { fetchUserScore } from '../api/userScore.ts';

export const useUserScore = (key: string, enabled = true) =>
  useQuery(userScoreKeys.detail(key), () => fetchUserScore(), {
    retry: false,
    enabled: !!key && enabled,
  });
