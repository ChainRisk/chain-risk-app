import axios from 'axios';

const axiosApi = axios.create({
  baseURL: 'https://gva1kp8ip8.execute-api.eu-north-1.amazonaws.com',
  headers: {
    'Content-type': 'application/json',
  },
  withCredentials: true,
});

export default axiosApi;
