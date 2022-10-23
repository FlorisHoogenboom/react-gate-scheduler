import {useDrag} from 'react-dnd';

import {DragTypes} from './Constants';
import {useTheme} from '@mui/material/styles';


function Turnaround({
    turnaroundId,
    inboundFlight,
    outboundFlight,
    sibtMargin,
    sobtMargin,
    fractionDone,
    ...props
}) {
    const theme = useTheme();

    const rootStyle = {
        height: '100%',
        paddingLeft: '10px',
        verticalAlign: 'middle',
        borderRadius: '25px',
        transform: 'translate(0, 0)', // Needed for proper rendering
        fontSize: '12px',
        background: theme.palette.secondary.light,
        color: theme.palette.secondary.contrastText,
    };

    const [{isDragging}, drag] = useDrag(() => ({
        type: DragTypes.FLIGHT,
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging(),
        }),
        canDrag: (monitor) => {
            return fractionDone === 0;
        },
        item: {turnaroundId},
    }), [fractionDone]);

    let computedStyle;

    if (sibtMargin && sobtMargin) {
        computedStyle = {
            ...rootStyle,
            ...{
                left: sibtMargin,
                right: sobtMargin,
                position: 'absolute',
            },
        };
    } else {
        computedStyle = {
            ...rootStyle,
            ...{
                width: '100%',
            },
        };
    }

    if (fractionDone) {
        const percentageDone = (fractionDone * 100).toFixed(5) + '%';
        computedStyle = {
            ...computedStyle,
            background: `linear-gradient(90deg, ${theme.palette.secondary.main} ${percentageDone}, ${theme.palette.secondary.light} ${percentageDone})`,
        };
    }


    return (
        <div
            ref={drag}
            style={{
                ...computedStyle,
                ...{opacity: isDragging ? 0.5 : 1},
            }}>
            {inboundFlight.flightDesignator}/{outboundFlight.flightDesignator}
        </div>
    );
}

export default Turnaround;
