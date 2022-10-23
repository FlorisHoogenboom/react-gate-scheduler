
import {useTheme} from '@mui/material/styles';
import {Card, Divider, Stack} from '@mui/material';

function Pier({
    name,
    children,
    ...props
}) {
    const theme = useTheme();

    const pierHeaderStyle = {
        width: '100%',
        padding: '10px',
        boxSizing: 'border-box',
        fontWeight: 'bold',
        fontSize: '20px',
        verticalAlign: 'middle',
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
    };

    return (
        <Card>
            <div style={pierHeaderStyle}>{name}</div>
            <Stack
                divider={<Divider flexItem />}
                spacing={0}>
                {children}
            </Stack>
        </Card>
    );
}

export default Pier;
