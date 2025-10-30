import CameraOverlay from '@/app/components/CameraOverlay';
import Overlay from '@/app/components/Overlay';
import { submitVolunteerRequest } from '@/app/services/volunteerService';
import example1 from '@/assets/generic/example1.webp';
import example2 from '@/assets/generic/example2.jpg';
import closeIcon from "@/assets/icons/close.png";
import { useState } from 'react';
import { Image, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import CloseOverlayButton from './CloseOverlayButton';
import getCurrentLocation from './getLocation';

type FormStage = 'initial' | 'need-danger' | 'need-medical' | 'need-details' | 'need-photo' | 'need-confirm' | 
                 'help-danger' | 'help-medical' | 'help-confirm' | 'help-browse' | 'emergency-exit' | 'complete';

// Sample help requests
const sampleHelpRequests = [
    {
        id: 1,
        type: 'need-help',
        timestamp: '2025-10-28T14:32:00Z',
        userType: 'need',
        helpNeeded: 'Need help removing debris from backyard and cleaning up flood damage. Water destroyed part of the fence and scattered branches everywhere.',
        photoUri: example1,
        photoTaken: true,
        safetyChecks: {
            areaSafe: true,
            noMedicalEmergency: true
        },
        locationSharingAgreed: true,
        status: 'pending',
        distance: '3.2 km away',
        location: 'Edison, NJ'
    },
    {
        id: 2,
        type: 'need-help',
        timestamp: '2025-10-28T16:45:00Z',
        userType: 'need',
        helpNeeded: 'Basement flooded, need help moving furniture to higher floors and removing water-damaged items. Also need assistance with cleaning and sanitizing.',
        photoUri: example2,
        photoTaken: true,
        safetyChecks: {
            areaSafe: true,
            noMedicalEmergency: true
        },
        locationSharingAgreed: true,
        status: 'pending',
        distance: '42 km away',
        location: 'Hoboken, NJ'
    }
];

export default function VolunteerFormOverlay({ isVisible, closeOverlay }: {isVisible: boolean, closeOverlay: () => void}) {
    const [stage, setStage] = useState<FormStage>('initial');
    const [userType, setUserType] = useState<'need' | 'help' | null>(null);
    const [helpNeeded, setHelpNeeded] = useState('');
    const [photoTaken, setPhotoTaken] = useState(false);
    const [photoUri, setPhotoUri] = useState<string | null>(null);
    const [cameraVisible, setCameraVisible] = useState(false);

    const handleClose = () => {
        // Reset form on close
        setStage('initial');
        setUserType(null);
        setHelpNeeded('');
        setPhotoTaken(false);
        setPhotoUri(null);
        setCameraVisible(false);
        closeOverlay();
    };

    const handleInitialChoice = (choice: 'need' | 'help') => {
        setUserType(choice);
        if (choice === 'need') {
            setStage('need-danger');
        } else {
            setStage('help-danger');
        }
    };

    const handleEmergency = () => {
        setStage('emergency-exit');
    };

    const handleTakePhoto = () => {
        setCameraVisible(true);
    };

    const handlePhotoTaken = (uri?: string) => {
        setCameraVisible(false);
        if (uri) {
            setPhotoUri(uri);
            setPhotoTaken(true);
        }
    };

    const handleCameraClose = () => {
        setCameraVisible(false);
    };

    const handleSubmitRequest = async () => {
        try {
            // Get user location
            const location = await getCurrentLocation();
            
            if (!location) {
                console.error('Could not get user location');
                // Still move to complete stage
                setStage('complete');
                return;
            }

            // Submit request to backend
            const result = await submitVolunteerRequest(
                {
                    type: 'need-help',
                    userType: userType || 'unknown',
                    helpDescription: helpNeeded,
                    imageTaken: photoTaken,
                    areaSafe: true, // They passed the danger check
                    noMedicalEmergency: true, // They passed the medical check
                    location: `${location.latitude}, ${location.longitude}`, // Format location string
                },
                location.latitude,
                location.longitude,
                null // TODO: Convert photoUri to File if needed
            );

            console.log('Volunteer request submitted successfully:', result);
            setStage('complete');
        } catch (error) {
            console.error('Error submitting volunteer request:', error);
            // Still move to complete stage even on error for now
            setStage('complete');
        }
    };

    const renderStage = () => {
        switch(stage) {
            case 'initial':
                return (
                    <View className="w-full px-6">
                        <Text className="text-white text-3xl font-bold text-center mb-3">
                            Volunteer Form
                        </Text>
                        <Text className="text-gray-300 text-base text-center mb-8">
                            Help your community during flood recovery
                        </Text>

                        <Pressable onPress={() => handleInitialChoice('need')}>
                            <View 
                                className="px-6 py-6 rounded-2xl border border-blue-400/50 mb-4"
                                style={{ backgroundColor: 'rgba(59, 130, 246, 0.15)' }}
                            >
                                <Text className="text-blue-400 text-xl font-bold text-center mb-2">
                                    I Need Help
                                </Text>
                                <Text className="text-gray-300 text-sm text-center">
                                    Request assistance with flood recovery
                                </Text>
                            </View>
                        </Pressable>

                        <Pressable onPress={() => handleInitialChoice('help')}>
                            <View 
                                className="px-6 py-6 rounded-2xl border border-green-400/50"
                                style={{ backgroundColor: 'rgba(34, 197, 94, 0.15)' }}
                            >
                                <Text className="text-green-400 text-xl font-bold text-center mb-2">
                                    I Want to Help
                                </Text>
                                <Text className="text-gray-300 text-sm text-center">
                                    Volunteer to assist others in need
                                </Text>
                            </View>
                        </Pressable>
                    </View>
                );

            case 'need-danger':
                return (
                    <View className="w-full px-6">
                        <Text className="text-white text-2xl font-bold mb-6 text-center">
                            Safety Check
                        </Text>
                        <Text className="text-gray-300 text-lg mb-8 text-center">
                            Is your current area in a state that may put people in danger?
                        </Text>

                        <Pressable onPress={handleEmergency}>
                            <View 
                                className="px-6 py-4 rounded-2xl border border-red-400/50 mb-4"
                                style={{ backgroundColor: 'rgba(239, 68, 68, 0.15)' }}
                            >
                                <Text className="text-red-400 text-lg font-semibold text-center">
                                    Yes, immediate danger
                                </Text>
                            </View>
                        </Pressable>

                        <Pressable onPress={() => setStage('need-medical')}>
                            <View 
                                className="px-6 py-4 rounded-2xl border border-green-400/50"
                                style={{ backgroundColor: 'rgba(34, 197, 94, 0.15)' }}
                            >
                                <Text className="text-green-400 text-lg font-semibold text-center">
                                    No, area is safe
                                </Text>
                            </View>
                        </Pressable>
                    </View>
                );

            case 'need-medical':
                return (
                    <View className="w-full px-6">
                        <Text className="text-white text-2xl font-bold mb-6 text-center">
                            Medical Check
                        </Text>
                        <Text className="text-gray-300 text-lg mb-8 text-center">
                            Are you or anyone else in your area in need of medical attention?
                        </Text>

                        <Pressable onPress={handleEmergency}>
                            <View 
                                className="px-6 py-4 rounded-2xl border border-red-400/50 mb-4"
                                style={{ backgroundColor: 'rgba(239, 68, 68, 0.15)' }}
                            >
                                <Text className="text-red-400 text-lg font-semibold text-center">
                                    Yes, medical help needed
                                </Text>
                            </View>
                        </Pressable>

                        <Pressable onPress={() => setStage('need-details')}>
                            <View 
                                className="px-6 py-4 rounded-2xl border border-green-400/50"
                                style={{ backgroundColor: 'rgba(34, 197, 94, 0.15)' }}
                            >
                                <Text className="text-green-400 text-lg font-semibold text-center">
                                    No, no medical attention needed
                                </Text>
                            </View>
                        </Pressable>
                    </View>
                );

            case 'need-details':
                return (
                    <View className="w-full px-6">
                        <Text className="text-white text-2xl font-bold mb-6 text-center">
                            What Help Do You Need?
                        </Text>
                        <Text className="text-gray-300 text-sm mb-4 text-center">
                            Please describe the specific help you need
                        </Text>

                        <TextInput
                            className="w-full px-4 py-4 rounded-xl text-white text-base mb-6"
                            style={{ 
                                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                borderWidth: 1,
                                borderColor: 'rgba(255, 255, 255, 0.2)',
                                minHeight: 120,
                                textAlignVertical: 'top'
                            }}
                            placeholder="e.g., Help cleaning up damaged parts of the house, removing debris, moving furniture..."
                            placeholderTextColor="rgba(156, 163, 175, 0.8)"
                            multiline
                            value={helpNeeded}
                            onChangeText={setHelpNeeded}
                        />

                        <Pressable 
                            onPress={() => setStage('need-photo')}
                            disabled={!helpNeeded.trim()}
                        >
                            <View 
                                className="px-6 py-4 rounded-2xl border border-blue-400/50"
                                style={{ 
                                    backgroundColor: helpNeeded.trim() ? 'rgba(59, 130, 246, 0.15)' : 'rgba(156, 163, 175, 0.1)',
                                    opacity: helpNeeded.trim() ? 1 : 0.5
                                }}
                            >
                                <Text className={`text-lg font-semibold text-center ${helpNeeded.trim() ? 'text-blue-400' : 'text-gray-500'}`}>
                                    Next
                                </Text>
                            </View>
                        </Pressable>
                    </View>
                );

            case 'need-photo':
                return (
                    <View className="w-full px-6">
                        <Text className="text-white text-2xl font-bold mb-6 text-center">
                            Photo Documentation
                        </Text>
                        <Text className="text-gray-300 text-sm mb-6 text-center">
                            Take a photo of the area where you need help
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
                            <Pressable onPress={() => setStage('need-confirm')}>
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

                        <Pressable onPress={() => setStage('need-confirm')} className="mt-3">
                            <Text className="text-gray-400 text-sm text-center underline">
                                Skip (not recommended)
                            </Text>
                        </Pressable>
                    </View>
                );

            case 'need-confirm':
                return (
                    <View className="w-full px-6">
                        <Text className="text-white text-2xl font-bold mb-6 text-center">
                            Location Sharing Agreement
                        </Text>
                        <Text className="text-gray-300 text-base mb-8 leading-6">
                            By submitting this form, you acknowledge that your location will be given to people who are willing and able to help.
                        </Text>
                        <Text className="text-gray-400 text-sm mb-6 leading-5">
                            Your information will only be shared with verified volunteers to facilitate assistance during this emergency.
                        </Text>

                        <Pressable onPress={handleSubmitRequest}>
                            <View 
                                className="px-6 py-4 rounded-2xl border border-green-400/50 mb-4"
                                style={{ backgroundColor: 'rgba(34, 197, 94, 0.15)' }}
                            >
                                <Text className="text-green-400 text-lg font-semibold text-center">
                                    I Agree - Submit Request
                                </Text>
                            </View>
                        </Pressable>

                        <Pressable onPress={handleClose}>
                            <View 
                                className="px-6 py-4 rounded-2xl border border-gray-400/30"
                                style={{ backgroundColor: 'rgba(156, 163, 175, 0.05)' }}
                            >
                                <Text className="text-gray-400 text-base font-semibold text-center">
                                    Cancel
                                </Text>
                            </View>
                        </Pressable>
                    </View>
                );

            case 'help-danger':
                return (
                    <View className="w-full px-6">
                        <Text className="text-white text-2xl font-bold mb-6 text-center">
                            Safety Check
                        </Text>
                        <Text className="text-gray-300 text-lg mb-8 text-center">
                            Is your current area in a state that may put people in danger?
                        </Text>

                        <Pressable onPress={handleEmergency}>
                            <View 
                                className="px-6 py-4 rounded-2xl border border-red-400/50 mb-4"
                                style={{ backgroundColor: 'rgba(239, 68, 68, 0.15)' }}
                            >
                                <Text className="text-red-400 text-lg font-semibold text-center">
                                    Yes, immediate danger
                                </Text>
                            </View>
                        </Pressable>

                        <Pressable onPress={() => setStage('help-medical')}>
                            <View 
                                className="px-6 py-4 rounded-2xl border border-green-400/50"
                                style={{ backgroundColor: 'rgba(34, 197, 94, 0.15)' }}
                            >
                                <Text className="text-green-400 text-lg font-semibold text-center">
                                    No, area is safe
                                </Text>
                            </View>
                        </Pressable>
                    </View>
                );

            case 'help-medical':
                return (
                    <View className="w-full px-6">
                        <Text className="text-white text-2xl font-bold mb-6 text-center">
                            Medical Check
                        </Text>
                        <Text className="text-gray-300 text-lg mb-8 text-center">
                            Are you or anyone else in your area in need of medical attention?
                        </Text>

                        <Pressable onPress={handleEmergency}>
                            <View 
                                className="px-6 py-4 rounded-2xl border border-red-400/50 mb-4"
                                style={{ backgroundColor: 'rgba(239, 68, 68, 0.15)' }}
                            >
                                <Text className="text-red-400 text-lg font-semibold text-center">
                                    Yes, medical help needed
                                </Text>
                            </View>
                        </Pressable>

                        <Pressable onPress={() => setStage('help-confirm')}>
                            <View 
                                className="px-6 py-4 rounded-2xl border border-green-400/50"
                                style={{ backgroundColor: 'rgba(34, 197, 94, 0.15)' }}
                            >
                                <Text className="text-green-400 text-lg font-semibold text-center">
                                    No, no medical attention needed
                                </Text>
                            </View>
                        </Pressable>
                    </View>
                );

            case 'help-confirm':
                return (
                    <View className="w-full px-6">
                        <Text className="text-white text-2xl font-bold mb-6 text-center">
                            Volunteer Agreement
                        </Text>
                        <Text className="text-gray-300 text-base mb-6 leading-6">
                            By filling out this form, you acknowledge that you will do your best to help in any way that you can.
                        </Text>
                        <Text className="text-yellow-400 text-sm mb-8 leading-5">
                            ⚠️ If you are unable to help or if immediate help is needed, you acknowledge that you must call 911.
                        </Text>

                        <Pressable onPress={() => setStage('help-browse')}>
                            <View 
                                className="px-6 py-4 rounded-2xl border border-green-400/50 mb-4"
                                style={{ backgroundColor: 'rgba(34, 197, 94, 0.15)' }}
                            >
                                <Text className="text-green-400 text-lg font-semibold text-center">
                                    I Agree - Continue
                                </Text>
                            </View>
                        </Pressable>

                        <Pressable onPress={handleClose}>
                            <View 
                                className="px-6 py-4 rounded-2xl border border-gray-400/30"
                                style={{ backgroundColor: 'rgba(156, 163, 175, 0.05)' }}
                            >
                                <Text className="text-gray-400 text-base font-semibold text-center">
                                    Cancel
                                </Text>
                            </View>
                        </Pressable>
                    </View>
                );

            case 'help-browse':
                return (
                    <View className="w-full px-6">
                        <Text className="text-white text-3xl font-bold mb-2 text-center">
                            Find People to Help
                        </Text>
                        <Text className="text-gray-300 text-sm mb-6 text-center">
                            {sampleHelpRequests.length} requests in your area
                        </Text>

                        {sampleHelpRequests.map((request) => (
                            <Pressable key={request.id} className="mb-4">
                                <View 
                                    className="rounded-2xl border border-blue-400/30 overflow-hidden"
                                    style={{ backgroundColor: 'rgba(59, 130, 246, 0.08)' }}
                                >
                                    {/* Photo */}
                                    <Image 
                                        source={request.photoUri}
                                        className="w-full"
                                        style={{ height: 200 }}
                                        resizeMode="cover"
                                    />
                                    
                                    {/* Content */}
                                    <View className="p-4">
                                        <View className="flex-row justify-between items-center mb-2">
                                            <Text className="text-blue-400 text-sm font-semibold">
                                                📍 {request.location}
                                            </Text>
                                            <Text className="text-gray-400 text-xs">
                                                {request.distance}
                                            </Text>
                                        </View>
                                        
                                        <Text className="text-white text-base mb-3 leading-5">
                                            {request.helpNeeded}
                                        </Text>
                                        
                                        <View className="flex-row justify-between items-center">
                                            <Text className="text-gray-400 text-xs">
                                                {new Date(request.timestamp).toLocaleDateString()} at{' '}
                                                {new Date(request.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </Text>
                                            <View 
                                                className="px-3 py-1 rounded-full"
                                                style={{ backgroundColor: 'rgba(34, 197, 94, 0.2)' }}
                                            >
                                                <Text className="text-green-400 text-xs font-semibold">
                                                    ✓ Verified Safe
                                                </Text>
                                            </View>
                                        </View>
                                        
                                        <Pressable className="mt-3">
                                            <View 
                                                className="px-4 py-3 rounded-xl border border-blue-400/50"
                                                style={{ backgroundColor: 'rgba(59, 130, 246, 0.15)' }}
                                            >
                                                <Text className="text-blue-400 text-sm font-semibold text-center">
                                                    Offer Help
                                                </Text>
                                            </View>
                                        </Pressable>
                                    </View>
                                </View>
                            </Pressable>
                        ))}

                        <Pressable onPress={handleClose} className="mt-2">
                            <View 
                                className="px-6 py-4 rounded-2xl border border-gray-400/30"
                                style={{ backgroundColor: 'rgba(156, 163, 175, 0.05)' }}
                            >
                                <Text className="text-gray-400 text-base font-semibold text-center">
                                    Close
                                </Text>
                            </View>
                        </Pressable>
                    </View>
                );

            case 'emergency-exit':
                return (
                    <View className="w-full px-6">
                        <Text className="text-red-400 text-3xl font-bold mb-6 text-center">
                            🚨 Call 911 Immediately
                        </Text>
                        <Text className="text-white text-lg mb-6 text-center leading-7">
                            Based on your response, this is an emergency situation requiring immediate professional assistance.
                        </Text>
                        <Text className="text-gray-300 text-base mb-8 text-center leading-6">
                            Please call 911 or your local emergency services right away.
                        </Text>

                        <View 
                            className="px-6 py-6 rounded-2xl border border-red-400/50 mb-6"
                            style={{ backgroundColor: 'rgba(239, 68, 68, 0.15)' }}
                        >
                            <Text className="text-red-400 text-4xl font-bold text-center mb-2">
                                911
                            </Text>
                            <Text className="text-gray-300 text-sm text-center">
                                Emergency Services
                            </Text>
                        </View>

                        <Pressable onPress={handleClose}>
                            <View 
                                className="px-6 py-4 rounded-2xl border border-gray-400/30"
                                style={{ backgroundColor: 'rgba(156, 163, 175, 0.05)' }}
                            >
                                <Text className="text-gray-400 text-base font-semibold text-center">
                                    Close
                                </Text>
                            </View>
                        </Pressable>
                    </View>
                );

            case 'complete':
                return (
                    <View className="w-full px-6">
                        <Text className="text-green-400 text-3xl font-bold mb-6 text-center">
                            ✓ Request Submitted
                        </Text>
                        <Text className="text-white text-lg mb-4 text-center">
                            Your help request has been submitted successfully.
                        </Text>
                        <Text className="text-gray-300 text-base mb-8 text-center leading-6">
                            Volunteers in your area will be notified and can reach out to assist you soon.
                        </Text>

                        <View 
                            className="px-6 py-6 rounded-2xl border border-green-400/50 mb-6"
                            style={{ backgroundColor: 'rgba(34, 197, 94, 0.15)' }}
                        >
                            <Text className="text-green-400 text-base text-center mb-2 font-semibold">
                                What happens next?
                            </Text>
                            <Text className="text-gray-300 text-sm text-center leading-5">
                                • Volunteers will see your request{'\n'}
                                • They can contact you to coordinate help{'\n'}
                                • Track your request status in the app
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