// Assessment Service
// Handles post-flood assessment and image uploads

import API_CONFIG from '@/app/config/api';
import postFloodAssessmentsData from '@/app/static/data/postFloodAssessments.json';

export interface AssessmentData {
  id?: number;
  file_name?: string;
  question1_answer: string;  // q1: damage rating
  question2_answer: string;  // q2: shelter availability
  question3_answer: string;  // q3: preparedness
  created_at?: string;
  latitude?: number;
  longitude?: number;
}

export interface PostFloodAssessment {
  id: number;
  latitude: number;
  longitude: number;
  damageRating: number;
  shelterAvailability: number;
  preparednessRating: number;
  timestamp: string;
}

/**
 * Submit a post-flood assessment
 * @param data Assessment data
 * @param imageFile Optional image file
 * @returns Created assessment record
 */
export async function submitAssessment(
  data: {
    q1: string;  // damage rating
    q2: string;  // shelter availability
    q3: string;  // preparedness
    latitude?: number;
    longitude?: number;
  },
  imageFile?: File | null
): Promise<AssessmentData> {
  if (API_CONFIG.isDebugMode()) {
    // In debug mode, just return mock response
    console.log('[DEBUG MODE] Mock assessment submission:', data);
    return Promise.resolve({
      id: Math.floor(Math.random() * 10000),
      file_name: imageFile ? 'mock_assessment_image.jpg' : undefined,
      question1_answer: data.q1,
      question2_answer: data.q2,
      question3_answer: data.q3,
      created_at: new Date().toISOString(),
      latitude: data.latitude,
      longitude: data.longitude,
    });
  }

  // Production mode: submit to API
  try {
    const url = `${API_CONFIG.SERVER_ADDRESS}/upload/final`;
    console.log(`Submitting assessment to: ${url}`);

    const formData = new FormData();
    formData.append('q1', data.q1);
    formData.append('q2', data.q2);
    formData.append('q3', data.q3);

    if (imageFile) {
      formData.append('file', imageFile);
    }

    // Note: Backend endpoint doesn't currently accept lat/lon for assessments
    // This would need to be added to the backend if needed

    const response = await fetch(url, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result: AssessmentData = await response.json();
    return result;
  } catch (error) {
    console.error('Error submitting assessment:', error);
    throw error;
  }
}

/**
 * Get post-flood assessments data
 * In debug mode, returns static data from JSON file
 * In production mode, would fetch from API (not implemented in backend yet)
 * @returns List of post-flood assessments
 */
export async function getPostFloodAssessments(): Promise<PostFloodAssessment[]> {
  if (API_CONFIG.isDebugMode()) {
    // In debug mode, return static data
    console.log('[DEBUG MODE] Using static post-flood assessments data');
    return Promise.resolve(postFloodAssessmentsData as PostFloodAssessment[]);
  }

  // Production mode: Would fetch from API, but endpoint doesn't exist yet
  // For now, fallback to static data
  console.log('[PRODUCTION MODE] No API endpoint for assessments, using static data');
  return Promise.resolve(postFloodAssessmentsData as PostFloodAssessment[]);
}

/**
 * Upload a flood image during active flooding
 * @param imageFile Image file to upload
 * @param latitude User's latitude
 * @param longitude User's longitude
 * @param altitude User's altitude
 * @returns Upload result
 */
export async function uploadFloodImage(
  imageFile: File,
  latitude: number,
  longitude: number,
  altitude: number
): Promise<any> {
  if (API_CONFIG.isDebugMode()) {
    // In debug mode, just return mock response
    console.log('[DEBUG MODE] Mock flood image upload');
    return Promise.resolve({
      id: Math.floor(Math.random() * 10000),
      file_name: 'mock_flood_image.jpg',
      latitude,
      longitude,
      altitude,
      created_at: new Date().toISOString(),
    });
  }

  // Production mode: submit to API
  try {
    const url = `${API_CONFIG.SERVER_ADDRESS}/upload/flood`;
    console.log(`Uploading flood image to: ${url}`);

    const formData = new FormData();
    formData.append('file', imageFile);
    formData.append('latitude', latitude.toString());
    formData.append('longitude', longitude.toString());
    formData.append('altitude', altitude.toString());

    const response = await fetch(url, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error uploading flood image:', error);
    throw error;
  }
}
