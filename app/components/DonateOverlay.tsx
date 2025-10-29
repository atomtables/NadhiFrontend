import Overlay from '@/app/components/Overlay';
import CloseOverlayButton from "@/app/components/CloseOverlayButton";
import { Text, View, Pressable, Linking, Alert } from 'react-native';
import close from "@/assets/icons/close.png";

export default function DonateOverlay({ isVisible, closeOverlay }) {

    const handleDonatePress = () => {
        const donationUrl = "https://www.redcross.org/donate/disaster-relief.html/";
        Linking.openURL(donationUrl).catch(err => {
            console.error("Couldn't load page", err);
            Alert.alert("Error", "Could not open the donation page.");
        });
    }

    return (
        <Overlay isVisible={isVisible}>
            <View className="w-full h-full px-6 items-center justify-center">
                <Text className="text-white text-3xl font-bold mb-4">Support Flood Victims</Text>
                <Text className="text-gray-300 text-lg text-center mb-8">
                    Your donation can provide critical relief to those affected by recent floods. 
                    Press the button below to be redirected to the official Red Cross donation page.
                </Text>

                <Pressable onPress={handleDonatePress}>
                    <View 
                        className="px-8 py-4 rounded-full border-2 border-cyan-400 bg-cyan-400/10 shadow-lg"
                    >
                        <Text className="text-cyan-400 text-xl font-bold text-center">
                            Donate Now
                        </Text>
                    </View>
                </Pressable>
            </View>
            <CloseOverlayButton closeFunction={closeOverlay} icon={close} />
        </Overlay>
    )
}