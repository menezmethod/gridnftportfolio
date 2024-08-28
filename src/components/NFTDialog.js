import React, { useState, useEffect } from 'react';
import { 
    Dialog, 
    DialogContent, 
    DialogTitle, 
    IconButton, 
    Link, 
    Typography, 
    DialogActions, 
    Grid,
    CircularProgress 
} from "@mui/material";
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import NFTImage from './NFTImage';
import TraitCard from './TraitCard';
import { formatPrice } from '../utils/formatPrice';
import { fetchEthPrice } from '../utils/fetchEthPrice';

const NFTDialog = ({ nft, open, onClose, onNavigate, isFirst, isLast, isLoading }) => {
    const [ethPrice, setEthPrice] = useState(null);

    useEffect(() => {
        const getEthPrice = async () => {
            const price = await fetchEthPrice();
            setEthPrice(price);
        };
        getEthPrice();
    }, [open]); // Fetch price when dialog opens

    const formatUsdPrice = (ethValue) => {
        if (!ethPrice) return 'Loading...';
        const usdValue = ethValue * ethPrice;
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(usdValue);
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            aria-labelledby="nft_title"
            aria-describedby="nft_description"
            fullWidth={true}
            maxWidth={'lg'}
        >
            <DialogTitle id="nft_dialog_title">
                BAYC #{nft?.identifier}
            </DialogTitle>
            <DialogContent>
                {isLoading ? (
                    <CircularProgress />
                ) : (
                    <>
                        <Typography component="div" gutterBottom align={'center'}>
                            <Link href={nft?.opensea_url} target={'_blank'}>
                                <NFTImage src={nft?.image_url || nft?.display_image_url} alt={nft?.identifier} />
                            </Link>
                        </Typography>
                        <Typography component="div" gutterBottom variant={'h5'} justifyContent={'center'} textAlign={'center'}>
                            {nft?.bestOffer?.price ? (
                                <>
                                    Best Offer: {formatPrice(nft.bestOffer.price.value, nft.bestOffer.price.decimals)} {nft.bestOffer.price.currency}
                                    <br />
                                    ({formatUsdPrice(parseFloat(formatPrice(nft.bestOffer.price.value, nft.bestOffer.price.decimals)))})
                                </>
                            ) : (
                                'No current offers available'
                            )}
                        </Typography>
                        {nft?.description && (
                            <Typography component="div" gutterBottom>
                                <strong>Description:</strong> {nft.description}
                            </Typography>
                        )}
                        {nft?.traits && nft.traits.length > 0 && (
                            <>
                                <Typography component="div" gutterBottom>
                                    <strong>Traits:</strong>
                                </Typography>
                                <Grid container spacing={2}>
                                    {nft.traits.map((trait, index) => (
                                        <Grid item xs={6} sm={4} md={3} key={index}>
                                            <TraitCard trait={trait} />
                                        </Grid>
                                    ))}
                                </Grid>
                            </>
                        )}
                    </>
                )}
            </DialogContent>
            <DialogActions sx={{ justifyContent: 'space-between', padding: '16px' }}>
                <IconButton 
                    onClick={() => onNavigate('prev')} 
                    disabled={isFirst}
                    sx={{
                        color: 'var(--primary-color)',
                        backgroundColor: 'rgba(0, 255, 255, 0.1)',
                        '&:hover': { backgroundColor: 'rgba(0, 255, 255, 0.2)' },
                        '&:disabled': { color: 'rgba(0, 255, 255, 0.3)', backgroundColor: 'transparent' }
                    }}
                >
                    <ArrowBackIosNewIcon />
                </IconButton>
                <IconButton 
                    onClick={() => onNavigate('next')} 
                    disabled={isLast}
                    sx={{
                        color: 'var(--primary-color)',
                        backgroundColor: 'rgba(0, 255, 255, 0.1)',
                        '&:hover': { backgroundColor: 'rgba(0, 255, 255, 0.2)' },
                        '&:disabled': { color: 'rgba(0, 255, 255, 0.3)', backgroundColor: 'transparent' }
                    }}
                >
                    <ArrowForwardIosIcon />
                </IconButton>
            </DialogActions>
        </Dialog>
    );
};

export default NFTDialog;