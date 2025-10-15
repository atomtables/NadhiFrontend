import { View, Text } from 'react-native';
import Page from '@/app/components/Page';
import DataBox from '@/app/components/DataBox';

export default function YesFlood({setFloodLevel}: {setFloodLevel: (level: string) => void}) {
    return (
        <Page status={"Flood Detected"}>
            <Text className="text-lg mb-2.5" onPress={() => setFloodLevel('possibleFlood')}>Simulate Possible Flood</Text>
        </Page>
    );
}