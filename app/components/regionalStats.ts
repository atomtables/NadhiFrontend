import { Location } from '@/types/types';

export interface PostFloodAssessment {
  id: number;
  latitude: number;
  longitude: number;
  damageRating: number;
  shelterAvailability: number;
  preparednessRating: number;
  timestamp: string;
}

export interface RegionalStats {
  avgDamage: number;
  avgShelter: number;
  assessmentCount: number;
}

/**
 * Calculate the distance between two coordinates using the Haversine formula
 * @param lat1 Latitude of first point
 * @param lon1 Longitude of first point
 * @param lat2 Latitude of second point
 * @param lon2 Longitude of second point
 * @returns Distance in miles
 */
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 3959; // Earth's radius in miles
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  
  return distance;
}

/**
 * Calculate regional statistics from post-flood assessments within a radius
 * @param userLocation User's current location
 * @param assessments Array of post-flood assessments
 * @param radiusMiles Radius in miles to search (default: 5 miles)
 * @returns Regional statistics including average damage and shelter availability
 */
export function calculateRegionalStats(
  userLocation: Location,
  assessments: PostFloodAssessment[],
  radiusMiles: number = 5
): RegionalStats {
  // Filter assessments within the specified radius
  const nearbyAssessments = assessments.filter(assessment => {
    const distance = calculateDistance(
      userLocation.latitude,
      userLocation.longitude,
      assessment.latitude,
      assessment.longitude
    );
    return distance <= radiusMiles;
  });

  // Calculate averages
  if (nearbyAssessments.length === 0) {
    return {
      avgDamage: 0,
      avgShelter: 0,
      assessmentCount: 0
    };
  }

  const totalDamage = nearbyAssessments.reduce((sum, a) => sum + a.damageRating, 0);
  const totalShelter = nearbyAssessments.reduce((sum, a) => sum + a.shelterAvailability, 0);

  return {
    avgDamage: Math.round((totalDamage / nearbyAssessments.length) * 10) / 10,
    avgShelter: Math.round((totalShelter / nearbyAssessments.length) * 10) / 10,
    assessmentCount: nearbyAssessments.length
  };
}
