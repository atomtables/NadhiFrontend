import { View, Text } from 'react-native';
import Page from '@/app/components/Page';
import DataBox from '@/app/components/DataBox';
import NavigationBar from "@/app/components/NavigationBar";
import Icon from '@/app/components/Icon';
import camera from '@/assets/icons/camera.png';
import { useState } from "react";
import CameraOverlay from '@/app/components/CameraOverlay';

export default function YesFlood({setFloodLevel}: {setFloodLevel: (level: string) => void}) {
    const [cameraStatus, setCameraStatus] = useState(false);

    const handleCameraPress = () => {
        setCameraStatus(!cameraStatus);
    }

    const handlePictureTaken = (photo) => {
        console.log("Photo taken:", photo);
    }

    return (
        <>
            <Page status={"Flood Detected"} bar={true}>
                <DataBox data={"6-7"} desc={"Inches of Rain"} />
            </Page>
            <NavigationBar>
                <Icon image={camera} size={32} onPress={handleCameraPress} />
            </NavigationBar>
            <CameraOverlay isVisible={cameraStatus} onClose={handleCameraPress} onPictureTaken={handlePictureTaken} />
        </>
    );
}