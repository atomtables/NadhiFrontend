import { Text, View } from "react-native";

export default function DataBox({ data, desc }: { data: string, desc: string }) {
    return (
        <View 
            className="p-5 rounded-2xl items-center justify-center border border-white/10"
            style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', minHeight: 140, flex: 1 }}
        >
            <Text className="font-bold text-4xl text-cyan-400">{data}</Text>
            <Text className="text-sm text-gray-400 mt-2 opacity-80 text-center">{desc}</Text>
        </View>
    );
}