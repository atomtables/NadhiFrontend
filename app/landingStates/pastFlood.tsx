import {Text, View} from "react-native";
import Page from '@/app/components/Page';
import DataBox from '@/app/components/DataBox';

export default function PastFlood({setFloodLevel}: {setFloodLevel: (level: string) => void }) {
    return (
        <Page status={"Recent Flood. Volunteers Needed"}>
            <Text className="text-lg mb-2.5" onPress={() => setFloodLevel("noFlood")}>Simulate No Flooding</Text>
        </Page>
    );
}