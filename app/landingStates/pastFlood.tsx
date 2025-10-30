import DataBox from '@/app/components/DataBox';
import DonateOverlay from "@/app/components/DonateOverlay";
import getCurrentLocation from '@/app/components/getLocation';
import Icon from '@/app/components/Icon';
import NavigationBar from '@/app/components/NavigationBar';
import Page from '@/app/components/Page';
import PostFloodAssessmentOverlay from '@/app/components/PostFloodAssessmentOverlay';
import { calculateRegionalStats, PostFloodAssessment } from '@/app/components/regionalStats';
import StatusBox from '@/app/components/StatusBox';
import VolunteerFormOverlay from '@/app/components/VolunteerFormOverlay';
import postFloodAssessmentsData from '@/app/static/data/postFloodAssessments.json';
import donate from "@/assets/icons/donate.png";
import volunteer from "@/assets/icons/volunteer.png";
import { Location } from '@/types/types';
import { useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";


export default function PastFlood({setFloodLevel}: {setFloodLevel: (level: string) => void }) {
    const [ pageStatus, setPageStatus ] = useState("main");
    const [ assessmentCompleted, setAssessmentCompleted ] = useState(false);
    const [ userLocation, setUserLocation ] = useState<Location | null>(null);
    const [ avgDamage, setAvgDamage ] = useState<number>(0);
    const [ avgShelter, setAvgShelter ] = useState<number>(0);
    
    const formVisible = pageStatus === "form";
    const donateVisible = pageStatus === "donate";
    const assessmentVisible = pageStatus === "assessment";

    // Get user location and calculate regional stats on mount
    useEffect(() => {
        getCurrentLocation().then(location => {
            if (location) {
                setUserLocation(location);
                const stats = calculateRegionalStats(
                    location,
                    postFloodAssessmentsData as PostFloodAssessment[]
                );
                setAvgDamage(stats.avgDamage);
                setAvgShelter(stats.avgShelter);
            }
        }).catch(error => {
            console.error('Error getting location:', error);
        });
    }, []);

    // Auto-show assessment after 5 seconds if not already completed
    useEffect(() => {
        if (!assessmentCompleted) {
            const timer = setTimeout(() => {
                setPageStatus("assessment");
            }, 5000);

            return () => clearTimeout(timer);
        }
    }, [assessmentCompleted]);

    const handleFormVisibility = () => {
        if (pageStatus === "main") setPageStatus("form");
        else setPageStatus("main");
    }

    const handleDonateVisibility = () => {
        if (pageStatus === "main") setPageStatus("donate");
        else setPageStatus("main");
    }

    const handleAssessmentVisibility = () => {
        if (pageStatus === "main") setPageStatus("assessment");
        else {
            setPageStatus("main");
            // Mark as completed when they close the assessment (after finishing)
            if (pageStatus === "assessment") {
                setAssessmentCompleted(true);
            }
        }
    }

    return (
        <>
            <Page status={"Recent Flood. Volunteers Needed"}>
                <View className="w-full px-3 gap-3">
                    <StatusBox status="Post-Flood Recovery" icon="🔧" />

                    <View className="flex-row gap-3">
                        <DataBox 
                            data={avgDamage > 0 ? `${avgDamage}/10` : "---"} 
                            desc="Neighbourhood Damage"
                            accentColor="text-orange-400"
                            borderColor="border-orange-400/30"
                            bgColor="rgba(251, 146, 60, 0.1)"
                        />
                        <DataBox 
                            data={avgShelter > 0 ? `${avgShelter}/10` : "---"} 
                            desc="Shelter Availability"
                            accentColor="text-purple-400"
                            borderColor="border-purple-400/30"
                            bgColor="rgba(192, 132, 252, 0.1)"
                        />
                    </View>

                    <View className="flex-row gap-3">
                        <DataBox data="70°F" desc="Current Temperature" />
                        <DataBox data="0.1″" desc="Rainfall (24 hrs)" />
                    </View>

                    <View className="flex-row gap-3">
                        <DataBox data="55%" desc="Humidity" />
                        <DataBox data="Low" desc="Current Risk" />
                    </View>

                    <View className="flex-row gap-3">
                        <DataBox data="4.5 ft" desc="Water Level" />
                        <DataBox data="Receding" desc="River Conditions" />
                    </View>

                    <View className="flex-row gap-3">
                        <DataBox data="23" desc="Volunteers Active" />
                        <DataBox data="12" desc="Areas Cleared" />
                    </View>

                    {/* Navigation Button */}
                    <Pressable onPress={() => setFloodLevel("noFlood")}>
                        <View
                            className="px-6 py-4 rounded-2xl border border-green-400/50"
                            style={{ backgroundColor: 'rgba(34, 197, 94, 0.1)' }}
                        >
                            <Text className="text-green-400 text-base font-semibold text-center">
                                → Reset to No Flood
                            </Text>
                            <Text className="text-gray-400 text-sm text-center mt-1">
                                Start testing cycle over
                            </Text>
                        </View>
                    </Pressable>

                    <Pressable onPress={() => setFloodLevel("yesFlood")}>
                        <View
                            className="px-6 py-4 rounded-2xl border border-gray-400/30"
                            style={{ backgroundColor: 'rgba(156, 163, 175, 0.05)' }}
                        >
                            <Text className="text-gray-400 text-base font-semibold text-center">
                                ← Back to Active Flood
                            </Text>
                        </View>
                    </Pressable>
                </View>
            </Page>
            <NavigationBar>
                <Icon image={volunteer} size={32} onPress={handleFormVisibility} />
                <Icon image={donate} size={32} onPress={handleDonateVisibility} />
            </NavigationBar>
            <PostFloodAssessmentOverlay 
                isVisible={assessmentVisible} 
                closeOverlay={handleAssessmentVisibility}
                hasCompleted={assessmentCompleted}
            />
            <VolunteerFormOverlay isVisible={formVisible} closeOverlay={handleFormVisibility} />
            <DonateOverlay isVisible={donateVisible} closeOverlay={handleDonateVisibility} />
        </>
    );
}