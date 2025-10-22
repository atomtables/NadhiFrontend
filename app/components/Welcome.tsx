import userInfo from "@/app/static/data/user.json";
import { Text, View } from "react-native";
import Icon from "./Icon";
// @ts-ignore
import account from "@/assets/icons/account.png";

export default function Welcome() {
    return (
        <View className="p-4 rounded-full flex flex-row justify-between shadow-cyan-500/30 shadow-lg w-full">
            <View className="flex flex-col">
                <Text className="text-2xl font-bold text-white tracking-wider">Welcome, {userInfo.first_name}!</Text>
                <Text className="text-xl text-white">{new Date().toLocaleDateString()}</Text>
            </View>
            <View>
                <Icon image={account} onPress={() => {}} />
            </View>
        </View>
    );
}