import { View, Text } from "react-native";
import userInfo from "@/app/static/data/user.json";

export default function Welcome() {
    return (
        <View className="p-4 bg-gray-800 rounded-full shadow-cyan-500/30 shadow-lg">
            <Text className="text-3xl font-bold text-white tracking-wider">Welcome {userInfo.first_name}</Text>
        </View>
    );
}