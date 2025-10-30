import { Text, View } from "react-native";

export default function DataBox({ 
    data, 
    desc, 
    accentColor = "text-cyan-400",
    borderColor = "border-white/10",
    bgColor = 'rgba(255, 255, 255, 0.05)'
}: { 
    data: string, 
    desc: string,
    accentColor?: string,
    borderColor?: string,
    bgColor?: string
}) {
    return (
        <View 
            className={`p-5 rounded-2xl items-center justify-center border ${borderColor}`}
            style={{ backgroundColor: bgColor, minHeight: 140, flex: 1 }}
        >
            <Text className={`font-bold text-4xl ${accentColor}`}>{data}</Text>
            <Text className="text-sm text-gray-400 mt-2 opacity-80 text-center">{desc}</Text>
        </View>
    );
}