import React, { useState, useEffect } from 'react';
import { StyleSheet, ActivityIndicator, View } from 'react-native';
import MapView, { Heatmap, Region, Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import getCurrentLocation from '@/app/components/getLocation';
import pointsData from '@/app/static/data/reports.json';

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

export default function HeatMap() {
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

    const points = pointsData.locations;

    if (loading) {
        return (
            <View className="flex-1 justify-center items-center bg-gray-800">
                <ActivityIndicator size="large" color="#00ffff" />
            </View>
        );
    }

    return (
        <MapView style={styles.map} region={region} provider={PROVIDER_GOOGLE} customMapStyle={mapStyle} minZoomLevel={4} maxZoomLevel={14}>
            <Heatmap points={points} radius={40} opacity={0.7} />
            {region && (
                <Marker
                    coordinate={{
                        latitude: region.latitude,
                        longitude: region.longitude,
                    }}
                    title="Your Location"
                    pinColor="cyan"
                />
            )}
        </MapView>
    );
}

const styles = StyleSheet.create({
    map: {
        flex: 1,
    },
});
