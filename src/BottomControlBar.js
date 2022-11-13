import {
    AppBar, Avatar,
    Badge,
    BottomNavigation,
    BottomNavigationAction,
    Box,
    Chip,
    Divider,
    IconButton,
    Stack,
} from '@mui/material';
import AlignHorizontalLeftIcon from '@mui/icons-material/AlignHorizontalLeft';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import PublishedWithChangesIcon from '@mui/icons-material/PublishedWithChanges';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import DoubleArrowIcon from '@mui/icons-material/DoubleArrow';
import {useEffect, useRef, useState} from 'react';
import {useDrop} from 'react-dnd';
import {DragTypes} from './Constants';
import TimeSelector from './TimeSelector';


export function BottomControlBar({
    onViewChange,
    addTurnaroundToWatchlist,
    view,
    gateConfig,
    forwardWindow,
    backwardWindow,
    setForwardWindow,
    setBackwardWindow,
    modifiedTurnarounds,
    numberOnWatchlist,
    onViewChanges,
    onReset,
}) {
    const rippleRef = useRef();

    const [showChanges, setShowChanges] = useState(false);

    const [{isOver}, dropRef] = useDrop(() => ({
        accept: DragTypes.FLIGHT,
        drop: (item) => {
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

            <Box
                sx={{
                    display: 'block',
                    position: 'absolute',
                    left: '40px',
                    top: '50%',
                    width: '25%',
                    transform: 'translateY(-50%)'}}>
                <TimeSelector
                    forwardWindow={forwardWindow}
                    backwardWindow={backwardWindow}
                    setForwardWindow={setForwardWindow}
                    setBackwardWindow={setBackwardWindow}></TimeSelector>
            </Box>
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
                <div
                    hidden={!showChanges}
                    style={{
                        position: 'absolute',
                        right: '10px',
                        top: '-10px',
                        transform: 'translateY(-100%)',
                    }}>
                    <Stack
                        divider={<Divider flexItem />}
                        spacing={1}>
                        {Object.entries(modifiedTurnarounds).map(([k, v]) => {
                            return (
                                <Stack
                                    key={k}
                                    direction="row"
                                    alignItems="center"
                                    spacing={1}>
                                    <Chip
                                        variant="outlined"
                                        avatar={<Avatar>{gateConfig[v.previous.pier]['name']}</Avatar>}
                                        label={gateConfig[v.previous.pier]['stands'][v.previous.stand]['name']} />
                                    <DoubleArrowIcon color="primary"></DoubleArrowIcon>
                                    <Chip
                                        color="secondary"
                                        avatar={<Avatar>{gateConfig[v.pier]['name']}</Avatar>}
                                        label={gateConfig[v.pier]['stands'][v.stand]['name']} />
                                </Stack>
                            );
                        })}
                    </Stack>

                </div>


                <IconButton
                    size="large"
                    disabled={numberOfUnsavedChanges === 0}
                    onClick={onReset()}>
                    <DeleteSweepIcon/>
                </IconButton>
                <IconButton
                    size="large"
                    onMouseOver={() => {
                        if (numberOfUnsavedChanges > 0) {
                            setShowChanges(true);
                            onViewChanges(true);
                        }
                    }}
                    onMouseOut={() => {
                        setShowChanges(false);
                        onViewChanges(false);
                    }}
                    disabled={numberOfUnsavedChanges === 0}>
                    <Badge badgeContent={numberOfUnsavedChanges} color="secondary">
                        <PublishedWithChangesIcon/>
                    </Badge>
                </IconButton>

            </Box>
        </AppBar>
    );
}

export default BottomControlBar;
