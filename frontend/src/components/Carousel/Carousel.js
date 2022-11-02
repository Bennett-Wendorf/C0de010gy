import React, { useEffect, useRef, useState } from "react"

import { Paper, ImageList, ImageListItem } from "@mui/material"

import CarouselIndicators from "./CarouselIndicators"
import CarouselCard from "./CarouselCard"

const drawerWidth = 220
const eventListMargin = 40

export default function Carousel({ events }) {
    const listRef = useRef()

    const [paperWidth, setPaperWidth] = useState(window.innerWidth - drawerWidth - eventListMargin)

    useEffect(() => {
        function handleWindowResize() {
            setPaperWidth(window.innerWidth - drawerWidth - eventListMargin)
            console.log("window resized")
        }

        window.addEventListener('resize', handleWindowResize);

        return () => {
            window.removeEventListener('resize', handleWindowResize);
        };
    }, [])

    const [showScrollIndicatorLeft, setShowScrollIndicatorLeft] = useState(false);
    const [showScrollIndicatorRight, setShowScrollIndicatorRight] = useState(true);

    const handleIndicatorClick = (direction) => (event) => {
        const el = listRef.current
        const scrollMax = el.scrollWidth
        el.scrollTo({
            top: 0,
            left: direction === "left" ?
                Math.min(el.scrollLeft - el.offsetWidth, 0) :
                Math.max(el.scrollLeft + el.offsetWidth, scrollMax),
            behavior: "smooth"
        })
    }

    return (
        <>
            <Paper sx={{ width: `${paperWidth}px` }} elevation={0}>
                <ImageList
                    sx={{
                        gridAutoFlow: "column",
                        gridTemplateColumns: "repeat(auto-fill,minmax(320px,1fr)) !important",
                        gridAutoColumns: "minmax(320px, 1fr)",
                    }}
                >
                    {events.map((event) => (
                        <ImageListItem>
                            <CarouselCard event={event} />
                        </ImageListItem>
                    ))}
                </ImageList>
            </Paper>

            {/* <CarouselIndicators
                showLeft={showScrollIndicatorLeft}
                showRight={showScrollIndicatorRight}
                handleIndicatorClick={handleIndicatorClick}
            /> */}
        </>
    )
}