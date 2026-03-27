import "../styles/global.css"
import { SafeAreaView } from "@/components/SafeAreaView";
import { Navigation } from "@/components/ui/Navigation";
import { Clipboard } from "@/components/screens/Clipboard";
import { useAppStore } from "@/hooks/useAppStore";
import { Settings } from "@/components/screens/Settings";
import { Devices } from "@/components/screens/Devices";
import { View } from "@/components/View";
import { ScrollView, useWindowDimensions } from "react-native";
import { useEffect, useRef, useState } from "react";
import { Search } from "@/components/screens/Search";
import { Started } from "@/components/screens/Started";

export default function App() {
    const tabActiveIndex = useAppStore(state => state.tabActiveIndex)
    const setTabActiveIndex = useAppStore(state => state.setTabActiveIndex)
    const { width } = useWindowDimensions()
    const scrollRef = useRef<ScrollView>(null)
    const started = useAppStore(state => state.started)
    const [load, setLoad] = useState(true)

    useEffect(() => {
        scrollRef.current?.scrollTo({ x: tabActiveIndex * width, animated: true })
    }, [tabActiveIndex, width])

    useEffect(() => {
        const timer = setTimeout(() => setLoad(false), 1500)
        return () => clearTimeout(timer)
    }, [])

    const handleMomentumScrollEnd = (event: any) => {
        const xOffset = event.nativeEvent.contentOffset.x
        const index = Math.round(xOffset / width)
        if (index !== tabActiveIndex) {
            setTabActiveIndex(index)
        }
    }
    /*
    if (load) {
        return <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color={colors.primary} />
        </View>
    }
        */

    if (!started || load) {
        return <Started loading={load} />
    }

    return <SafeAreaView className="flex-1" edges={['top', 'left', 'right']}>
        <ScrollView
            ref={scrollRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={handleMomentumScrollEnd}
            scrollEventThrottle={16}
            className="flex-1"
        >
            <View style={{ width }} className="px-4 pt-4 flex-1">
                <Clipboard />
            </View>
            <View style={{ width }} className="px-4 pt-4 flex-1">
                <Search />
            </View>
            <View style={{ width }} className="px-4 pt-4 flex-1">
                <Devices />
            </View>
            <View style={{ width }} className="px-4 pt-4 flex-1">
                <Settings />
            </View>
        </ScrollView>

        {/*Float navigation*/}
        <Navigation />
    </SafeAreaView>
}