import CameraOverlay from '@/app/components/CameraOverlay';
import DataBox from '@/app/components/DataBox';
import getCurrentLocation from '@/app/components/getLocation';
import Icon from '@/app/components/Icon';
import NavigationBar from "@/app/components/NavigationBar";
import Page from '@/app/components/Page';
import SafetyTipsOverlay from '@/app/components/SafetyTipsOverlay';
import StatusBox from '@/app/components/StatusBox';
import pointsData from '@/app/static/data/reports.json';
import camera from '@/assets/icons/camera.png';
import { useEffect, useState } from "react";
import { Pressable, Text, View } from 'react-native';

// Calculate distance between two coordinates (Haversine formula)
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Radius of the Earth in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c; // Distance in km
}

// Find the closest data point to user's location
function getClosestFloodRisk(userLat: number, userLon: number): { risk: string; weight: number; distance: number } {
    let closestPoint = pointsData.locations[0];
    let minDistance = calculateDistance(userLat, userLon, closestPoint.latitude, closestPoint.longitude);
    
    pointsData.locations.forEach(point => {
        const distance = calculateDistance(userLat, userLon, point.latitude, point.longitude);
        if (distance < minDistance) {
            minDistance = distance;
            closestPoint = point;
        }
    });
    
    const weight = closestPoint.weight || 1;
    let risk = "Low";
    if (weight >= 3) risk = "High";
    else if (weight >= 2) risk = "Medium";
    
    return { risk, weight, distance: minDistance };
}

// Find the altitude of the closest flood data point
function getClosestAltitude(userLat: number, userLon: number): { altitude: number; distance: number } {
    let closestPoint = pointsData.locations[0];
    let minDistance = calculateDistance(userLat, userLon, closestPoint.latitude, closestPoint.longitude);
    
    pointsData.locations.forEach(point => {
        const distance = calculateDistance(userLat, userLon, point.latitude, point.longitude);
        if (distance < minDistance) {
            minDistance = distance;
            closestPoint = point;
        }
    });
    
    return { altitude: closestPoint.altitude || 0, distance: minDistance };
}

