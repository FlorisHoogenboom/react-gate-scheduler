import {AppBar, BottomNavigation, BottomNavigationAction} from '@mui/material';
import AlignHorizontalLeftIcon from '@mui/icons-material/AlignHorizontalLeft';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import {useEffect, useRef} from "react";
import {useDrop} from "react-dnd";
import {DragTypes} from "./Constants";

export function BottomControlBar({
    onViewChange,
    addTurnaroundToWatchlist,
    view,
    ...props
}){

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

    return <AppBar position="fixed" color="primary" sx={{top: 'auto', bottom: 0}}>
        <BottomNavigation
            onChange={onViewChange}
            value={view}
            showLabels>
            <BottomNavigationAction
                value="full"
                label="Full view"
                icon={<AlignHorizontalLeftIcon/>}/>
            <BottomNavigationAction
                ref={dropRef}
                value="watchlist"
                label="Watchlist"
                icon={<NotificationsActiveIcon/>}
                touchRippleRef={rippleRef}/>
        </BottomNavigation>
    </AppBar>;
}

export default BottomControlBar;
