import React from 'react'

import { Fade, Box, Fab } from "@mui/material"
import { NavigateBefore, NavigateNext } from "@mui/icons-material"

const appBarHeight = 64
const drawerWidth = 220
const cardHeight = 160
const topMargin = 20
const leftRightPadding = 15
const buttonHeight = 50

const scrollIndicatorLeftStyles = {
    position: "absolute",
    top: appBarHeight + topMargin + (cardHeight / 2) - (buttonHeight / 2),
    left: drawerWidth + leftRightPadding,
    padding: "4px",
    mr: 'auto',
}

const scrollIndicatorRightStyles = {
    position: "absolute",
    top: appBarHeight + topMargin + (cardHeight / 2) - (buttonHeight / 2),
    right: leftRightPadding,
    padding: "4px",
    ml: 'auto',
}

export default function CarouselIndicators({ showLeft, showRight, handleIndicatorClick}) {
    return (
        <Box sx={{ display: 'flex', flexAlignItems: 'center' }}>
            <Fade in={showLeft}>
                <Fab
                    sx={scrollIndicatorLeftStyles}
                    onClick={handleIndicatorClick("left")}
                    color='primary'
                    size='medium'
                >
                    <NavigateBefore />
                </Fab>
            </Fade>
            <Fade in={showRight}>
                <Fab
                    sx={scrollIndicatorRightStyles}
                    onClick={handleIndicatorClick("right")}
                    color='primary'
                    size='medium'
                >
                    <NavigateNext />
                </Fab>
            </Fade>
        </Box>
    )
}