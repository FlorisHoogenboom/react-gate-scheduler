import React from 'react';
import {useDrop} from 'react-dnd';

import {DragTypes} from './Constants';

const rootStyle = {
    width: '100%',
    height: '40px',
    display: 'flex',
    boxSizing: 'border-box',
    position: 'relative',
};

const labelStyle = {
    float: 'left',
    display: 'block',
    height: '100%',
    padding: '3px',
    boxSizing: 'border-box',
    borderRight: '1px solid black',
    userSelect: 'none',
    writingMode: 'vertical-lr',
    textAlign: 'center',
    backgroundColor: '#141251',
    color: '#FFFFFF',
};

const timelineStyle = {
    height: '100%',
    width: '100%',
    paddingTop: '10px',
    paddingBottom: '10px',
    boxSizing: 'border-box',
    position: 'relative',
};

const innerTimelineStyle = {
    position: 'relative',
    height: '100%',
    width: '100%',
    overflow: 'hidden',
};

function getFractionOfWindow(startTime, windowInSeconds, timestamp) {
    const windowInMs = windowInSeconds * 1000;
    timestamp = new Date(timestamp);

    return (timestamp - startTime) / windowInMs;
}

function Gate(
    {startTime, windowInSeconds, standName, style, children, ...props},
) {
    const [{canDrop, isOver}, dropRef] = useDrop(() => ({
        accept: DragTypes.FLIGHT,
        drop: (item, monitor) => {
            console.log(item);
        },
        collect: (monitor) => ({
            canDrop: !!monitor.canDrop(),
            isOver: !!monitor.isOver(),
        }),

    }));

    const getBackgroundColor = (canDrop, isOver) => {
        if (canDrop && isOver) {
            return '#fff1dd';
        }
    };

    return (
        <div
            ref={dropRef}
            style={{
                ...rootStyle,
                ...style,
                'backgroundColor': getBackgroundColor(canDrop, isOver),
            }}>
            <div style={labelStyle}>
                {standName}
            </div>

            <div style={timelineStyle}>
                <div style={innerTimelineStyle}>
                    {children.map((child) => {
                        const sibt = child.props.inboundFlight.sbt;
                        const sobt = child.props.outboundFlight.sbt;
                        const left = (
                            getFractionOfWindow(startTime, windowInSeconds, sibt) * 100
                        ).toFixed(0) + '%';
                        const right = (
                            100 - getFractionOfWindow(startTime, windowInSeconds, sobt) * 100
                        ).toFixed(0) + '%';

                        return React.cloneElement(
                            child,
                            {sibtMargin: left, sobtMargin: right},
                        );
                    })}
                </div>
            </div>

        </div>
    );
}

export default Gate;
