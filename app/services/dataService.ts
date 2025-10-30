// Data Service
// Handles fetching weather and flood risk data

import API_CONFIG from '@/app/config/api';

export interface WeatherData {
  rainfall: number;
  temperature: number;
  humidity: number;
  flood_risk: string;
}

// Static mock data for debug mode
const mockWeatherData: WeatherData = {
  rainfall: 0.1,
  temperature: 70,
  humidity: 55,
  flood_risk: "Low likelihood of flooding"
};

/**
 * Fetch weather and flood risk data for a given location
 * @param latitude User's latitude
 * @param longitude User's longitude
 * @returns Weather data including flood risk
 */
export async function getWeatherData(
  latitude: number,
  longitude: number
): Promise<WeatherData> {
  if (API_CONFIG.isDebugMode()) {
    // Return static mock data in debug mode
    console.log('[DEBUG MODE] Using mock weather data');
    return Promise.resolve(mockWeatherData);
  }

  // Production mode: fetch from API
  try {
    const url = `${API_CONFIG.SERVER_ADDRESS}/data/${latitude}/${longitude}`;
    console.log(`Fetching weather data from: ${url}`);
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data: WeatherData = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching weather data:', error);
    // Fallback to mock data on error
    return mockWeatherData;
  }
}
