import DataBox from '@/app/components/DataBox';
import Icon from '@/app/components/Icon';
import NavigationBar from '@/app/components/NavigationBar';
import Page from '@/app/components/Page';
import StatusBox from '@/app/components/StatusBox';
import VolunteerFormOverlay from '@/app/components/VolunteerFormOverlay';
import volunteer from "@/assets/icons/volunteer.png";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";


export default function PastFlood({setFloodLevel}: {setFloodLevel: (level: string) => void }) {
    const [ pageStatus, setPageStatus ] = useState("main");
    const formVisible = pageStatus === "form";
    const volunteerVisible = pageStatus === "volunteer";

    const handleVolunteerVisibility = () => {
        if (pageStatus === "main") setPageStatus("volunteer");
        else setPageStatus("main");
    }

    const handleFormVisibility = () => {
        if (pageStatus === "main") setPageStatus("form");
        else setPageStatus("main");
    }

    return (
        <>
            <Page status={"Recent Flood. Volunteers Needed"}>
                <View className="w-full px-3 gap-3">
                    <StatusBox status="Post-Flood Recovery" icon="🔧" />
                    
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
            </NavigationBar>
            <VolunteerFormOverlay isVisible={formVisible} closeOverlay={handleFormVisibility} />
        </>
    );
}