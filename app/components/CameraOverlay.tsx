import cameraIcon from '@/assets/icons/camera.png';
import closeIcon from '@/assets/icons/close.png';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useEffect, useRef } from 'react';
import { Button, Text, View } from 'react-native';
import CloseOverlayButton from "./CloseOverlayButton";
import Icon from './Icon';
import Overlay from "./Overlay";

export default function CameraOverlay({ isVisible, onClose, onPictureTaken }) {
    const [permission, requestPermission] = useCameraPermissions();
    const cameraRef = useRef(null);

    useEffect(() => {
        if (!permission) {
            requestPermission();
        }
    }, [permission]);

    const handleTakePicture = async () => {
        if (cameraRef.current) {
            try {
                const photo = await cameraRef.current.takePictureAsync({
                    quality: 0.7,
                    skipProcessing: true,
                });
                console.log('Photo taken:', photo.uri);
                onPictureTaken(photo.uri);
                onClose(); // Close the camera after taking the picture
            } catch (e) {
                console.error("Failed to take picture:", e);
            }
        }
    };

    if (!permission) {
        return <View />;
    }

    if (!permission.granted) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ textAlign: 'center' }}>We need your permission to show the camera</Text>
                <Button onPress={requestPermission} title="grant permission" />
            </View>
        );
    }

    if (!isVisible) {
        return null;
    }
    
    return (
        <Overlay isVisible={isVisible}>
            <CameraView 
                style={{ flex: 1 }} 
                ref={cameraRef}
                animateShutter={false}
            />

            <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'transparent' }} pointerEvents="box-none">
                <View className="flex-1 justify-end items-center mb-10">
                    <Icon image={cameraIcon} size={48} onPress={handleTakePicture} />
                </View>
                <CloseOverlayButton closeFunction={onClose} icon={closeIcon} />
            </View>
        </Overlay>
    );
}