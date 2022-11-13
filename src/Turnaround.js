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
    renderLight,
    hasChanged,
}) {
    const theme = useTheme();

    let bgColorDark;
    let bgColorMain;
    if (!!!hasChanged) {
        bgColorMain = theme.palette.secondary.light;
        bgColorDark = theme.palette.secondary.main;
    } else {
        bgColorDark= theme.palette.error.main;
        bgColorMain = theme.palette.warning.light;
    }

    const rootStyle = {
        height: '100%',
        paddingLeft: '10px',
        verticalAlign: 'middle',
        borderRadius: '25px',
        transform: 'translate(0, 0)', // Needed for proper rendering
        fontSize: '12px',
        background: bgColorMain,
        color: theme.palette.secondary.contrastText,
        mixBlendMode: 'color-burn',
        boxSizing: 'border-box',
    };

    const [{isDragging}, drag] = useDrag(() => ({
        type: DragTypes.FLIGHT,
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging(),
        }),
        canDrag: () => {
            return fractionDone === 0 && !!!renderLight;
        },
        item: {
            turnaroundId: turnaroundId,
            ibt: new Date(inboundFlight.sbt),
            obt: new Date(outboundFlight.sbt),
        },
    }), [fractionDone]);

    let computedStyle = rootStyle;

    if (sibtMargin && sobtMargin) {
        computedStyle = {
            ...computedStyle,
            ...{
                left: sibtMargin,
                right: sobtMargin,
                position: 'absolute',
            },
        };
    } else {
        computedStyle = {
            ...computedStyle,
            ...{
                width: '100%',
            },
        };
    }

    if (renderLight) {
        Object.assign(
            computedStyle,
            {
                background: '#FFFFFF',
                color: '#000000',
                border: `2px dashed ${theme.palette.primary.dark}`,
            },
        );
    }

    if (fractionDone && !renderLight) {
        const percentageDone = (fractionDone * 100).toFixed(5) + '%';
        computedStyle = {
            ...computedStyle,
            background: `linear-gradient(90deg, ${bgColorDark} ${percentageDone}, ${bgColorMain} ${percentageDone})`, // eslint-disable-line max-len
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
