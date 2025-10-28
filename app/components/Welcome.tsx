import userInfo from "@/app/static/data/user.json";
import { Text, View } from "react-native";
import Icon from "./Icon";
// @ts-ignore
import account from "@/assets/icons/account.png";

export default function Welcome() {
    return (
        <View className="px-6 py-4 flex flex-row justify-between w-full mb-4">
            <View className="flex flex-col">
                <Text className="text-3xl font-semibold text-white">Welcome, {userInfo.first_name}!</Text>
                <Text className="text-lg text-gray-400 mt-1">{new Date().toLocaleDateString()}</Text>
            </View>
            <View>
                <Icon image={account} onPress={() => {}} />
            </View>
        </View>
    );
}