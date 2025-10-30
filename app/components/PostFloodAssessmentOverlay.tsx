import CameraOverlay from '@/app/components/CameraOverlay';
import Overlay from '@/app/components/Overlay';
import { getPostFloodAssessments, submitAssessment } from '@/app/services/assessmentService';
import closeIcon from "@/assets/icons/close.png";
import { Location } from '@/types/types';
import { useEffect, useState } from 'react';
import { Image, Pressable, ScrollView, Text, View } from 'react-native';
import CloseOverlayButton from './CloseOverlayButton';
import DataBox from './DataBox';
import getCurrentLocation from './getLocation';
import { calculateRegionalStats, RegionalStats } from './regionalStats';

type AssessmentStage = 'intro' | 'photo' | 'damage' | 'shelter' | 'preparedness' | 'complete';

export default function PostFloodAssessmentOverlay({ 
    isVisible, 
    closeOverlay,
    hasCompleted 
}: {
    isVisible: boolean, 
    closeOverlay: () => void,
    hasCompleted: boolean
}) {
    const [stage, setStage] = useState<AssessmentStage>('intro');
    const [photoUri, setPhotoUri] = useState<string | null>(null);
    const [photoTaken, setPhotoTaken] = useState(false);
    const [cameraVisible, setCameraVisible] = useState(false);
    const [damageRating, setDamageRating] = useState<number | null>(null);
    const [shelterRating, setShelterRating] = useState<number | null>(null);
    const [preparednessRating, setPreparednessRating] = useState<number | null>(null);
    const [userLocation, setUserLocation] = useState<Location | null>(null);
    const [regionalStats, setRegionalStats] = useState<RegionalStats | null>(null);

    // Get user location when overlay becomes visible
    useEffect(() => {
        if (isVisible && !userLocation) {
            console.log('Fetching user location...');
            getCurrentLocation().then(async location => {
                if (location) {
                    console.log('User location:', location);
                    setUserLocation(location);
                    // Calculate regional statistics
                    const assessments = await getPostFloodAssessments();
                    const stats = calculateRegionalStats(
                        location,
                        assessments
                    );
                    console.log('Regional stats:', stats);
                    setRegionalStats(stats);
                } else {
                    console.log('Location is null');
                }
            }).catch(error => {
                console.error('Error getting location:', error);
            });
        }
    }, [isVisible]);

    const handleClose = () => {
        closeOverlay();
    };

    const handleTakePhoto = () => {
        setCameraVisible(true);
    };

    const handlePhotoTaken = (uri?: string) => {
        console.log('Photo received in assessment overlay:', uri);
        setCameraVisible(false);
        if (uri) {
            setPhotoUri(uri);
            setPhotoTaken(true);
            console.log('Photo state updated, photoTaken:', true);
        }
    };

    const handleCameraClose = () => {
        setCameraVisible(false);
    };

    const handleSubmit = async () => {
        try {
            // Submit assessment to backend
            const assessmentResult = await submitAssessment(
                {
                    q1: damageRating?.toString() || "0",
                    q2: shelterRating?.toString() || "0",
                    q3: preparednessRating?.toString() || "0",
                    latitude: userLocation?.latitude,
                    longitude: userLocation?.longitude,
                },
                // Note: photoUri is a string, need to convert to File for actual upload
                // For now, we'll skip the image upload in the API call
                null
            );

            console.log('Assessment submitted successfully:', assessmentResult);
            setStage('complete');
        } catch (error) {
            console.error('Error submitting assessment:', error);
            // Still move to complete stage even on error for now
            setStage('complete');
        }
    };

    const RatingButton = ({ value, selected, onPress }: { value: number, selected: boolean, onPress: () => void }) => (
        <Pressable onPress={onPress}>
            <View 
                className={`w-12 h-12 rounded-xl items-center justify-center border ${
                    selected ? 'border-blue-400' : 'border-gray-600'
                }`}
                style={{ 
                    backgroundColor: selected ? 'rgba(59, 130, 246, 0.25)' : 'rgba(156, 163, 175, 0.1)'
                }}
            >
                <Text className={`text-xl font-bold ${selected ? 'text-blue-400' : 'text-gray-400'}`}>
                    {value}
                </Text>
            </View>
        </Pressable>
    );

    const renderStage = () => {
        if (hasCompleted) {
            return (
                <View className="w-full px-6">
                    <Text className="text-green-400 text-3xl font-bold mb-6 text-center">
                        ✓ Already Completed
                    </Text>
                    <Text className="text-white text-lg mb-4 text-center">
                        You have already submitted your post-flood assessment.
                    </Text>
                    <Text className="text-gray-300 text-base mb-8 text-center leading-6">
                        Thank you for helping us understand the impact of the flood in your area.
                    </Text>

                    <Pressable onPress={handleClose}>
                        <View 
                            className="px-6 py-4 rounded-2xl border border-blue-400/50"
                            style={{ backgroundColor: 'rgba(59, 130, 246, 0.15)' }}
                        >
                            <Text className="text-blue-400 text-lg font-semibold text-center">
                                Close
                            </Text>
                        </View>
                    </Pressable>
                </View>
            );
        }

        switch(stage) {
            case 'intro':
                return (
                    <View className="w-full px-6">
                        <Text className="text-white text-3xl font-bold text-center mb-3">
                            Post-Flood Assessment
                        </Text>
                        <Text className="text-gray-300 text-base text-center mb-8 leading-6">
                            Help us understand the impact of the flood in your area by answering a few questions and sharing a photo.
                        </Text>

                        {/* Regional Statistics - Show if available */}
                        {!userLocation && (
                            <View className="mb-6">
                                <Text className="text-gray-400 text-sm text-center mb-4">
                                    📍 Loading regional data...
                                </Text>
                            </View>
                        )}
                        
                        {userLocation && regionalStats && regionalStats.assessmentCount > 0 && (
                            <View className="mb-6">
                                <Text className="text-blue-400 text-base font-semibold mb-3 text-center">
                                    Regional Data (within 5 miles)
                                </Text>
                                <View className="flex-row gap-3 mb-3">
                                    <DataBox 
                                        data={`${regionalStats.avgDamage}/10`} 
                                        desc="Neighbourhood Damage" 
                                    />
                                    <DataBox 
                                        data={`${regionalStats.avgShelter}/10`} 
                                        desc="Shelter Availability" 
                                    />
                                </View>
                                <Text className="text-gray-400 text-xs text-center mb-4">
                                    Based on {regionalStats.assessmentCount} assessment{regionalStats.assessmentCount !== 1 ? 's' : ''} in your area
                                </Text>
                            </View>
                        )}
                        
                        {userLocation && regionalStats && regionalStats.assessmentCount === 0 && (
                            <View className="mb-6">
                                <Text className="text-gray-400 text-sm text-center mb-4">
                                    No regional assessment data available within 5 miles
                                </Text>
                            </View>
                        )}

                        <View 
                            className="px-6 py-6 rounded-2xl border border-blue-400/30 mb-6"
                            style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)' }}
                        >
                            <Text className="text-blue-400 text-base font-semibold mb-3 text-center">
                                What we'll ask:
                            </Text>
                            <Text className="text-gray-300 text-sm leading-5">
                                • Photo of your area{'\n'}
                                • Damage severity (1-10){'\n'}
                                • Shelter availability (1-10){'\n'}
                                • Flood preparedness (1-10)
                            </Text>
                        </View>

                        <Pressable onPress={() => setStage('photo')}>
                            <View 
                                className="px-6 py-4 rounded-2xl border border-blue-400/50"
                                style={{ backgroundColor: 'rgba(59, 130, 246, 0.15)' }}
                            >
                                <Text className="text-blue-400 text-lg font-semibold text-center">
                                    Begin Assessment
                                </Text>
                            </View>
                        </Pressable>
                    </View>
                );

            case 'photo':
                return (
                    <View className="w-full px-6">
                        <Text className="text-white text-2xl font-bold mb-6 text-center">
                            Photo Documentation
                        </Text>
                        <Text className="text-gray-300 text-sm mb-6 text-center">
                            Take a photo of your area to document the flood impact
                        </Text>

                        {!photoTaken ? (
                            <Pressable onPress={handleTakePhoto}>
                                <View 
                                    className="px-6 py-12 rounded-2xl border-2 border-dashed border-blue-400/50 mb-6"
                                    style={{ backgroundColor: 'rgba(59, 130, 246, 0.05)' }}
                                >
                                    <Text className="text-blue-400 text-6xl text-center mb-3">
                                        📷
                                    </Text>
                                    <Text className="text-blue-400 text-base font-semibold text-center">
                                        Tap to Take Photo
                                    </Text>
                                </View>
                            </Pressable>
                        ) : (
                            <View className="mb-6">
                                {photoUri && (
                                    <Image 
                                        source={{ uri: photoUri }}
                                        className="w-full rounded-2xl mb-4"
                                        style={{ height: 300 }}
                                        resizeMode="cover"
                                    />
                                )}
                                <View 
                                    className="px-6 py-4 rounded-2xl border border-green-400/50"
                                    style={{ backgroundColor: 'rgba(34, 197, 94, 0.15)' }}
                                >
                                    <Text className="text-green-400 text-base font-semibold text-center">
                                        ✓ Photo Captured
                                    </Text>
                                </View>
                                <Pressable onPress={handleTakePhoto} className="mt-3">
                                    <Text className="text-blue-400 text-sm text-center underline">
                                        Retake Photo
                                    </Text>
                                </Pressable>
                            </View>
                        )}

                        {photoTaken && (
                            <Pressable onPress={() => setStage('damage')}>
                                <View 
                                    className="px-6 py-4 rounded-2xl border border-blue-400/50"
                                    style={{ backgroundColor: 'rgba(59, 130, 246, 0.15)' }}
                                >
                                    <Text className="text-blue-400 text-lg font-semibold text-center">
                                        Next
                                    </Text>
                                </View>
                            </Pressable>
                        )}
                    </View>
                );

            case 'damage':
                return (
                    <View className="w-full px-6">
                        <Text className="text-white text-2xl font-bold mb-4 text-center">
                            Damage Assessment
                        </Text>
                        <Text className="text-gray-300 text-base mb-2 text-center">
                            How severe was the damage caused to your area?
                        </Text>
                        <Text className="text-gray-400 text-sm mb-6 text-center">
                            1 = Minimal damage • 10 = Severe damage
                        </Text>

                        <View className="mb-8">
                            <View className="flex-row justify-between mb-4 px-2">
                                {[1, 2, 3, 4, 5].map((num) => (
                                    <RatingButton
                                        key={num}
                                        value={num}
                                        selected={damageRating === num}
                                        onPress={() => setDamageRating(num)}
                                    />
                                ))}
                            </View>
                            <View className="flex-row justify-between px-2">
                                {[6, 7, 8, 9, 10].map((num) => (
                                    <RatingButton
                                        key={num}
                                        value={num}
                                        selected={damageRating === num}
                                        onPress={() => setDamageRating(num)}
                                    />
                                ))}
                            </View>
                        </View>

                        {damageRating !== null && (
                            <Pressable onPress={() => setStage('shelter')}>
                                <View 
                                    className="px-6 py-4 rounded-2xl border border-blue-400/50"
                                    style={{ backgroundColor: 'rgba(59, 130, 246, 0.15)' }}
                                >
                                    <Text className="text-blue-400 text-lg font-semibold text-center">
                                        Next
                                    </Text>
                                </View>
                            </Pressable>
                        )}
                    </View>
                );

            case 'shelter':
                return (
                    <View className="w-full px-6">
                        <Text className="text-white text-2xl font-bold mb-4 text-center">
                            Shelter Availability
                        </Text>
                        <Text className="text-gray-300 text-base mb-2 text-center">
                            How able are you to find adequate shelter?
                        </Text>
                        <Text className="text-gray-400 text-sm mb-6 text-center">
                            1 = No shelter available • 10 = Excellent shelter
                        </Text>

                        <View className="mb-8">
                            <View className="flex-row justify-between mb-4 px-2">
                                {[1, 2, 3, 4, 5].map((num) => (
                                    <RatingButton
                                        key={num}
                                        value={num}
                                        selected={shelterRating === num}
                                        onPress={() => setShelterRating(num)}
                                    />
                                ))}
                            </View>
                            <View className="flex-row justify-between px-2">
                                {[6, 7, 8, 9, 10].map((num) => (
                                    <RatingButton
                                        key={num}
                                        value={num}
                                        selected={shelterRating === num}
                                        onPress={() => setShelterRating(num)}
                                    />
                                ))}
                            </View>
                        </View>

                        {shelterRating !== null && (
                            <Pressable onPress={() => setStage('preparedness')}>
                                <View 
                                    className="px-6 py-4 rounded-2xl border border-blue-400/50"
                                    style={{ backgroundColor: 'rgba(59, 130, 246, 0.15)' }}
                                >
                                    <Text className="text-blue-400 text-lg font-semibold text-center">
                                        Next
                                    </Text>
                                </View>
                            </Pressable>
                        )}
                    </View>
                );

            case 'preparedness':
                return (
                    <View className="w-full px-6">
                        <Text className="text-white text-2xl font-bold mb-4 text-center">
                            Flood Preparedness
                        </Text>
                        <Text className="text-gray-300 text-base mb-2 text-center">
                            How prepared were you for this flood?
                        </Text>
                        <Text className="text-gray-400 text-sm mb-6 text-center">
                            1 = Not prepared • 10 = Fully prepared
                        </Text>

                        <View className="mb-8">
                            <View className="flex-row justify-between mb-4 px-2">
                                {[1, 2, 3, 4, 5].map((num) => (
                                    <RatingButton
                                        key={num}
                                        value={num}
                                        selected={preparednessRating === num}
                                        onPress={() => setPreparednessRating(num)}
                                    />
                                ))}
                            </View>
                            <View className="flex-row justify-between px-2">
                                {[6, 7, 8, 9, 10].map((num) => (
                                    <RatingButton
                                        key={num}
                                        value={num}
                                        selected={preparednessRating === num}
                                        onPress={() => setPreparednessRating(num)}
                                    />
                                ))}
                            </View>
                        </View>

                        {preparednessRating !== null && (
                            <Pressable onPress={handleSubmit}>
                                <View 
                                    className="px-6 py-4 rounded-2xl border border-green-400/50"
                                    style={{ backgroundColor: 'rgba(34, 197, 94, 0.15)' }}
                                >
                                    <Text className="text-green-400 text-lg font-semibold text-center">
                                        Submit Assessment
                                    </Text>
                                </View>
                            </Pressable>
                        )}
                    </View>
                );

            case 'complete':
                return (
                    <View className="w-full px-6">
                        <Text className="text-green-400 text-3xl font-bold mb-6 text-center">
                            ✓ Assessment Complete
                        </Text>
                        <Text className="text-white text-lg mb-4 text-center">
                            Thank you for completing the post-flood assessment.
                        </Text>
                        <Text className="text-gray-300 text-base mb-8 text-center leading-6">
                            Your feedback helps emergency services understand the flood's impact and allocate resources more effectively.
                        </Text>

                        <View 
                            className="px-6 py-6 rounded-2xl border border-blue-400/30 mb-6"
                            style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)' }}
                        >
                            <Text className="text-blue-400 text-base text-center mb-2 font-semibold">
                                Your Ratings
                            </Text>
                            <Text className="text-gray-300 text-sm text-center leading-5">
                                Damage: {damageRating}/10{'\n'}
                                Shelter: {shelterRating}/10{'\n'}
                                Preparedness: {preparednessRating}/10
                            </Text>
                        </View>

                        <Pressable onPress={handleClose}>
                            <View 
                                className="px-6 py-4 rounded-2xl border border-blue-400/50"
                                style={{ backgroundColor: 'rgba(59, 130, 246, 0.15)' }}
                            >
                                <Text className="text-blue-400 text-lg font-semibold text-center">
                                    Done
                                </Text>
                            </View>
                        </Pressable>
                    </View>
                );

            default:
                return null;
        }
    };

    return (
        <Overlay isVisible={isVisible}>
            <View className="flex-1">
                <ScrollView 
                    contentContainerStyle={{ 
                        flexGrow: 1, 
                        justifyContent: 'center',
                        paddingVertical: 60,
                        paddingTop: 120
                    }}
                >
                    {renderStage()}
                </ScrollView>
                <CloseOverlayButton closeFunction={handleClose} icon={closeIcon} />
            </View>
            <CameraOverlay 
                isVisible={cameraVisible} 
                onClose={handleCameraClose} 
                onPictureTaken={handlePhotoTaken} 
            />
        </Overlay>
    );
}
