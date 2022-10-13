import GateChart from './GateChart';
import {ThemeProvider} from './theming';

function App() {
    return (
        <ThemeProvider>
            <div style={{display: 'flex'}}>
                <GateChart
                    startTime={new Date('2022-01-01T09:30:00+00:00')}
                    windowInSeconds={3600 * 2}></GateChart>
                <div style={{width: '250px'}}>
                    My Warnings pane!
                </div>
            </div>
        </ThemeProvider>
    );
}

export default App;
