import Column from '@/app/components/Column';
import HeatMap from '@/app/components/HeatMap';
import Row from '@/app/components/Row';
import Welcome from '@/app/components/Welcome';
import React from "react";
import { ScrollView, View } from "react-native";

export default function Page({ children, status }: { children: React.ReactNode; status: string }) {
    const childrenArray = React.Children.toArray(children);
    let firstGroup: any[] = [];
    let secondGroup: any[] = [];
    let thirdGroup: any[] = [];

    childrenArray.forEach((child, index) => {
        if (!childrenArray[index + 1] && index % 2 === 0) {
            thirdGroup.push(child);
        } else if (index % 2 === 0) {
            firstGroup.push(child);
        } else {
            secondGroup.push(child);
        }
    });

    const columnNumber = () => {
        if (firstGroup.length > 0 && thirdGroup.length > 0) {
            return (
                <>
                    <Row>
                        <Column>{firstGroup}</Column>
                        <Column>{secondGroup}</Column>
                    </Row>
                    <Row className="justify-center">
                        <Column>{thirdGroup}</Column>
                    </Row>
                </>
            )
        } else if (thirdGroup.length > 0) {
            return (
                <Row className="justify-center">
                    <Column>{thirdGroup}</Column>
                </Row>
            )
        } else {
            return (
                <Row>
                    <Column>{firstGroup}</Column>
                    <Column>{secondGroup}</Column>
                </Row>
            )
        }
    }

    return (
        <ScrollView contentContainerStyle={{ flexGrow: 1, alignItems: 'center', paddingBottom: 56, paddingTop: 40 }} className="bg-black pt-8">
            <Welcome />
            <View 
                className="w-11/12 h-60 rounded-3xl overflow-hidden mb-6 border border-white/10"
                style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
            >
                <HeatMap />
            </View>
            <View className="w-full items-center mt-2">
                {columnNumber()}
            </View>
        </ScrollView>
    )
}