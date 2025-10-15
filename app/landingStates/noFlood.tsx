import {Text, View} from "react-native";
import Page from '@/app/components/Page';
import DataBox from '@/app/components/DataBox';

export default function NoFlood({setFloodLevel}: {setFloodLevel: (level: string) => void }) {
    return (
        <Page status={"No Flood Detected"}>
            <DataBox data={"6-7"} desc={"Inches of Rain"} />
            <DataBox data={"6-7"} desc={"Inches of Rain"} />
            <DataBox data={"6-7"} desc={"Inches of Rain"} />
            <DataBox data={"6-7"} desc={"Inches of Rain"} />
            <DataBox data={"6-7"} desc={"Inches of Rain"} />
            <DataBox data={"6-7"} desc={"Inches of Rain"} />
            <DataBox data={"6-7"} desc={"Inches of Rain"} />
            <DataBox data={"6-7"} desc={"Inches of Rain"} />
            <DataBox data={"6-7"} desc={"Inches of Rain"} />
            <DataBox data={"6-7"} desc={"Inches of Rain"} />
            <DataBox data={"6-7"} desc={"Inches of Rain"} />
            <DataBox data={"6-7"} desc={"Inches of Rain"} />
            <DataBox data={"6-7"} desc={"Inches of Rain"} />
            <DataBox data={"6-7"} desc={"Inches of Rain"} />
            <DataBox data={"6-7"} desc={"Inches of Rain"} />
            <DataBox data={"6-7"} desc={"Inches of Rain"} />
            <DataBox data={"6-7"} desc={"Inches of Rain"} />
            <DataBox data={"6-7"} desc={"Inches of Rain"} />
            <DataBox data={"6-7"} desc={"Inches of Rain"} />
            <DataBox data={"6-7"} desc={"Inches of Rain"} />
            <DataBox data={"6-7"} desc={"Inches of Rain"} />
            <DataBox data={"6-7"} desc={"Inches of Rain"} />
            <DataBox data={"6-7"} desc={"Inches of Rain"} />
            <Text className="text-lg mb-2.5" onPress={() => setFloodLevel("yesFlood")}>Simulate Flooding</Text>
        </Page>
    );
}