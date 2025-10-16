import { View } from "react-native";

export default function Column({ children, className }) {
    return (
        <View className={`flex-1 flex-row w-11/12 gap-4 ` + className}>
            {children}
        </View>
    )
}