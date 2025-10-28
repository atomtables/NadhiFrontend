import { SafeAreaView, View } from 'react-native';

export default function NavigationBar({ children }: {children: React.ReactNode}) {
    return (
        <SafeAreaView style={{ backgroundColor: '#000000' }}>
            <View 
                className="flex-row justify-evenly items-center p-4 pb-8 border-t border-white/10"
                style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)' }}
            >
                {children}
            </View>
        </SafeAreaView>
    )
}