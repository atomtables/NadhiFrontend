import { View } from "react-native";

export default function Column({ children }: {children: React.ReactNode}) {
    return (
        <View className="flex-1">
            {children}
        </View>
    )
}