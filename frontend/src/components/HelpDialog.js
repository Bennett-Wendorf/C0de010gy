import React, { useState } from "react";

import { IconButton, Tooltip, Button, Typography } from "@mui/material";
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from "@mui/material";

import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

export default function HelpDialog({ messages, usedInDialog }) {

    const [open, setOpen] = useState(false);

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <>
            <Tooltip title={'Help'} sx={usedInDialog ? { position: 'absolute', right: 15, top: 12, width: '3ch' } : { width: '3ch' }}>
                <IconButton aria-label="help" onClick={() => setOpen(true)}>
                    <HelpOutlineIcon color="primary"/>
                </IconButton>
            </Tooltip>

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Help</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {messages.map((message, index) => (
                            <Typography key={index} variant="body1">{message}</Typography>
                        ))}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">Close</Button>
                </DialogActions>
            </Dialog>
        </>
    )
}