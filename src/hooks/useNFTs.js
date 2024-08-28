import { useInfiniteQuery } from "react-query";
import { fetchNFTs } from '../services/api';

const useNFTs = () => useInfiniteQuery("NFTData", ({ pageParam }) => fetchNFTs(pageParam), {
    getNextPageParam: (lastPage) => lastPage.next || undefined,
    retry: 3,
    retryDelay: 1000,
});

export default useNFTs;