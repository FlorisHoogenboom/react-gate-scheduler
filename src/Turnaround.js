import {useDrag} from 'react-dnd';

import {DragTypes} from './Constants';
import {useTheme} from '@mui/material/styles';


function Turnaround({style, turnaroundId, inboundFlight, outboundFlight, sibtMargin, sobtMargin, ...props}) {
    const theme = useTheme();

    const rootStyle = {
        height: '100%',
        paddingLeft: '10px',
        verticalAlign: 'middle',
        borderRadius: '25px',
        transform: 'translate(0, 0)', // Needed for proper rendering
        fontSize: '12px',
        backgroundColor: theme.palette.primary.light,
    };

    const [{isDragging}, drag] = useDrag(() => ({
        type: DragTypes.FLIGHT,
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging(),
        }),
        item: {turnaroundId},
    }));

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

    return (
        <div
            ref={drag}
            style={{
                ...computedStyle,
                ...style,
                ...{opacity: isDragging ? 0.5 : 1},
            }}>
            {inboundFlight.flightDesignator}/{outboundFlight.flightDesignator}
        </div>
    );
}

export default Turnaround;
