import { View, SafeAreaView } from 'react-native';

export default function NavigationBar({ children }) {
    return (
        <SafeAreaView style={{ backgroundColor: '#111827' }}>
            <View className="bg-gray-900 border-t border-cyan-500/30 flex-row justify-evenly items-center p-4">
                {children}
            </View>
        </SafeAreaView>
    )
}