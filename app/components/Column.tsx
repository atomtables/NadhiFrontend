import { View } from "react-native";

export default function Column({ children }) {
    return (
        <View className="flex-1">
            {children}
        </View>
    )
}