import Overlay from '@/app/components/Overlay';
import closeIcon from "@/assets/icons/close.png";
import { Text, View } from 'react-native';
import CloseOverlayButton from './CloseOverlayButton';

export default function VolunteerFormOverlay({ isVisible, closeOverlay }: {isVisible: boolean, closeOverlay: () => void}) {
    return (
        <Overlay isVisible={isVisible}>
            <View className="flex-1 items-center justify-center">
                <CloseOverlayButton closeFunction={closeOverlay} icon={closeIcon} />
                <Text className="text-white text-2xl">Volunteer Form</Text>
            </View>
        </Overlay>
    );
}