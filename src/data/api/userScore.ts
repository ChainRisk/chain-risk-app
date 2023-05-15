import axiosApi from '../axiosApi.ts';
import { UserScore } from '../types.ts';

export const fetchUserScore = async (): Promise<UserScore> => {
  return await axiosApi.get(`/test/creditrating`).then((response) => response.data);
};
