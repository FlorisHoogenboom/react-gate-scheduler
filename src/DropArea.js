import React from 'react';
import {useDrop} from 'react-dnd';

import {DragTypes} from './Constants';
import {useTheme} from './theming';


function DropArea({
    style,
    text,
    ...props
}) {
    const theme = useTheme();

    const [{canDrop, isOver}, dropRef] = useDrop(() => ({
        accept: DragTypes.FLIGHT,
        drop: (item, monitor) => {
            console.log(item)
        },
        collect: (monitor) => ({
            canDrop: !!monitor.canDrop(),
            isOver: !!monitor.isOver(),
        }),

    }));

    let rootStyle = {
        border: '3px dashed',
        borderColor: theme.primaryColor,
        height: '100%',
        width: '100%',
        textAlign: 'center',
        display: 'table',
    };

    const textStyle = {
        display: 'table-cell',
        verticalAlign: 'middle',
    };

    if (isOver) {
        rootStyle = {
            ...rootStyle,
            backgroundColor: theme.highlightColor,
        };
    }

    return (
        <div
            style={{...rootStyle, ...style}}
            ref={dropRef}>
            <span style={textStyle}>{text}</span>
        </div>
    );
}

export default DropArea;
