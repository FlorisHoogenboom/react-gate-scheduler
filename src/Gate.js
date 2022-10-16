import React from 'react';
import {useDrop} from 'react-dnd';

import {DragTypes} from './Constants';
import {useTheme} from './theming';


function getFractionOfWindow(
    startTime, backwardWindowInSeconds,
    forwardWindowInSeconds, timestamp,
) {
    const totalWindowInMs = (backwardWindowInSeconds + forwardWindowInSeconds) * 1000;
    timestamp = new Date(timestamp);
    startTime = new Date(startTime);
    startTime.setSeconds(startTime.getSeconds() - backwardWindowInSeconds);

    return (timestamp - startTime) / totalWindowInMs;
}

function Gate({
    startTime,
    backwardWindowInSeconds,
    forwardWindowInSeconds,
    pierId,
    standId,
    standName,
    dropTurnaroundHandler,
    style,
    children,
    ...props
}) {
    const theme = useTheme();

    const [{canDrop, isOver}, dropRef] = useDrop(() => ({
        accept: DragTypes.FLIGHT,
        drop: (item, monitor) => {
            dropTurnaroundHandler(item.turnaroundId, pierId, standId);
        },
        collect: (monitor) => ({
            canDrop: !!monitor.canDrop(),
            isOver: !!monitor.isOver(),
        }),

    }));

    const rootStyle = {
        width: '100%',
        height: '40px',
        display: 'flex',
        boxSizing: 'border-box',
        position: 'relative',
    };

    let highlightRootStyle = {};

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
        backgroundColor: theme.secondaryColor,
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

    const currentTimeBarStyle = {
        height: '100%',
        position: 'absolute',
        borderLeft: '2px dashed #000000',
        left: (
            getFractionOfWindow(startTime, backwardWindowInSeconds, forwardWindowInSeconds, startTime) * 100
        ).toFixed(2) + '%',
    };


    if (canDrop && isOver) {
        highlightRootStyle = {
            backgroundColor: theme.highlightColor,
        };
    }

    return (
        <div
            ref={dropRef}
            style={{
                ...rootStyle,
                ...style,
                ...highlightRootStyle,
            }}>
            <div style={labelStyle}>
                {standName}
            </div>

            <div style={timelineStyle}>
                <div style={innerTimelineStyle}>
                    {!!children && children.map((child) => {
                        const sibt = child.props.inboundFlight.sbt;
                        const sobt = child.props.outboundFlight.sbt;
                        const left = (
                            getFractionOfWindow(startTime, backwardWindowInSeconds, forwardWindowInSeconds, sibt) * 100
                        ).toFixed(2) + '%';
                        const right = (
                            100 -
                            getFractionOfWindow(startTime, backwardWindowInSeconds, forwardWindowInSeconds, sobt) * 100
                        ).toFixed(2) + '%';

                        return React.cloneElement(
                            child,
                            {sibtMargin: left, sobtMargin: right},
                        );
                    })}
                </div>
            </div>

            <div style={currentTimeBarStyle}></div>

        </div>
    );
}

export default Gate;
