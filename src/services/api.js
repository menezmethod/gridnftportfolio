import axios from "axios";
import { OPENSEA_API_KEY, COLLECTION_SLUG, CONTRACT_ADDRESS } from '../constants';

const api = axios.create({
  headers: { 'accept': 'application/json', 'x-api-key': OPENSEA_API_KEY }
});

export const fetchNFTs = async (pageParam = null) => {
  const { data } = await api.get(`https://api.opensea.io/api/v2/collection/${COLLECTION_SLUG}/nfts`, { params: { limit: 20, next: pageParam } });
  return data;
};

export const fetchNFTDetails = async (identifier) => {
  const [{ data: { nft } }, { data: bestOffer }] = await Promise.all([
    api.get(`https://api.opensea.io/api/v2/chain/ethereum/contract/${CONTRACT_ADDRESS}/nfts/${identifier}`),
    api.get(`https://api.opensea.io/api/v2/offers/collection/${COLLECTION_SLUG}/nfts/${identifier}/best`)
  ]);
  return { ...nft, bestOffer };
};