import {createTheming} from '@callstack/react-theme-provider';

const DefaultTheme = {
    primaryColor: '#141251',
    secondaryColor: '#AA3191',
    tertiaryColor: '#FF8FB2',
    textColor: '#000000',
    secondaryTextColor: '#DDDDDD',
    lightTextColor: '#FFFFFF',
    highlightColor: '#FEC700',
};

export const {ThemeProvider, useTheme} = createTheming(DefaultTheme);
