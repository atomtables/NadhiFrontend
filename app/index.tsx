import "./global.css";
import {useState} from "react";
import NoFlood from "./noFlood";
import YesFlood from "./yesFlood";
import PossibleFlood from "./possibleFlood";
import PastFlood from "./pastFlood";

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
