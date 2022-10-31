import { ButtonBase, Fade } from "@mui/material";
import { NavigateBefore, NavigateNext } from "@material-ui/icons";
import React, { Fragment } from "react";
import PropTypes from "prop-types";

const scrollIndicatorLeftStyles = {
    position: "absolute",
    top: 0,
    left: 0,
    background: "rgba(70, 70, 70, 0.9)",
    color: "white",
    padding: "4px",
    height: "calc(100% - 6px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "5px",
}

const scrollIndicatorRightStyles = {
    position: "absolute",
    top: 0,
    right: 0,
    background: "rgba(70, 70, 70, 0.9)",
    color: "white",
    padding: "4px",
    height: "calc(100% - 6px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "5px",
}

export default function CarouselIndicator(props) {
  const { showLeft, showRight, handleLeftClick, handleRightClick } = props;

  return (
    <Fragment>
      <Fade in={showLeft}>
        <ButtonBase
          sx={scrollIndicatorLeftStyles}
          onClick={handleLeftClick}
        >
          <NavigateBefore />
        </ButtonBase>
      </Fade>
      <Fade in={showRight}>
        <ButtonBase
          sx={scrollIndicatorRightStyles}
          onClick={handleRightClick}
        >
          <NavigateNext />
        </ButtonBase>
      </Fade>
    </Fragment>
  );
}

CarouselIndicator.propTypes = {
  showLeft: PropTypes.bool,
  showRight: PropTypes.bool,
  handleLeftClick: PropTypes.func,
  handleRightClick: PropTypes.func,
};