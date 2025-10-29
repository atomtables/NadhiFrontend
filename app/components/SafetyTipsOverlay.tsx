import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown, ZoomIn } from 'react-native-reanimated';

interface SafetyTip {
    icon: string;
    title: string;
    description: string;
}

const safetyTips: SafetyTip[] = [
    {
        icon: "🏃",
        title: "Evacuate If Told",
        description: "Follow evacuation orders immediately. Don't wait until it's too late. Know your evacuation routes in advance."
    },
    {
        icon: "⬆️",
        title: "Move to Higher Ground",
        description: "If evacuation isn't possible, move to the highest floor or even the roof if necessary. Avoid basements and ground floors."
    },
    {
        icon: "🚗",
        title: "Never Drive Through Flooded Areas",
        description: "Just 6 inches of moving water can knock you down, and 12 inches can carry away a small car. Turn around, don't drown!"
    },
    {
        icon: "🔌",
        title: "Avoid Electrical Hazards",
        description: "Stay away from power lines and electrical wires. Turn off electricity at the main breaker if water is rising in your home."
    },
    {
        icon: "💧",
        title: "Don't Walk in Floodwater",
        description: "Moving water just 6 inches deep can sweep you off your feet. Floodwater can also be contaminated or hide dangers."
    },
    {
        icon: "📱",
        title: "Stay Informed",
        description: "Monitor weather alerts and emergency broadcasts. Keep your phone charged and have a battery-powered radio ready."
    },
    {
        icon: "🎒",
        title: "Prepare an Emergency Kit",
        description: "Have water, non-perishable food, medications, flashlight, batteries, first aid kit, and important documents ready."
    },
    {
        icon: "🏠",
        title: "Protect Your Home",
        description: "Move valuables to higher floors. Unplug electronics. Consider sandbags to prevent water entry if time permits."
    },
    {
        icon: "👥",
        title: "Help Others Safely",
        description: "Check on neighbors, especially elderly or disabled individuals. But don't put yourself at risk during active flooding."
    },
    {
        icon: "🚨",
        title: "Call for Help if Needed",
        description: "If trapped, call 911. Don't enter floodwater to make rescues yourself - leave that to professionals."
    }
];

export default function SafetyTipsOverlay({ isVisible, onClose }: { isVisible: boolean; onClose: () => void }) {
    if (!isVisible) return null;

    return (
        <Animated.View 
            entering={ZoomIn.duration(400).springify()}
            style={styles.container}
        >
            <View style={styles.content}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>🛡️ Flood Safety Tips</Text>
                    <Text style={styles.headerSubtitle}>
                        Essential guidelines to stay safe during flooding
                    </Text>
                </View>

                {/* Safety Tips List */}
                <ScrollView 
                    style={styles.scrollView}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    {safetyTips.map((tip, index) => (
                        <Animated.View
                            key={index}
                            entering={FadeInDown.delay(100 * index).duration(300)}
                            style={styles.tipCard}
                        >
                            <View style={styles.tipIcon}>
                                <Text style={styles.iconText}>{tip.icon}</Text>
                            </View>
                            <View style={styles.tipContent}>
                                <Text style={styles.tipTitle}>{tip.title}</Text>
                                <Text style={styles.tipDescription}>{tip.description}</Text>
                            </View>
                        </Animated.View>
                    ))}
                    
                    {/* Emergency Contacts */}
                    <Animated.View
                        entering={FadeInDown.delay(1000).duration(300)}
                        style={styles.emergencyCard}
                    >
                        <Text style={styles.emergencyTitle}>📞 Emergency Contacts</Text>
                        <Text style={styles.emergencyText}>Emergency Services: 911</Text>
                        <Text style={styles.emergencyText}>FEMA: 1-800-621-3362</Text>
                        <Text style={styles.emergencyText}>Red Cross: 1-800-733-2767</Text>
                    </Animated.View>
                </ScrollView>

                {/* Close Button */}
                <Animated.View entering={FadeInDown.delay(300).duration(300)} style={styles.closeButton}>
                    <Pressable onPress={onClose}>
                        <View 
                            className="rounded-full items-center justify-center border border-white/20"
                            style={{ backgroundColor: 'rgba(0, 0, 0, 0.85)', width: 52, height: 52 }}
                        >
                            <Text className="text-white text-2xl font-semibold">✕</Text>
                        </View>
                    </Pressable>
                </Animated.View>
            </View>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: '#000',
        zIndex: 1000,
    },
    content: {
        flex: 1,
        paddingTop: 140,
    },
    header: {
        paddingHorizontal: 20,
        paddingBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255, 255, 255, 0.1)',
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 8,
    },
    headerSubtitle: {
        fontSize: 16,
        color: '#9ca3af',
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        padding: 20,
        paddingBottom: 40,
    },
    tipCard: {
        flexDirection: 'row',
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    tipIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: 'rgba(234, 179, 8, 0.15)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    iconText: {
        fontSize: 24,
    },
    tipContent: {
        flex: 1,
    },
    tipTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#fff',
        marginBottom: 6,
    },
    tipDescription: {
        fontSize: 14,
        color: '#9ca3af',
        lineHeight: 20,
    },
    emergencyCard: {
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        borderRadius: 16,
        padding: 20,
        marginTop: 12,
        borderWidth: 1,
        borderColor: 'rgba(239, 68, 68, 0.3)',
    },
    emergencyTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#ef4444',
        marginBottom: 12,
    },
    emergencyText: {
        fontSize: 16,
        color: '#fca5a5',
        marginBottom: 8,
    },
    closeButton: {
        position: 'absolute',
        top: 60,
        left: 20,
        zIndex: 10,
    },
});
