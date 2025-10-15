import {Text, View} from "react-native";
import Page from '@/app/components/Page';
import DataBox from '@/app/components/DataBox';

export default function PossibleFlood({setFloodLevel}: { setFloodLevel: (level: string) => void }) {
    return (
        <Page status={"Flood Nearby. Stay Alert"}>
            <Text className="text-lg mb-2.5" onPress={() => setFloodLevel("pastFlood")}>Simulate Past Flooding</Text>
        </Page>
    );
}