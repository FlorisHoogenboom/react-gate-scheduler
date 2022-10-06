const rootStyle = {
    height: "100%",
    backgroundColor: "#AA3191"
}

function Turnaround({style, inboundFlight, outboundFlight, sibtMargin, sobtMargin, ...props}) {
    let computedStyle;
    if (sibtMargin && sobtMargin) {
        computedStyle = {
            ...rootStyle,
            ...{
                left: sibtMargin,
                right: sobtMargin,
                position: "absolute"
            }
        }
    } else {
        computedStyle = {
            ...rootStyle,
            ...{
                width: "100%"
            }
        };
    }

    return (
        <div
            style={{...computedStyle, ...style}}
            draggable>
            {inboundFlight.flightDesignator}/{outboundFlight.flightDesignator}
        </div>
    );
}

export default Turnaround;
