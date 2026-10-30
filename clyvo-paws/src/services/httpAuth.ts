import axios from 'axios';

export const API_CONFIG = {
  baseURL: 'https://clyvopawsjavachallenge.onrender.com',
  timeout: 30000,
};
export const httpAuth = axios.create(API_CONFIG);
