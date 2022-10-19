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
import {FormControl, FormControlLabel, FormGroup, FormLabel, Switch} from "@mui/material";

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
                <div>
                    <div style={{borderBottom: '10px solid #000000'}}>
                        <FormControl component="fieldset">
                            <FormGroup aria-label="position" row>
                                <FormControlLabel
                                    value="start"
                                    control={<Switch color="primary" />}
                                    label="Show watchlist only"
                                    labelPlacement="start"
                                />
                            </FormGroup>
                        </FormControl>
                    </div>
                    <div>
                        <div style={{height: '100px', padding: '20px', boxSizing: 'border-box'}}>
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
