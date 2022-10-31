import { Grid, ImageList } from "@mui/material";
import React, { useMemo, useRef, useState } from "react";
import PropTypes from "prop-types";
import HorizontalScrollIndicators from "./HorizontalScrollIndicators";
import CarouselTile from "./CarouselTile";

const rows = 1
const tileWidth = 135
const tileHeight = 205
const heightAllowance = 0

const gridListRootStyles = {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-around",
    overflow: "hidden",
    cursor: "pointer",
    position: "relative",
}

const gridListStyles = (theme) => ({
    flexWrap: "nowrap",
    // Promote into its own layer. Maintains high FPS at a memory cost
    transform: "translateZ(0)",

    height: ({ rows, tileHeight, heightAllowance }) =>
      getDimension(tileHeight, "md", heightAllowance) * rows,
    [theme.breakpoints.down("xl")]: {
      height: ({ rows, tileHeight, heightAllowance }) =>
        getDimension(tileHeight, "xl", heightAllowance) * rows,
    },
    [theme.breakpoints.down("lg")]: {
      height: ({ rows, tileHeight, heightAllowance }) =>
        getDimension(tileHeight, "lg", heightAllowance) * rows,
    },
    [theme.breakpoints.down("sm")]: {
      height: ({ rows, tileHeight, heightAllowance }) =>
        getDimension(tileHeight, "sm", heightAllowance) * rows,
    },
    [theme.breakpoints.down("xs")]: {
      height: ({ rows, tileHeight, heightAllowance }) =>
        getDimension(tileHeight, "xs", heightAllowance) * rows,
    },
})

const gridListContainerStyles = (theme) => ({
    height: ({ rows, tileHeight, heightAllowance }) =>
      `${getDimension(tileHeight, "md", heightAllowance) * rows}px !important`,
    [theme.breakpoints.only("xl")]: {
      height: ({ rows, tileHeight, heightAllowance }) =>
        `${
          getDimension(tileHeight, "xl", heightAllowance) * rows
        }px !important`,
    },
    [theme.breakpoints.only("lg")]: {
      height: ({ rows, tileHeight, heightAllowance }) =>
        `${
          getDimension(tileHeight, "lg", heightAllowance) * rows
        }px !important`,
    },
    [theme.breakpoints.only("sm")]: {
      height: ({ rows, tileHeight, heightAllowance }) =>
        `${
          getDimension(tileHeight, "sm", heightAllowance) * rows
        }px !important`,
    },
    [theme.breakpoints.only("xs")]: {
      height: ({ rows, tileHeight, heightAllowance }) =>
        `${
          getDimension(tileHeight, "xs", heightAllowance) * rows
        }px !important`,
    },
})

function getDimension(dim, breakpoint = "md", allowance = 0) {
  var value = dim.xs || dim;
  if (["sm", "md", "lg", "xl"].includes(breakpoint) && dim.sm) {
    value = dim.sm;
  }
  if (["md", "lg", "xl"].includes(breakpoint) && dim.md) {
    value = dim.md;
  }
  if (["lg", "xl"].includes(breakpoint) && dim.lg) {
    value = dim.lg;
  }
  if (breakpoint === "xl" && dim.xl) {
    value = dim.xl;
  }
  if (allowance > 0) {
    value += allowance;
  }
  return value;
}

export default function Carousel(props) {
  const {
    items,
    rows,
    imageUrlAttribute,
    imageAltAttribute,
    titleAttribute,
    handleTileClick,
    tileLink,
    component,
    showIndicators,
    style,
  } = props;

  const listRef = useRef();

  const [showScrollIndicatorLeft, setShowScrollIndicatorLeft] = useState(false);
  const [showScrollIndicatorRight, setShowScrollIndicatorRight] =
    useState(true);

  const indexes = useMemo(() => {
    const indexes = [];
    for (var i = 0; i < items.length; i++) {
      if (i % rows === 0) {
        indexes.push(i);
      }
    }
    return indexes;
  }, [items, rows]);

  const handleIndicatorClick = (direction) => (event) => {
    const el = listRef.current;
    const scrollMax = el.scrollWidth;
    el.scrollTo({
      top: 0,
      left:
        direction === "left"
          ? Math.min(el.scrollLeft - el.offsetWidth, 0)
          : Math.max(el.scrollLeft + el.offsetWidth, scrollMax),
      behavior: "smooth",
    });
  };

  return (
    <div sx={gridListRootStyles} style={style}>
      <ImageList
        ref={listRef}
        sx={gridListStyles}
        cols={1}
        onScroll={(event) => {
          if (event.target.scrollLeft > 0) {
            setShowScrollIndicatorLeft(true);
          } else {
            setShowScrollIndicatorLeft(false);
          }
          if (
            Math.ceil(event.target.scrollLeft) + event.target.offsetWidth >=
            event.target.scrollWidth
          ) {
            setShowScrollIndicatorRight(false);
          } else {
            setShowScrollIndicatorRight(true);
          }
        }}
      >
        {indexes.map((index) => (
          <Grid
            key={index}
            container
            spacing={1}
            direction="column"
            sx={gridListContainerStyles}
          >
            {[...Array(rows).keys()].map((row) => (
              <Grid item key={row}>
                {items[index + row] &&
                  (component ? (
                    component(items[index + row])
                  ) : (
                    <CarouselTile
                      item={items[index + row]}
                      imageUrlAttribute={imageUrlAttribute}
                      imageAltAttribute={imageAltAttribute}
                      titleAttribute={titleAttribute}
                      handleTileClick={handleTileClick}
                      tileLink={tileLink}
                    />
                  ))}
              </Grid>
            ))}
          </Grid>
        ))}
      </ImageList>

      {showIndicators && (
        <HorizontalScrollIndicators
          showLeft={showScrollIndicatorLeft}
          showRight={showScrollIndicatorRight}
          handleLeftClick={handleIndicatorClick("left")}
          handleRightClick={handleIndicatorClick("right")}
        />
      )}
    </div>
  );
}

Carousel.defaultProps = {
  rows: 1,
  handleTileClick: (item) => {},
  showIndicators: true,
};

Carousel.propTypes = {
  items: PropTypes.array.isRequired,
  rows: PropTypes.number,
  imageUrlAttribute: PropTypes.string,
  imageAltAttribute: PropTypes.string,
  titleAttribute: PropTypes.string.isRequired,
  handleTileClick: PropTypes.func,
  tileLink: PropTypes.func,
  component: PropTypes.func,
  showIndicators: PropTypes.bool,
  style: PropTypes.object,
};