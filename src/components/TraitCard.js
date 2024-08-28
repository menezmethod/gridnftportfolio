import React from 'react';
import { Paper, Typography } from "@mui/material";

const TraitCard = ({ trait }) => (
    <Paper elevation={3} sx={{ p: 2, textAlign: 'center' }} className="trait-card">
        <Typography variant="subtitle2">{trait.trait_type}</Typography>
        <Typography variant="body2">{trait.value}</Typography>
    </Paper>
);

export default TraitCard;