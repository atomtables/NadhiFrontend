import { useState } from "react";
import NoFlood from "./landingStates/noFlood";
import PastFlood from "./landingStates/pastFlood";
import PossibleFlood from "./landingStates/possibleFlood";
import YesFlood from "./landingStates/yesFlood";

export default function Index() {
    const [floodLevel, setFloodLevel] = useState("noFlood");

    if (floodLevel === "noFlood") {
        return (
            <NoFlood setFloodLevel={setFloodLevel} />
        );
    } else if (floodLevel === "yesFlood") {
        return (
            <YesFlood setFloodLevel={setFloodLevel} />
        );
    } else if (floodLevel === "possibleFlood") {
        return (
            <PossibleFlood setFloodLevel={setFloodLevel} />
        );
    } else if (floodLevel === "pastFlood") {
        return (
            <PastFlood setFloodLevel={setFloodLevel} />
        )
    }
    
}
