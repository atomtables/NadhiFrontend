import { useRef } from 'react';
import { Animated, Image, Pressable } from "react-native";

export default function Icon({ image, onPress, size = 24 }: { image: any; onPress: () => void; size?: number }) {
    const scaleAnim = useRef(new Animated.Value(1)).current;

    const handlePressIn = () => {
        Animated.spring(scaleAnim, {
            toValue: 0.9,
            useNativeDriver: true,
        }).start();
    };

    const handlePressOut = () => {
        Animated.spring(scaleAnim, {
            toValue: 1,
            friction: 3,
            tension: 40,
            useNativeDriver: true,
        }).start();
    };

    return (
        <Pressable onPress={onPress} onPressIn={handlePressIn} onPressOut={handlePressOut}>
            <Animated.View style={{ transform: [{ scale: scaleAnim }] }} className="bg-gray-800 rounded-full shadow-lg shadow-cyan-500/20 items-center justify-center aspect-square p-4">
                <Image source={image} style={{ width: size, height: size }} className={`duration-300 transform hover:scale-110 hover:ease-in-out`} />
            </Animated.View>
        </Pressable>
    )
}