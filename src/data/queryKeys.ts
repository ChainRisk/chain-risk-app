export const userScoreKeys = {
  all: ['userScore'] as const,
  lists: () => [...userScoreKeys.all, 'list'] as const,
  list: (filters: string) => [...userScoreKeys.lists(), { filters }] as const,
  details: () => [...userScoreKeys.all, 'detail'] as const,
  detail: (id: string) => [...userScoreKeys.details(), id] as const,
};
