import React, { useRef } from 'react';
import { View, TouchableOpacity, Text, Animated, Dimensions } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import Icon from './Icon';
// import closeIcon from '@/assets/icons/close.png';
import cameraIcon from '@/assets/icons/camera.png';

const { height } = Dimensions.get('window');

export default function CameraOverlay({ isVisible, onClose, onPictureTaken }) {
    const [permission, requestPermission] = useCameraPermissions();
    const cameraRef = useRef(null);
    const slideAnim = useRef(new Animated.Value(height)).current;

    React.useEffect(() => {
        if (!permission) {
            requestPermission();
        }
    }, [permission]);

    React.useEffect(() => {
        if (isVisible) {
            Animated.spring(slideAnim, {
                toValue: 0,
                useNativeDriver: true,
            }).start();
        } else {
            Animated.spring(slideAnim, {
                toValue: height,
                useNativeDriver: true,
            }).start();
        }
    }, [isVisible]);

    const handleTakePicture = async () => {
        if (cameraRef.current) {
            const photo = await cameraRef.current.takePictureAsync();
            onPictureTaken(photo);
            onClose();
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
    
    return (
        <Animated.View
            style={{
                transform: [{ translateY: slideAnim }],
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: '100%',
                backgroundColor: 'black',
            }}
        >
            <CameraView style={{ flex: 1 }} ref={cameraRef}>
                <View className="flex-1 justify-end items-center mb-10">
                    <TouchableOpacity onPress={handleTakePicture}>
                        <Icon image={cameraIcon} size={48} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={onClose} className="absolute top-16 right-4">
                         <Icon image={cameraIcon} size={24} />
                    </TouchableOpacity>
                </View>
            </CameraView>
        </Animated.View>
    );
}
