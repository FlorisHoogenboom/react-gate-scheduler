const rootStyle = {
    height: "100%",
    backgroundColor: "red"
}

function Turnaround({style, inboundFlight, outboundFlight, ...props}) {
    return (
        <div
            style={{...rootStyle, ...style}}
            draggable>
            {inboundFlight.flightDesignator}/{outboundFlight.flightDesignator}
        </div>
    );
}

export default Turnaround;
