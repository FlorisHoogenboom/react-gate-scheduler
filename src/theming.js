import {createTheme} from '@mui/material/styles';


export const theme = createTheme({
    palette: {
        primary: {
            // light: '#94B0EA',
            main: '#141251',
            dark: '#141251',
            // contrastText: will be calculated to contrast with palette.primary.main
        },
        secondary: {
            light: '#FF8FB2',
            main: '#AA3191',
            // dark: will be calculated from palette.secondary.main,
            // contrastText: '#ffcc00',
        },
        // Used by `getContrastText()` to maximize the contrast between
        // the background and the text.
        contrastThreshold: 3,
        // Used by the functions below to shift a color's luminance by approximately
        // two indexes within its tonal palette.
        // E.g., shift from Red 500 to Red 300 or Red 700.
        tonalOffset: 0.5,
    },
});
