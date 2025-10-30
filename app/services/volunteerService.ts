// Volunteer Service
// Handles volunteer request submissions and retrievals

import API_CONFIG from '@/app/config/api';

export interface VolunteerRequest {
  id?: number;
  type: string;
  timestamp: string;
  user_type: string;
  help_description: string;
  image_taken: boolean;
  image?: string | null;
  area_safe: boolean;
  no_medical_emergency: boolean;
  location: string;
  latitude: number;
  longitude: number;
  distance?: number;
}

/**
 * Submit a volunteer help request
 * @param data Volunteer request data
 * @param latitude User's latitude
 * @param longitude User's longitude
 * @param imageFile Optional image file
 * @returns Created volunteer request
 */
export async function submitVolunteerRequest(
  data: {
    type: string;
    userType: string;
    helpDescription: string;
    imageTaken: boolean;
    areaSafe: boolean;
    noMedicalEmergency: boolean;
    location: string;
  },
  latitude: number,
  longitude: number,
  imageFile?: File | null
): Promise<VolunteerRequest> {
  if (API_CONFIG.isDebugMode()) {
    // In debug mode, just return mock response
    console.log('[DEBUG MODE] Mock volunteer request submission:', data);
    return Promise.resolve({
      id: Math.floor(Math.random() * 10000),
      type: data.type,
      timestamp: new Date().toISOString(),
      user_type: data.userType,
      help_description: data.helpDescription,
      image_taken: data.imageTaken,
      image: imageFile ? 'mock_image.jpg' : null,
      area_safe: data.areaSafe,
      no_medical_emergency: data.noMedicalEmergency,
      location: data.location,
      latitude,
      longitude,
    });
  }

  // Production mode: submit to API
  try {
    const url = `${API_CONFIG.SERVER_ADDRESS}/volunteer/${latitude}/${longitude}`;
    console.log(`Submitting volunteer request to: ${url}`);

    const formData = new FormData();
    formData.append('type', data.type);
    formData.append('user_type', data.userType);
    formData.append('help_description', data.helpDescription);
    formData.append('image_taken', data.imageTaken.toString());
    formData.append('area_safe', data.areaSafe.toString());
    formData.append('no_medical_emergency', data.noMedicalEmergency.toString());
    formData.append('location', data.location);

    if (imageFile) {
      formData.append('image', imageFile);
    }

    const response = await fetch(url, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result: VolunteerRequest = await response.json();
    return result;
  } catch (error) {
    console.error('Error submitting volunteer request:', error);
    throw error;
  }
}

/**
 * Get volunteer requests near a location
 * @param latitude User's latitude
 * @param longitude User's longitude
 * @returns List of volunteer requests with distances
 */
export async function getVolunteerRequests(
  latitude: number,
  longitude: number
): Promise<VolunteerRequest[]> {
  if (API_CONFIG.isDebugMode()) {
    // In debug mode, return empty list
    console.log('[DEBUG MODE] Returning empty volunteer requests list');
    return Promise.resolve([]);
  }

  // Production mode: fetch from API
  try {
    const url = `${API_CONFIG.SERVER_ADDRESS}/volunteer/${latitude}/${longitude}`;
    console.log(`Fetching volunteer requests from: ${url}`);

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const requests: VolunteerRequest[] = await response.json();
    return requests;
  } catch (error) {
    console.error('Error fetching volunteer requests:', error);
    return [];
  }
}
