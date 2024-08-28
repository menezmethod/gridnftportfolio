import React from 'react';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Link from '@mui/material/Link';
import NFTImage from './NFTImage';

const NFT = styled(Paper)(() => ({
    textAlign: 'center',
    height: '350px', width: '350px',
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
}));

const NFTCard = ({ nft, onClick }) => (
    <NFT elevation={0}>
        <div id="zoom_img">
            <div className="ml-4 imgList" onClick={onClick}>
                <Link>
                    <NFTImage src={nft.image_url || nft.display_image_url} alt={nft.name} />
                </Link>
            </div>
        </div>
    </NFT>
);

export default NFTCard;