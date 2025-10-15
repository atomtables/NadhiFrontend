import { View, Text } from "react-native";

export default function DataBox({ data, desc }: { data: string, desc: string }) {
    return (
        <View className="bg-gray-800 p-6 rounded-2xl shadow-lg shadow-cyan-500/20 items-center justify-center my-2">
            <Text className="font-bold text-5xl text-cyan-400">{data}</Text>
            <Text className="text-lg text-gray-400 mt-2">{desc}</Text>
        </View>
    );
}