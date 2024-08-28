import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Box, Grid, Typography, Alert, CircularProgress, LinearProgress } from "@mui/material";
import useNFTs from './hooks/useNFTs';
import NFTCard from './components/NFTCard';
import NFTDialog from './components/NFTDialog';
import { fetchNFTDetails } from './services/api';

function Gallery() {
    const { data, error, fetchNextPage, hasNextPage, isFetchingNextPage, status } = useNFTs();
    const [validNFTs, setValidNFTs] = useState([]);
    const [currentNFT, setCurrentNFT] = useState(null);
    const [currentNFTIdx, setCurrentNFTIdx] = useState(0);
    const [open, setOpen] = useState(false);
    const [isLoadingDetails, setIsLoadingDetails] = useState(false);

    useEffect(() => {
        if (data?.pages) {
            setValidNFTs(data.pages.flatMap(page => page.nfts).filter(nft => nft.identifier && (nft.image_url || nft.display_image_url)));
        }
    }, [data]);

    const handleOpenNFT = async (nft, index) => {
        setIsLoadingDetails(true);
        try {
            setCurrentNFT(await fetchNFTDetails(nft.identifier));
            setCurrentNFTIdx(index);
            setOpen(true);
        } catch (error) {
            console.error("Error loading NFT details:", error);
        } finally {
            setIsLoadingDetails(false);
        }
    };

    const handleNavigate = async (direction) => {
        const newIdx = direction === 'next' ? currentNFTIdx + 1 : currentNFTIdx - 1;
        if (newIdx >= 0 && newIdx < validNFTs.length) {
            setIsLoadingDetails(true);
            try {
                setCurrentNFT(await fetchNFTDetails(validNFTs[newIdx].identifier));
                setCurrentNFTIdx(newIdx);
            } catch (error) {
                console.error(`Error loading ${direction} NFT details:`, error);
            } finally {
                setIsLoadingDetails(false);
            }
        }
    };

    const observer = useRef();
    const lastNFTElementRef = useCallback(node => {
        if (isFetchingNextPage) return;
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasNextPage) {
                fetchNextPage();
            }
        });
        if (node) observer.current.observe(node);
    }, [isFetchingNextPage, fetchNextPage, hasNextPage]);

    if (status === 'loading') return <LinearProgress />;
    if (error) return <Alert severity="error">Error loading NFTs: {error.message}</Alert>;

    return (
        <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h2" component="div" gutterBottom align={'center'}>
                <strong>NFT Gallery</strong>
            </Typography>
            <Grid container spacing={{xs: 1, md: 1}} columns={{xs: 2, sm: 4, md: 10}} justifyContent={'center'}>
                {validNFTs.map((nft, index) => (
                    <Grid item key={nft.identifier} ref={index === validNFTs.length - 1 ? lastNFTElementRef : null}>
                        <NFTCard nft={nft} onClick={() => handleOpenNFT(nft, index)} />
                    </Grid>
                ))}
                {isFetchingNextPage && <CircularProgress />}
            </Grid>
            <NFTDialog
                nft={currentNFT}
                open={open}
                onClose={() => setOpen(false)}
                onNavigate={handleNavigate}
                isFirst={currentNFTIdx === 0}
                isLast={currentNFTIdx === validNFTs.length - 1}
                isLoading={isLoadingDetails}
            />
        </Box>
    );
}

export default Gallery;