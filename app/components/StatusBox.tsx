import { Text, View } from "react-native";

export default function StatusBox({ status, desc, icon }: { status: string, desc?: string, icon: string }) {
    const isNoFlood = status.toLowerCase().includes("no flood");
    const borderColor = isNoFlood ? "border-green-500/50" : "border-cyan-400/50";
    const textColor = isNoFlood ? "text-green-400" : "text-cyan-400";
    const bgColor = isNoFlood ? "rgba(34, 197, 94, 0.1)" : "rgba(6, 182, 212, 0.1)";
    const iconBgColor = isNoFlood ? "rgba(34, 197, 94, 0.2)" : "rgba(6, 182, 212, 0.2)";
    
    return (
        <View 
            className={`p-6 rounded-2xl items-center justify-center border ${borderColor}`}
            style={{ backgroundColor: bgColor, minHeight: 160 }}
        >
            <View 
                className="rounded-full items-center justify-center mb-3"
                style={{ 
                    backgroundColor: iconBgColor,
                    width: 64,
                    height: 64
                }}
            >
                <Text className={`font-bold text-4xl ${textColor}`}>{icon}</Text>
            </View>
            <Text className={`font-semibold text-2xl ${textColor}`}>{status}</Text>
            {desc && <Text className={`text-sm text-gray-400 mt-2 opacity-80`}>{desc}</Text>}
        </View>
    );
}
