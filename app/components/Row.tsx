import { View } from "react-native";

export default function Column({ children, className }: { children: React.ReactNode; className?: string }) {
    return (
        <View className={`flex-1 flex-row w-11/12 gap-4 ` + className}>
            {children}
        </View>
    )
}