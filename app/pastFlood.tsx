import {Text, View} from "react-native";

export default function PastFlood({ floodLevel, setFloodLevel }: { floodLevel: string, setFloodLevel: (level: string) => void }) {
    return (
        <View className="flex-1 justify-center items-center">
            <Text className="text-2xl mb-5">Recent Flood</Text>
            <Text className="text-lg mb-2.5">Help out those in need</Text>
            <Text className="text-lg mb-2.5">Volunteer</Text>
            <Text className="text-lg mb-2.5" onPress={() => setFloodLevel("floodless")}>Simulate No Flooding</Text>
        </View>
    );
}