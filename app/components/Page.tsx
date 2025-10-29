import Column from '@/app/components/Column';
import HeatMap from '@/app/components/HeatMap';
import Row from '@/app/components/Row';
import Welcome from '@/app/components/Welcome';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useRef } from "react";
import { Animated, Pressable, ScrollView, View } from "react-native";

export default function Page({ children, status }: { children: React.ReactNode; status: string }) {
    const router = useRouter();
    const scaleAnim = useRef(new Animated.Value(1)).current;
    const childrenArray = React.Children.toArray(children);
    let firstGroup: any[] = [];
    let secondGroup: any[] = [];
    let thirdGroup: any[] = [];

    childrenArray.forEach((child, index) => {
        if (!childrenArray[index + 1] && index % 2 === 0) {
            thirdGroup.push(child);
        } else if (index % 2 === 0) {
            firstGroup.push(child);
        } else {
            secondGroup.push(child);
        }
    });

    const columnNumber = () => {
        if (firstGroup.length > 0 && thirdGroup.length > 0) {
            return (
                <>
                    <Row>
                        <Column>{firstGroup}</Column>
                        <Column>{secondGroup}</Column>
                    </Row>
                    <Row className="justify-center">
                        <Column>{thirdGroup}</Column>
                    </Row>
                </>
            )
        } else if (thirdGroup.length > 0) {
            return (
                <Row className="justify-center">
                    <Column>{thirdGroup}</Column>
                </Row>
            )
        } else {
            return (
                <Row>
                    <Column>{firstGroup}</Column>
                    <Column>{secondGroup}</Column>
                </Row>
            )
        }
    }

    const handlePressIn = () => {
        Animated.spring(scaleAnim, {
            toValue: 0.95,
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

    const handlePress = () => {
        router.push('/map');
    };

    return (
        <LinearGradient
            colors={['#0a0a1a', '#0d1b2a', '#1b263b', '#2d1b3d']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{ flex: 1 }}
        >
            <ScrollView contentContainerStyle={{ flexGrow: 1, alignItems: 'center', paddingBottom: 56, paddingTop: 40 }} className="pt-8">
                <Welcome />
                <Pressable 
                    onPress={handlePress}
                    onPressIn={handlePressIn}
                    onPressOut={handlePressOut}
                >
                    <Animated.View 
                        style={{ 
                            transform: [{ scale: scaleAnim }],
                            backgroundColor: 'rgba(255, 255, 255, 0.05)',
                            width: 350,
                            borderRadius: 24,
                            overflow: 'hidden',
                            marginBottom: 24,
                            borderWidth: 1,
                            borderColor: 'rgba(255, 255, 255, 0.1)',
                            height: 240,
                        }}
                    >
                        <HeatMap />
                    </Animated.View>
                </Pressable>
                <View className="w-full items-center mt-2">
                    {columnNumber()}
                </View>
            </ScrollView>
        </LinearGradient>
    )
}