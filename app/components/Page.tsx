import Welcome from '@/app/components/Welcome';
import HeatMap from '@/app/components/HeatMap';
import { ScrollView, View, Text } from "react-native";
import Column from '@/app/components/Column';
import Row from '@/app/components/Row';
import React from "react";

export default function Page({ children, status }) {
    const childrenArray = React.Children.toArray(children);
    let firstGroup = [];
    let secondGroup = [];
    let thirdGroup = [];

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
        <ScrollView contentContainerStyle={{ flexGrow: 1, alignItems: 'center', paddingBottom: 56 }} className="bg-gray-900 pt-8">
            <Welcome />
            <View className="w-11/12 h-[50vh] rounded-3xl overflow-hidden shadow-2xl shadow-cyan-500/20 my-8">
                <HeatMap />
            </View>
            <Text className="text-3xl font-bold text-cyan-400 animate-pulse">{status}</Text>
            <View className="w-full items-center mt-4">
                {columnNumber()}
            </View>
        </ScrollView>
    )
}