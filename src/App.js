import {useEffect, useState} from 'react';
import {
    DefaultBackwardWindowInSeconds,
    DefaultFowardWindowInSeconds,
    StartTime,
} from './Constants';

import {HTML5Backend} from 'react-dnd-html5-backend';
import {DndProvider} from 'react-dnd';

import {ThemeProvider} from './theming';
import GateChart from './GateChart';
import DropArea from './DropArea';

function App() {
    const [time, setTime] = useState(
        () => StartTime,
    );

    useEffect(() => {
        const interval = setInterval(() => {
            setTime((current) => {
                const result = new Date(current);
                result.setSeconds(result.getSeconds() + 60);
                return result;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    return (
        <ThemeProvider>
            <DndProvider backend={HTML5Backend}>
                <div style={{display: 'flex'}}>
                    <div style={{width: '100%'}}>
                        <div style={{width: '100%', height: '100px', padding: '20px', boxSizing: 'border-box'}}>
                            <DropArea
                                text="Add to watchlist"></DropArea>

                        </div>
                        <GateChart
                            startTime={time}
                            forwardWindowInSeconds={DefaultFowardWindowInSeconds}
                            backwardWindowInSeconds={DefaultBackwardWindowInSeconds}></GateChart>

                    </div>
                </div>
            </DndProvider>
        </ThemeProvider>
    );
}

export default App;