export default function YesFlood({setFloodLevel}: {setFloodLevel: (level: string) => void}) {
    const [cameraStatus, setCameraStatus] = useState(false);
    const [picture, setPicture] = useState(null);
    const [showSafetyTips, setShowSafetyTips] = useState(false);
    const [userFloodRisk, setUserFloodRisk] = useState<{ risk: string; weight: number; distance: number } | null>(null);
    const [floodAltitude, setFloodAltitude] = useState<{ altitude: number; distance: number } | null>(null);

    useEffect(() => {
        const fetchLocationAndRisk = async () => {
            try {
                const location = await getCurrentLocation();
                if (location) {
                    const riskData = getClosestFloodRisk(location.latitude, location.longitude);
                    setUserFloodRisk(riskData);
                    
                    const altitudeData = getClosestAltitude(location.latitude, location.longitude);
                    setFloodAltitude(altitudeData);
                }
            } catch (err) {
                console.error("Error fetching location:", err);
                // Default to high risk for active flood
                setUserFloodRisk({ risk: "High", weight: 3, distance: 0 });
                setFloodAltitude({ altitude: 12.0, distance: 0 });
            }
        };
        fetchLocationAndRisk();
    }, []);

    const handleCameraPress = () => {
        setCameraStatus(!cameraStatus);
    }

    const handlePictureTaken = () => {
        setCameraStatus(!cameraStatus);
    }

    const handleSafetyTipsPress = () => {
        setShowSafetyTips(true);
    };

    const handleCloseSafetyTips = () => {
        setShowSafetyTips(false);
    };

    // Get background color based on risk level
    const getRiskColors = (risk: string) => {
        switch(risk) {
            case "High":
                return {
                    bg: 'rgba(239, 68, 68, 0.15)',
                    border: 'rgba(239, 68, 68, 0.5)',
                    text: '#ef4444'
                };
            case "Medium":
                return {
                    bg: 'rgba(234, 179, 8, 0.15)',
                    border: 'rgba(234, 179, 8, 0.5)',
                    text: '#eab308'
                };
            case "Low":
                return {
                    bg: 'rgba(34, 197, 94, 0.15)',
                    border: 'rgba(34, 197, 94, 0.5)',
                    text: '#22c55e'
                };
            default:
                return {
                    bg: 'rgba(156, 163, 175, 0.15)',
                    border: 'rgba(156, 163, 175, 0.5)',
                    text: '#9ca3af'
                };
        }
    };

    const riskColors = userFloodRisk ? getRiskColors(userFloodRisk.risk) : getRiskColors("High");

    return (
        <>
            <Page status={"Flood Detected"}>
                <View className="w-full px-3 gap-3">
                    <StatusBox status="Active Flooding" desc="Review safety measures and stay alert. Conserve your phone's battery and stay on the alert for any information." icon="🌊" />
                    
                    {/* Safety Tips Button */}
                    <Pressable onPress={handleSafetyTipsPress}>
                        <View 
                            className="px-6 py-4 rounded-2xl border border-red-400/50"
                            style={{ backgroundColor: 'rgba(239, 68, 68, 0.15)' }}
                        >
                            <Text className="text-red-400 text-base font-semibold text-center">
                                View Flood Safety Tips
                            </Text>
                            <Text className="text-gray-400 text-sm text-center mt-1">
                                Critical safety information during active flooding
                            </Text>
                        </View>
                    </Pressable>
                    
                    <View className="flex-row gap-3">
                        {/* Personal Flood Risk Widget */}
                        <View 
                            className="p-5 rounded-2xl items-center justify-center border flex-1"
                            style={{ 
                                backgroundColor: riskColors.bg,
                                borderColor: riskColors.border,
                                minHeight: 140,
                            }}
                        >
                            <Text 
                                className="font-bold text-4xl"
                                style={{ color: riskColors.text }}
                            >
                                {userFloodRisk?.risk || "High"}
                            </Text>
                            <Text className="text-sm text-gray-400 mt-2 opacity-80 text-center">
                                Your Flood Risk
                            </Text>
                            {userFloodRisk?.distance && (
                                <Text className="text-xs text-gray-500 mt-1 opacity-70 text-center">
                                    Nearest data point {userFloodRisk.distance.toFixed(1)} km away
                                </Text>
                            )}
                        </View>
                        {/* Flood Altitude Widget */}
                        <View 
                            className="p-5 rounded-2xl items-center justify-center border flex-1"
                            style={{ 
                                backgroundColor: 'rgba(59, 130, 246, 0.15)',
                                borderColor: 'rgba(59, 130, 246, 0.5)',
                                minHeight: 140,
                            }}
                        >
                            <Text 
                                className="font-bold text-4xl"
                                style={{ color: '#3b82f6' }}
                            >
                                {floodAltitude?.altitude.toFixed(1) || "12.0"} ft
                            </Text>
                            <Text className="text-sm text-gray-400 mt-2 opacity-80 text-center">
                                Flood Water Height
                            </Text>
                            {floodAltitude?.distance && (
                                <Text className="text-xs text-gray-500 mt-1 opacity-70 text-center">
                                    Nearest data point {floodAltitude.distance.toFixed(1)} km away
                                </Text>
                            )}
                        </View>
                    </View>
                    
                    <View className="flex-row gap-3">
                        <DataBox data="65°F" desc="Current Temperature" />
                        <DataBox data="4.2″" desc="Rainfall (24 hrs)" />
                    </View>
                    
                    <View className="flex-row gap-3">
                        <DataBox data="92%" desc="Humidity" />
                        <DataBox data="8.5 ft" desc="Water Level" />
                    </View>
                    
                    <View className="flex-row gap-3">
                        <DataBox data="Critical" desc="River Conditions" />
                        <DataBox data="Rising" desc="Trend" />
                    </View>

                    {/* Navigation Buttons */}
                    <Pressable onPress={() => setFloodLevel("pastFlood")}>
                        <View 
                            className="px-6 py-4 rounded-2xl border border-blue-400/50"
                            style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)' }}
                        >
                            <Text className="text-blue-400 text-base font-semibold text-center">
                                → Next Stage: Past Flood
                            </Text>
                            <Text className="text-gray-400 text-sm text-center mt-1">
                                Test post-flood recovery scenario
                            </Text>
                        </View>
                    </Pressable>

                    <Pressable onPress={() => setFloodLevel("possibleFlood")}>
                        <View 
                            className="px-6 py-4 rounded-2xl border border-gray-400/30"
                            style={{ backgroundColor: 'rgba(156, 163, 175, 0.05)' }}
                        >
                            <Text className="text-gray-400 text-base font-semibold text-center">
                                ← Back to Possible Flood
                            </Text>
                        </View>
                    </Pressable>
                </View>
            </Page>
            <NavigationBar>
                <Icon image={camera} size={32} onPress={handleCameraPress} />
            </NavigationBar>
            <CameraOverlay isVisible={cameraStatus} onClose={handleCameraPress} onPictureTaken={handlePictureTaken} />
            <SafetyTipsOverlay isVisible={showSafetyTips} onClose={handleCloseSafetyTips} />
        </>
    );
}