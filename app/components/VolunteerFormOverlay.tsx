import { View, Text } from 'react-native';
import Overlay from '@/app/components/Overlay';
import CloseOverlayButton from './CloseOverlayButton';
import closeIcon from "@/assets/icons/close.png"

export default function VolunteerFormOverlay({ isVisible, closeOverlay }) {
    return (
        <Overlay isVisible={isVisible}>
            <View className="flex-1 items-center justify-center">
                <CloseOverlayButton closeFunction={closeOverlay} icon={closeIcon} />
                <Text className="text-white text-2xl">Volunteer Form</Text>
            </View>
        </Overlay>
    );
}