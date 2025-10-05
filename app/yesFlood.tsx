import {Text, View} from "react-native";

export default function YesFlood({ floodLevel, setFloodLevel }: { floodLevel: string, setFloodLevel: (level: string) => void }) {
    return (
        <View className="flex-1 justify-center items-center bg-blue-200">
            <Text className="text-2xl mb-5">Flood Alert!</Text>
            <Text className="text-lg mb-2.5">Flooding is occurring.</Text>
            <Text className="text-lg mb-2.5">Seek higher ground immediately!</Text>
            <Text className="text-lg mb-2.5" onPress={() => setFloodLevel("flood?")}>Simulate Possible Flood</Text>
        </View>
    )
}