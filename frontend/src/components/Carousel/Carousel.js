import React, { useEffect, useState } from "react"

import { Paper, ImageList, ImageListItem } from "@mui/material"

import CarouselIndicators from "./CarouselIndicators"
import CarouselCard from "./CarouselCard"

import useHorizontalScroll from "../../utils/useHorizontalScroll"

const drawerWidth = 220
const eventListMargin = 40
const indicatorScrollAmount = 320

export default function Carousel({ events, eventClick, eventClickView }) {
    const scrollRef = useHorizontalScroll()

    const [paperWidth, setPaperWidth] = useState(window.innerWidth - drawerWidth - eventListMargin)

    useEffect(() => {
        function handleWindowResize() {
            setPaperWidth(window.innerWidth - drawerWidth - eventListMargin)
        }

        window.addEventListener('resize', handleWindowResize);

        return () => {
            window.removeEventListener('resize', handleWindowResize);
        };
    }, [])


    return (
        <>
            <Paper sx={{ width: `${paperWidth}px` }} elevation={0}>
                <ImageList
                    sx={{
                        gridAutoFlow: "column",
                        gridTemplateColumns: "repeat(auto-fill,minmax(320px,1fr)) !important",
                        gridAutoColumns: "minmax(320px, 1fr)",
                    }}
                    ref={scrollRef}
                >
                    {events.map((event) => (
                        <ImageListItem key={event.EventID}>
                            <CarouselCard event={event} eventClick={eventClick} eventClickView={eventClickView}/>
                        </ImageListItem>
                    ))}
                </ImageList>
            </Paper>

        </>
    )
}