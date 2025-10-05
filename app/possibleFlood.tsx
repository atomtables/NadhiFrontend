import {Text, View} from "react-native";

export default function PossibleFlood({ floodLevel, setFloodLevel }: { floodLevel: string, setFloodLevel: (level: string) => void }) {
    return (
        <View className="flex-1 justify-center items-center bg-yellow-200">
            <Text className="text-2xl mb-5">Flood Warning</Text>
            <Text className="text-lg mb-2.5">Flooding is possible.</Text>
            <Text className="text-lg mb-2.5">Stay alert and be prepared to evacuate.</Text>
            <Text className="text-lg mb-2.5" onPress={() => setFloodLevel("flooded")}>Simulate Past Flooding</Text>
        </View>
    );
}