import { View, Text } from "react-native";
import userInfo from "@/app/static/data/user.json";

export default function Welcome() {
    return (
        <View className="p-4 rounded-full shadow-cyan-500/30 shadow-lg self-start">
            <Text className="text-2xl font-bold text-white tracking-wider">Welcome, {userInfo.first_name}!</Text>
            <Text className="text-xl text-white">{new Date().toLocaleDateString()}</Text>
        </View>
    );
}