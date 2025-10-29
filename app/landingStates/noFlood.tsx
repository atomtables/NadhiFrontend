import DataBox from '@/app/components/DataBox';
import Page from '@/app/components/Page';
import StatusBox from '@/app/components/StatusBox';
import * as Notifications from 'expo-notifications';
import { useEffect, useState } from 'react';
import { Alert, Pressable, Text, View } from "react-native";

// Configure notification behavior
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true,
    }),
});

export default function NoFlood({setFloodLevel}: {setFloodLevel: (level: string) => void }) {
    const [notificationScheduled, setNotificationScheduled] = useState(false);

    useEffect(() => {
        // Request permissions when component mounts
        async function requestPermissions() {
            const { status } = await Notifications.requestPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permission Required', 'Please enable notifications to receive flood alerts.');
            }
        }
        requestPermissions();
    }, []);

    const scheduleFloodWarning = async () => {
        try {
            // Cancel any existing notifications
            await Notifications.cancelAllScheduledNotificationsAsync();

            // Schedule notification for 15 seconds from now
            await Notifications.scheduleNotificationAsync({
                content: {
                    title: "⚠️ Flood Warning",
                    body: "A flood is expected in your area soon. Please stay alert and take necessary precautions.",
                    sound: true,
                    priority: Notifications.AndroidNotificationPriority.HIGH,
                },
                trigger: {
                    type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
                    seconds: 5,
                },
            });

            setNotificationScheduled(true);
            Alert.alert(
                'Notification Scheduled',
                'You will receive a flood warning in 15 seconds.',
                [{ text: 'OK' }]
            );
        } catch (error) {
            console.error('Error scheduling notification:', error);
            Alert.alert('Error', 'Failed to schedule notification.');
        }
    };

    return (
        <Page status={"No Flood Detected"}>
            <View className="w-full px-3 gap-3">
                <StatusBox status="No Flood Detected" icon="✓" />
                
                <View className="flex-row gap-3">
                    <DataBox data="72°F" desc="Current Temperature" />
                    <DataBox data="0.2″" desc="Rainfall (24 hrs)" />
                </View>
                
                <View className="flex-row gap-3">
                    <DataBox data="45%" desc="Humidity" />
                    <DataBox data="Low" desc="Flood Risk" />
                </View>
                
                <View className="flex-row gap-3">
                    <DataBox data="3.2 ft" desc="Water Level" />
                    <DataBox data="Normal" desc="River Conditions" />
                </View>
                
                <Pressable onPress={scheduleFloodWarning}>
                    <View 
                        className="px-6 py-4 rounded-2xl border border-cyan-400/50"
                        style={{ backgroundColor: 'rgba(6, 182, 212, 0.1)' }}
                    >
                        <Text className="text-cyan-400 text-base font-semibold text-center">
                            {notificationScheduled ? '⏰ Notification Scheduled' : '🔔 Test Flood Alert'}
                        </Text>
                        <Text className="text-gray-400 text-sm text-center mt-1">
                            {notificationScheduled ? 'Alert in 15 seconds' : 'Receive alert in 15 seconds'}
                        </Text>
                    </View>
                </Pressable>

                <Text className="text-base text-gray-400 text-center mb-2.5" onPress={() => setFloodLevel("yesFlood")}>Simulate Flooding</Text>
            </View>
        </Page>
    );
}