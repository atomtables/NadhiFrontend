import CameraOverlay from '@/app/components/CameraOverlay';
import DataBox from '@/app/components/DataBox';
import Icon from '@/app/components/Icon';
import NavigationBar from "@/app/components/NavigationBar";
import Page from '@/app/components/Page';
import camera from '@/assets/icons/camera.png';
import { useState } from "react";
import { Text } from 'react-native';

export default function YesFlood({setFloodLevel}: {setFloodLevel: (level: string) => void}) {
    const [cameraStatus, setCameraStatus] = useState(false);
    const [picture, setPicture] = useState(null);

    const handleCameraPress = () => {
        setCameraStatus(!cameraStatus);
    }

    const handlePictureTaken = () => {
        setCameraStatus(!cameraStatus);
    }

    return (
        <>
            <Page status={"Flood Detected"}>
                <DataBox data={"6-7"} desc={"Inches of Rain"} />
                <Text className="text-base text-gray-400 mb-2.5" onPress={() => setFloodLevel("possibleFlood")}>Simulate Flooding</Text>
            </Page>
            <NavigationBar>
                <Icon image={camera} size={32} onPress={handleCameraPress} />
            </NavigationBar>
            <CameraOverlay isVisible={cameraStatus} onClose={handleCameraPress} onPictureTaken={handlePictureTaken} />
        </>
    );
}