import {useEffect, useState} from 'react';
import {experimentalStyled as styled} from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import {
    Alert, CircularProgress,
    Dialog,
    DialogContent,
    DialogTitle,
    IconButton,
    LinearProgress,
    Link,
    Typography,
    useMediaQuery,
    useTheme
} from "@mui/material";
import {QueryClient, QueryClientProvider, useQuery} from "react-query";
import {ReactQueryDevtools} from "react-query/devtools";
import axios from "axios";
import './App.css'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import LazyLoad from 'react-lazyload';


const NFT = styled(Paper)(() => ({
    textAlign: 'center',
    height: '350px', width: '350px',
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
}));

const queryClient = new QueryClient();

export default function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <Gallery/>
        </QueryClientProvider>
    );
}

function useNFTs() {
    return useQuery("NFTData", async () => {
        const {data} = await axios.get(
            "https://api.opensea.io/api/v1/assets?collection_slug=boredapeyachtclub"
        );
        return data;
    });
}

function Gallery() {
    const [open, setOpen] = useState(false);
    const [currentNFT, setCurrentNFT] = useState([]);
    const [currentNFTIdx, setCurrentNFTIdx] = useState(0);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
    const {isLoading, data, error, isFetching} = useNFTs();

    useEffect(() => {
        if (currentNFTIdx === Number(data?.assets.length)) {
            setCurrentNFTIdx(0);
        }
        if (currentNFTIdx >= 0) {
            setCurrentNFT(data?.assets[currentNFTIdx]);
        } else {
            setCurrentNFTIdx(0);
        }
    }, [currentNFTIdx, data?.assets]);

    if (isLoading || isFetching) {
        return (
            <LinearProgress/>
        );
    }

    if (error) {
        return (<Alert severity="error">{error.message}</Alert>)
    }
    // console.log(currentNFTIdx)
    return (
        <Box sx={{flexGrow: 1}}>
            <br/>
            <Typography variant="h2" component="div" gutterBottom align={'center'}>
                <strong>NFT Gallery</strong>
            </Typography>
            <Grid container spacing={{xs: 1, md: 1}} columns={{xs: 2, sm: 4, md: 10}} justifyContent={'center'}>
                {!isLoading && data?.assets.map((_, index) => (
                    <Grid item key={index}>
                        <NFT elevation={0} direction="column">
                            <div id="zoom_img">
                                <div className="ml-4 imgList" onClick={handleOpen}>
                                    <Link onClick={() => setCurrentNFT(data?.assets[index])}>
                                        <LazyLoad height={350} placeholder={<CircularProgress />} once key={index} >
                                        <img
                                            onClick={() => setCurrentNFTIdx(index)}
                                            src={data?.assets[index]?.image_url} alt={data?.assets[index]?.name}
                                            loading={'lazy'}/>
                                        </LazyLoad>
                                    </Link>
                                    <div className="imgText justify-content-center m-auto">
                                        <h2>BAYC #{data?.assets[index]?.token_id}</h2>
                                    </div>
                                </div>
                                <svg xmlns="http://www.w3.org/2000/svg">
                                    <filter id="blur1">
                                        <feGaussianBlur stdDeviation="3"/>
                                    </filter>
                                </svg>
                            </div>
                        </NFT>
                    </Grid>
                ))}
            </Grid>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="nft_title"
                aria-describedby="nft_description"
                fullWidth={true}
                maxWidth={'lg'}
                fullScreen={fullScreen}
            >
                <DialogTitle id="nft_dialog_title">
                    BAYC #{currentNFT?.token_id}
                </DialogTitle>
                <DialogContent>
                    <Typography component="div" gutterBottom align={'center'}>
                        <Link href={currentNFT?.permalink} target={'_blank'}>
                            <LazyLoad>
                            <img src={currentNFT?.image_url} alt={currentNFT?.token_id}/>
                            </LazyLoad>
                        </Link>
                        <br/>
                        <br/>
                        <Grid container rowSpacing={1} columnSpacing={{xs: 1, sm: 2, md: 3}}>
                            <Grid item xs={6}>
                                <IconButton aria-label="previous" onClick={() => setCurrentNFTIdx(currentNFTIdx - 1)}>
                                    <ArrowBackIosNewIcon/>
                                </IconButton>
                            </Grid>
                            <Grid item xs={6}>
                                <IconButton aria-label="previous" onClick={() => setCurrentNFTIdx(currentNFTIdx + 1)}>
                                    <ArrowForwardIosIcon/>
                                </IconButton><br/>
                            </Grid>
                        </Grid>
                    </Typography> <br/>

                    <Typography component="div" gutterBottom variant={'h5'} justifyContent={'center'}
                                textAlign={'center'}>
                        Last Sold Price: {(Number(currentNFT?.last_sale?.total_price) / 1e18).toFixed(2)} ETH /
                        ${(Number(currentNFT?.last_sale?.payment_token?.usd_price) * (Number(currentNFT?.last_sale?.total_price) / 1e18)).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</Typography>
                </DialogContent>
            </Dialog>
            <ReactQueryDevtools initialIsOpen/>
        </Box>
    );
}
