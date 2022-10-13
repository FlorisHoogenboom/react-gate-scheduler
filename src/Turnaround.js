import {useDrag} from 'react-dnd';

import {DragTypes} from './Constants';


const rootStyle = {
    height: '100%',
    backgroundColor: '#AA3191',
};

function Turnaround({style, inboundFlight, outboundFlight, sibtMargin, sobtMargin, ...props}) {
    let computedStyle;

    const [{isDragging}, drag] = useDrag(() => ({
        type: DragTypes.FLIGHT,
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging(),
        }),
    }));

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
