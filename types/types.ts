import { Region } from "react-native-maps";

// The data point after being projected to 2D space
export interface ProjectedPoint extends DataPoint {
    x: number;
    y: number;
}

// Props for the 3D mesh component
export interface HeatmapMeshProps {
    mapRegion: Region;
    dataPoints: DataPoint[];
}

/**
* An interface to represent the location coordinates.
*/
export interface Location {
    latitude: number;
    longitude: number;
}

// The geographic data point with weight
export interface DataPoint extends Location {
    weight: number;
}
