import { useState } from "react";
import {Text, View} from "react-native";
import Page from '@/app/components/Page';
import DataBox from '@/app/components/DataBox';
import NavigationBar from '@/app/components/NavigationBar';
import VolunteerFormOverlay from '@/app/components/VolunteerFormOverlay';
import Icon from '@/app/components/Icon';
import add from "@/assets/icons/add.png";
import volunteer from "@/assets/icons/volunteer.png";


export default function PastFlood({setFloodLevel}: {setFloodLevel: (level: string) => void }) {
    const [ pageStatus, setPageStatus ] = useState("main");
    const formVisible = pageStatus === "form";
    const volunteerVisible = pageStatus === "volunteer";

    const handleVolunteerVisibility = () => {
        if (pageStatus === "main") setPageStatus("volunteer");
        else setPageStatus("main");
    }

    const handleFormVisibility = () => {
        if (pageStatus === "main") setPageStatus("form");
        else setPageStatus("main");
    }

    return (
        <>
            <Page status={"Recent Flood. Volunteers Needed"}>
                <DataBox data={"6-7"} desc={"Inches of Rain"} />
                <DataBox data={"6-7"} desc={"Inches of Rain"} />
                <DataBox data={"6-7"} desc={"Inches of Rain"} />
                <DataBox data={"6-7"} desc={"Inches of Rain"} />
                <DataBox data={"6-7"} desc={"Inches of Rain"} />
                <DataBox data={"6-7"} desc={"Inches of Rain"} />
                <DataBox data={"6-7"} desc={"Inches of Rain"} />
                <DataBox data={"6-7"} desc={"Inches of Rain"} />
                <DataBox data={"6-7"} desc={"Inches of Rain"} />
                <Text className="text-lg mb-2.5" onPress={() => setFloodLevel("noFlood")}>Simulate No Flooding</Text>
            </Page>
            <NavigationBar>
                <Icon image={volunteer} size={32} onPress={handleVolunteerVisibility} />
                <Icon image={add} size={32} onPress={handleFormVisibility} />
            </NavigationBar>
            <VolunteerFormOverlay isVisible={formVisible} closeOverlay={handleFormVisibility} />
        </>
    );
}