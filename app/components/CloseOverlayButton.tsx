import { Text, View } from "react-native";
import Icon from '@/app/components/Icon';

export default function CloseOverlayButton({ closeFunction, icon }) {
    return (
        <View className="absolute top-16 right-4">
            <Icon image={icon} size={24} onPress={closeFunction} />
        </View>
    )
}