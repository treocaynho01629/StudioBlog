import { useCallback } from "react";
import { Box, Zoom, Fab } from "@mui/material";
import { KeyboardArrowUp } from "@mui/icons-material";
import useScrollTrigger from "@mui/material/useScrollTrigger";

const styledFab = {
    color: 'white', 
    backgroundColor: '#0f3e3c',
    '&:hover': {
        backgroundColor: '#387e5d',
    },

    '&:focus': {
        border: 'none',
        outline: 'none'
    }
}

const ScrollToTop = (props) => {
    const { window: propWindow } = props;

    const trigger = useScrollTrigger({
        disableHysteresis: true,
        threshold: 100,
        target: propWindow ? window() : undefined,
    });

    const scrollToTop = useCallback(() => {
        window.scrollTo({ top: 0, behavior: "smooth" })
    }, []);

    return (
        <Zoom in={trigger}>
            <Box
                role="presentation"
                sx={{
                    position: "fixed",
                    bottom: 26,
                    right: 26,
                    zIndex: 99,
                }}
                unmountOnExit
            >
                <Fab
                    onClick={scrollToTop}
                    size="medium"
                    aria-label="scroll to top"
                    sx={styledFab}
                >
                    <KeyboardArrowUp sx={{ fontSize: 30 }} />
                </Fab>
            </Box>
        </Zoom>
    )
}

export default ScrollToTop