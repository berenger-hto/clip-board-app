import "../styles/global.css"
import { SafeAreaView } from "@/components/SafeAreaView";
import { FloatNav } from "@/components/ui/FloatNav";
import { Clipboard } from "@/components/pages/Clipboard";
import { useAppStore } from "@/hooks/useAppStore";
import { Settings } from "@/components/pages/Settings";
import { Devices } from "@/components/pages/Devices";
import { useSecureStore } from "@/hooks/useSecureStore";
import { View } from "@/components/View";
import { ScrollView, useWindowDimensions } from "react-native";
import { useEffect, useRef } from "react";

export default function App() {
    const tabActiveIndex = useAppStore(state => state.tabActiveIndex)
    const setTabActiveIndex = useAppStore(state => state.setTabActiveIndex)
    const { width } = useWindowDimensions()
    const scrollRef = useRef<ScrollView>(null)

    // Sync scroll position when index changes (e.g. from FloatNav click)
    useEffect(() => {
        scrollRef.current?.scrollTo({ x: tabActiveIndex * width, animated: true })
    }, [tabActiveIndex, width])

    const handleMomentumScrollEnd = (event: any) => {
        const xOffset = event.nativeEvent.contentOffset.x
        const index = Math.round(xOffset / width)
        if (index !== tabActiveIndex) {
            setTabActiveIndex(index)
        }
    }

    return <SafeAreaView className="flex-1">
        <ScrollView
            ref={scrollRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={handleMomentumScrollEnd}
            scrollEventThrottle={16}
            className="flex-1"
        >
            <View style={{ width }} className="p-4 flex-1">
                <Clipboard />
            </View>
            <View style={{ width }} className="p-4 flex-1">
                <Devices />
            </View>
            <View style={{ width }} className="p-4 flex-1">
                <Settings />
            </View>
        </ScrollView>

        {/*Float navigation*/}
        <FloatNav />
    </SafeAreaView>
}