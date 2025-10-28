import DataBox from '@/app/components/DataBox';
import Page from '@/app/components/Page';
import { Text } from "react-native";

export default function NoFlood({setFloodLevel}: {setFloodLevel: (level: string) => void }) {
    return (
        <Page status={"No Flood Detected"}>
            <DataBox data={"6-7"} desc={"Inches of Rain"} />
            <DataBox data={"6-7"} desc={"Inches of Rain"} />
            <DataBox data={"6-7"} desc={"Inches of Rain"} />
            <Text className="text-base text-gray-400 mb-2.5" onPress={() => setFloodLevel("yesFlood")}>Simulate Flooding</Text>
        </Page>
    );
}