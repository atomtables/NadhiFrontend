import { Location } from '@/types/types';
import { PermissionsAndroid, Platform } from 'react-native';
import Geolocation from 'react-native-geolocation-service';

/**
 * Requests location permission from the user.
 * @returns {Promise<boolean>} A promise that resolves to true if permission is granted, false otherwise.
 */
const requestLocationPermission = async (): Promise<boolean> => {
  if (Platform.OS === 'ios') {
    const status = await Geolocation.requestAuthorization('whenInUse');
    return status === 'granted';
  } else if (Platform.OS === 'android') {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Permission',
          message: 'This app needs access to your location.',
          buttonPositive: 'OK',
          buttonNegative: 'Cancel',
        },
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.warn(err);
      return false;
    }
  }
  return false;
};

/**
 * Retrieves the current location of the user.
 * It will first request permission, and if granted, it will fetch the coordinates.
 * @returns {Promise<Location | null>} A promise that resolves to a Location object or null if permission is denied or an error occurs.
 */
const getCurrentLocation = async (): Promise<Location | null> => {
  const hasPermission = await requestLocationPermission();

  if (!hasPermission) {
    console.log('Location permission denied.');
    return null;
  }

  return new Promise((resolve, reject) => {
    Geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        resolve({ latitude, longitude });
      },
      (error) => {
        console.error("Error getting location:", error);
        reject(error);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  });
};

export default getCurrentLocation;