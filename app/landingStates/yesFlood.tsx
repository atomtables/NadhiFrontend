import { View, Text } from 'react-native';
import Page from '@/app/components/Page';
import DataBox from '@/app/components/DataBox';
import NavigationBar from "@/app/components/NavigationBar";

export default function YesFlood({setFloodLevel}: {setFloodLevel: (level: string) => void}) {
    return (
        <>
        <Page status={"Flood Detected"}>
            <DataBox data={"6-7"} desc={"Inches of Rain"} />
        </Page>
        <NavigationBar>
            <Text className="text-lg mb-2.5" onPress={() => setFloodLevel("possibleFlood")}>Simulate No Flooding</Text>
        </NavigationBar>
        </>
    );
}