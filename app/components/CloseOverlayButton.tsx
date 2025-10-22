import Icon from '@/app/components/Icon';
import { View } from "react-native";

export default function CloseOverlayButton({ closeFunction, icon }: {closeFunction: () => void, icon: any}) {
    return (
        <View className="absolute top-16 right-4">
            <Icon image={icon} size={24} onPress={closeFunction} />
        </View>
    )
}