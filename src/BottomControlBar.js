import {AppBar, Badge, BottomNavigation, BottomNavigationAction, Box, IconButton} from '@mui/material';
import AlignHorizontalLeftIcon from '@mui/icons-material/AlignHorizontalLeft';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import PublishedWithChangesIcon from '@mui/icons-material/PublishedWithChanges';
import {useEffect, useRef} from 'react';
import {useDrop} from 'react-dnd';
import {DragTypes} from './Constants';
import {useTheme} from '@mui/material/styles';

export function BottomControlBar({
    onViewChange,
    addTurnaroundToWatchlist,
    view,
    modifiedTurnarounds,
    numberOnWatchlist,
    ...props
}){
    const theme = useTheme();

    const rippleRef = useRef();

    const [{isOver}, dropRef] = useDrop(() => ({
        accept: DragTypes.FLIGHT,
        drop: (item, monitor) => {
            addTurnaroundToWatchlist(item.turnaroundId);
        },
        collect: (monitor) => ({
            isOver: !!monitor.isOver(),
        }),

    }));

    useEffect(() => {
        if (isOver) {
            rippleRef.current && rippleRef.current.start();
        } else {
            rippleRef.current && rippleRef.current.stop();
        }
    }, [isOver]);

    const numberOfUnsavedChanges = Object.keys(modifiedTurnarounds).length;

    return (
        <AppBar
            position="fixed"
            color="primary"
            sx={{top: 'auto', bottom: 0}}>
            <BottomNavigation
                onChange={onViewChange}
                value={view}
                showLabels
                sx={{flexGrow: 1}}
            >
                <BottomNavigationAction
                    value="full"
                    label="Full view"
                    icon={<AlignHorizontalLeftIcon/>}/>
                <BottomNavigationAction
                    ref={dropRef}
                    value="watchlist"
                    label="Watchlist"
                    icon={
                        <Badge badgeContent={numberOnWatchlist} color="secondary">
                            <NotificationsActiveIcon/>
                        </Badge>
                    }
                    touchRippleRef={rippleRef}/>
            </BottomNavigation>

            <Box
                sx={{
                    display: 'block',
                    position: 'absolute',
                    right: '15px',
                    top: '50%',
                    transform: 'translateY(-50%)'}}>
                <IconButton
                    size="large"
                    aria-label="show 17 new notifications"
                    disabled={!!!numberOfUnsavedChanges || numberOfUnsavedChanges === 0}>
                    <Badge badgeContent={numberOfUnsavedChanges} color="secondary">
                        <PublishedWithChangesIcon/>
                    </Badge>
                </IconButton>

            </Box>
        </AppBar>
    );
}

export default BottomControlBar;
