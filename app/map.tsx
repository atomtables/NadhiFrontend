import getCurrentLocation from '@/app/components/getLocation';
import pointsData from '@/app/static/data/reports.json';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import MapView, { Circle, PROVIDER_GOOGLE, Region } from 'react-native-maps';
import Animated, { FadeInDown, ZoomIn } from 'react-native-reanimated';

// A modern, dark-themed map style
const mapStyle = [
  { elementType: 'geometry', stylers: [{ color: '#242f3e' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#242f3e' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#746855' }] },
  {
    featureType: 'administrative.locality',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#d59563' }],
  },
  {
    featureType: 'poi',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#d59563' }],
  },
  {
    featureType: 'poi.park',
    elementType: 'geometry',
    stylers: [{ color: '#263c3f' }],
  },
  {
    featureType: 'poi.park',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#6b9a76' }],
  },
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [{ color: '#38414e' }],
  },
  {
    featureType: 'road',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#212a37' }],
  },
  {
    featureType: 'road',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#9ca5b3' }],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry',
    stylers: [{ color: '#746855' }],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#1f2835' }],
  },
  {
    featureType: 'road.highway',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#f3d19c' }],
  },
  {
    featureType: 'transit',
    elementType: 'geometry',
    stylers: [{ color: '#2f3948' }],
  },
  {
    featureType: 'transit.station',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#d59563' }],
  },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [{ color: '#17263c' }],
  },
  {
    featureType: 'water',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#515c6d' }],
  },
  {
    featureType: 'water',
    elementType: 'labels.text.stroke',
    stylers: [{ color: '#17263c' }],
  },
];

// Grid-based aggregation: Groups points into fixed-size grid cells
// Returns circular regions instead of squares for smoother appearance
function aggregatePointsToGrid(points: any[], gridSize = 0.01) {
    // gridSize represents the size of each grid cell in degrees (lat/lng)
    // 0.01 degrees ≈ 1.1 km at the equator
    
    const gridMap = new Map<string, { weight: number; count: number }>();
    
    // Assign each point to a grid cell
    points.forEach(point => {
        const lat = point.latitude;
        const lng = point.longitude;
        const weight = point.weight || 1;
        
        // Calculate grid cell coordinates (center of cell)
        const gridLat = Math.floor(lat / gridSize) * gridSize + gridSize / 2;
        const gridLng = Math.floor(lng / gridSize) * gridSize + gridSize / 2;
        const gridKey = `${gridLat},${gridLng}`;
        
        // Aggregate weights in this cell
        if (gridMap.has(gridKey)) {
            const cell = gridMap.get(gridKey)!;
            cell.weight += weight;
            cell.count += 1;
        } else {
            gridMap.set(gridKey, { weight, count: 1 });
        }
    });
    
    // Convert grid map to array of circular regions with colors
    const gridCells = Array.from(gridMap.entries()).map(([key, data]) => {
        const [centerLat, centerLng] = key.split(',').map(Number);
        
        // Determine color based on aggregated weight
        let fillColor;
        let strokeColor;
        if (data.weight >= 3) {
            fillColor = 'rgba(239, 68, 68, 0.45)'; // Red with more transparency for blending
            strokeColor = 'rgba(239, 68, 68, 0.2)'; // Soft stroke
        } else if (data.weight >= 2) {
            fillColor = 'rgba(234, 179, 8, 0.45)'; // Yellow with more transparency
            strokeColor = 'rgba(234, 179, 8, 0.2)';
        } else {
            fillColor = 'rgba(34, 197, 94, 0.45)'; // Green with more transparency
            strokeColor = 'rgba(34, 197, 94, 0.2)';
        }
        
        // Calculate radius to cover the grid cell area
        // Using slightly larger radius to ensure overlap and smooth blending
        const radiusInMeters = (gridSize * 111000) * 0.7; // Convert degrees to meters, 0.7 for overlap
        
        return {
            center: { latitude: centerLat, longitude: centerLng },
            radius: radiusInMeters,
            fillColor,
            strokeColor,
            weight: data.weight,
        };
    });
    
    return gridCells;
}

export default function FullScreenMap() {
    const router = useRouter();
    const [region, setRegion] = useState<Region | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLocation = async () => {
            try {
                const location = await getCurrentLocation();
                if (location) {
                    setLoading(false);
                    setRegion({
                        latitude: 40.504566 /*location.latitude*/,
                        longitude: -74.369606 /*location.longitude*/,
                        latitudeDelta: 0.3688,
                        longitudeDelta: 0.1684,
                    });
                }
            } catch (err) {
                    console.error("Error fetching location:", err);
            }
        }

        fetchLocation();
    }, [])

    // Aggregate points into grid cells
    // Grid size of ~0.05 degrees ≈ 5.5km, which displays as roughly 250-300px at typical zoom levels
    const gridCells = aggregatePointsToGrid(pointsData.locations, 0.05);
    
    // Sort cells by weight so green (lowest) renders first, then yellow, then red (highest) on top
    const sortedGridCells = [...gridCells].sort((a, b) => a.weight - b.weight);

    if (loading) {
        return (
            <View className="flex-1 justify-center items-center bg-black">
                <ActivityIndicator size="large" color="#06b6d4" />
            </View>
        );
    }

    return (
        <>
            <Animated.View 
                entering={ZoomIn.duration(400).springify()}
                style={styles.container}
            >
                <MapView 
                    style={styles.map} 
                    initialRegion={region!} 
                    provider={PROVIDER_GOOGLE} 
                    customMapStyle={mapStyle}
                    showsUserLocation={true}
                    showsMyLocationButton={true}
                    zoomEnabled={true}
                    scrollEnabled={true}
                    pitchEnabled={true}
                    rotateEnabled={true}
                >
                    {/* Render grid cells as circles for smooth, blended appearance */}
                    {/* Sorted by weight so green renders first (bottom), then yellow, then red (top) */}
                    {sortedGridCells.map((cell, index) => (
                        <Circle
                            key={index}
                            center={cell.center}
                            radius={cell.radius}
                            fillColor={cell.fillColor}
                            strokeColor={cell.strokeColor}
                            strokeWidth={2}
                        />
                    ))}
                    
                    {/* {region && (
                        <Marker
                            coordinate={{
                                latitude: region.latitude,
                                longitude: region.longitude,
                            }}
                            title="Your Location"
                            pinColor="cyan"
                        />
                    )} */}
                </MapView>
                
                {/* Close Button - Top Right */}
                <Animated.View entering={FadeInDown.delay(300).duration(300)} style={styles.closeButton}>
                    <Pressable 
                        onPress={() => router.back()}
                    >
                        <View 
                            className="rounded-full items-center justify-center border border-white/20"
                            style={{ backgroundColor: 'rgba(0, 0, 0, 0.85)', width: 52, height: 52 }}
                        >
                            <Text className="text-white text-2xl font-semibold">✕</Text>
                        </View>
                    </Pressable>
                </Animated.View>

                {/* Done Button - Top Left */}
                {/* <Animated.View entering={FadeInDown.delay(300).duration(300)} style={styles.doneButton}>
                    <Pressable 
                        onPress={() => router.back()}
                    >
                        <View 
                            className="rounded-full items-center justify-center border border-cyan-400/50"
                            style={{ backgroundColor: 'rgba(6, 182, 212, 0.15)', paddingHorizontal: 20, paddingVertical: 12 }}
                        >
                            <Text className="text-cyan-400 text-base font-semibold">Done</Text>
                        </View>
                    </Pressable>
                </Animated.View> */}
            </Animated.View>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    map: {
        flex: 1,
    },
    closeButton: {
        position: 'absolute',
        top: 60,
        left: 20,
        zIndex: 10,
    },
    doneButton: {
        position: 'absolute',
        top: 60,
        left: 20,
        zIndex: 10,
    },
});
