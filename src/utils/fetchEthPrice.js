import axios from 'axios';
import { CRYPTOCOMPARE_API_KEY } from '../constants';

export const fetchEthPrice = async () => {
  try {
    const response = await axios.get(`https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD&api_key=${CRYPTOCOMPARE_API_KEY}`);
    return response.data.USD;
  } catch (error) {
    console.error('Error fetching ETH price:', error);
    return null;
  }
};