import {Text, View} from "react-native";
import Page from '@/app/components/Page';
import DataBox from '@/app/components/DataBox';
import NavigationBar from '@/app/components/NavigationBar';

export default function PastFlood({setFloodLevel}: {setFloodLevel: (level: string) => void }) {
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
                <DataBox data={"6-7"} desc={"Inches of Rain"} />
                <DataBox data={"6-7"} desc={"Inches of Rain"} />
            </NavigationBar>
        </>
    );
}