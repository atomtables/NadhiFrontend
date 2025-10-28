import { Text, View } from "react-native";

export default function DataBox({ data, desc }: { data: string, desc: string }) {
    return (
        <View 
            className="p-6 rounded-2xl items-center justify-center my-2 border border-white/10"
            style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
        >
            <Text className="font-bold text-5xl text-cyan-400">{data}</Text>
            <Text className="text-base text-gray-400 mt-2 opacity-80">{desc}</Text>
        </View>
    );
}