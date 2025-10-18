import { useEffect, useRef } from 'react';
import { Animated, Dimensions } from "react-native";

const { height } = Dimensions.get('window');

export default function Overlay({ children, isVisible }) {
    const slideAnim = useRef(new Animated.Value(height)).current;

    useEffect(() => {
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
            {children}
        </Animated.View>

    )
}