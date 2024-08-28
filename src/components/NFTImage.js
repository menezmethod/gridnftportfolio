import React from 'react';
import LazyLoad from 'react-lazyload';
import { CircularProgress } from "@mui/material";

const NFTImage = ({ src, alt }) => (
    <LazyLoad height={350} placeholder={<CircularProgress />} once>
        <img src={src} alt={alt} loading='lazy'/>
    </LazyLoad>
);

export default NFTImage;