import {useState} from 'react';
import {experimentalStyled as styled} from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import {
    Backdrop,
    CircularProgress,
    Dialog,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Link,
    Typography
} from "@mui/material";
import {QueryClient, QueryClientProvider, useQuery} from "react-query";
import {ReactQueryDevtools} from "react-query/devtools";
import axios from "axios";
import './App.css'

const Item = styled(Paper)(({theme}) => ({
    textAlign: 'center',
    width: '375px',
    height: '375px', display: "flex",
    flexDirection: "column",
    justifyContent: "center"
}));

const queryClient = new QueryClient();

export default function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <Gallery/>
        </QueryClientProvider>
    );
}

function Gallery() {
    const [open, setOpen] = useState(false);
    const [currentNFT, setCurrentNFT] = useState([]);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const {isLoading, error, data, isFetching} = useQuery("NFTRepo", () =>
        axios.get(
            "https://api.opensea.io/api/v1/assets?format=json"
        ).then((res) => res.data)
    );

    if (isLoading) return (<Backdrop
        sx={{color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1}}
        open={open}
    >
        <CircularProgress color="inherit"/>
    </Backdrop>);

    if (error) return "An error has occurred: " + error.message;
    // console.log(data.assets.name)
    return (
        <Box sx={{flexGrow: 1}}>
            <br/>
            <Typography variant="h2" component="div" gutterBottom align={'center'}>
                <strong>Menez NFT Gallery</strong>
            </Typography>
            <Grid container spacing={{xs: 1, md: 1}} columns={{xs: 2, sm: 4, md: 10}} justifyContent={'center'}>
                {data?.assets?.map((_, index) => (
                    <Grid item key={index}>
                        <Item elevation={0} direction="column">
                            <div id="grow">
                                <div className="ml-4 imgList">
                                    <Link onClick={handleOpen}><img src={data?.assets[index].image_url}/></Link>
                                    <div className="imgText justify-content-center m-auto">
                                        <h2>{data?.assets[index]?.name}</h2>
                                    </div>
                                </div>
                                <svg xmlns="http://www.w3.org/2000/svg">
                                    <filter id="blur1">
                                        <feGaussianBlur stdDeviation="3"/>
                                    </filter>
                                </svg>
                            </div>
                        </Item>
                    </Grid>
                ))}
            </Grid>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="nft_title"
                aria-describedby="nft_description"
            >
                <DialogTitle id="nft_dialog_title">
                    {"NFT Title"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="nft-description">
                        NFT Info here
                    </DialogContentText>
                </DialogContent>
            </Dialog>
            <ReactQueryDevtools initialIsOpen/>
        </Box>
    );
}
