export const getBgColor = (value: number) =>
  value <= 35 ? 'red.50' : value <= 65 ? 'orange.50' : 'green.50';
export const getColor = (value: number) =>
  value <= 35 ? 'red.500' : value <= 65 ? 'orange.500' : 'green.500';
export const getLightColor = (value: number) =>
  value <= 35 ? 'red.100' : value <= 65 ? 'orange.100' : 'green.100';
