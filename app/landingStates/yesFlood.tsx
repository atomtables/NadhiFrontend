import { View, Text, Alert } from 'react-native';
import Page from '@/app/components/Page';
import DataBox from '@/app/components/DataBox';
import NavigationBar from "@/app/components/NavigationBar";
import Icon from '@/app/components/Icon';
import camera from '@/assets/icons/camera.png';
import { useState } from "react";
import CameraOverlay from '@/app/components/CameraOverlay';

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
            <Page status={"Flood Detected"} bar={true}>
                <DataBox data={"6-7"} desc={"Inches of Rain"} />
                <Text className="text-lg mb-2.5" onPress={() => setFloodLevel("possibleFlood")}>Simulate Flooding</Text>
            </Page>
            <NavigationBar>
                <Icon image={camera} size={32} onPress={handleCameraPress} />
            </NavigationBar>
            <CameraOverlay isVisible={cameraStatus} onClose={handleCameraPress} onPictureTaken={handlePictureTaken} />
        </>
    );
}