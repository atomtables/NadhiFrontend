import {Text, View} from "react-native";

export default function NoFlood({ floodLevel, setFloodLevel }: { floodLevel: string, setFloodLevel: (level: string) => void }) {
    return (
        <View className="flex-1 justify-center items-center bg-purple-200">
            <Text className="text-2xl mb-5">No Flood</Text>
            <Text className="text-lg mb-2.5">Everything is normal.</Text>
            <Text className="text-lg mb-2.5">Stay safe!</Text>
            <Text className="text-lg mb-2.5" onPress={() => setFloodLevel("flood")}>Simulate Flooding</Text>
        </View>
    );
}