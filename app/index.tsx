import {useState} from "react";
import NoFlood from "./landingStates/noFlood";
import YesFlood from "./landingStates/yesFlood";
import PossibleFlood from "./landingStates/possibleFlood";
import PastFlood from "./landingStates/pastFlood";

export default function Index() {
    const [floodLevel, setFloodLevel] = useState("noFlood");

    if (floodLevel === "noFlood") {
        return (
            <NoFlood floodLevel={floodLevel} setFloodLevel={setFloodLevel} />
        );
    } else if (floodLevel === "yesFlood") {
        return (
            <YesFlood floodLevel={floodLevel} setFloodLevel={setFloodLevel} />
        );
    } else if (floodLevel === "possibleFlood") {
        return (
            <PossibleFlood floodLevel={floodLevel} setFloodLevel={setFloodLevel} />
        );
    } else if (floodLevel === "pastFlood") {
        return (
            <PastFlood floodLevel={floodLevel} setFloodLevel={setFloodLevel} />
        )
    }
    
}
