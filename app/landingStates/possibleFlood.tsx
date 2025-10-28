import Page from '@/app/components/Page';
import { Text } from "react-native";

export default function PossibleFlood({setFloodLevel}: { setFloodLevel: (level: string) => void }) {
    return (
        <Page status={"Flood Nearby. Stay Alert"}>
            <Text className="text-base text-gray-400 mb-2.5" onPress={() => setFloodLevel("pastFlood")}>Simulate Past Flooding</Text>
        </Page>
    );
}