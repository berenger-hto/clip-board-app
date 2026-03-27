import { View } from "../View";
import { ThemedText } from "../ThemedText";
import Feather from '@expo/vector-icons/Feather';
import { useThemeColor } from "@/hooks/useThemeColor";
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withRepeat,
    withTiming,
    Easing,
} from 'react-native-reanimated';
import { useEffect } from "react";
import { Image } from "expo-image";
import { Button } from "../forms/Button";
import { SafeAreaView } from "../SafeAreaView";
import { TouchableOpacity, useWindowDimensions } from "react-native";
import { router } from "expo-router";
import { useAppStore } from "@/hooks/useAppStore";
import { useSecureStore } from "@/hooks/useSecureStore";

type Props = {
    loading: boolean
}

export function Started({ loading }: Props) {
    const { colors } = useThemeColor()
    const { width } = useWindowDimensions()
    const rotation = useSharedValue(0)
    const translateX = useSharedValue(0)

    useEffect(() => {
        rotation.value = 0
        rotation.value = withRepeat(
            withTiming(360, {
                duration: 5000,
                easing: Easing.linear,
            }),
            -1,
            false
        )
    }, [rotation])

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ rotate: `${rotation.value}deg` }],
        }
    })

    const animatedContainerStyle = useAnimatedStyle(() => {
        return {
            transform: [{ translateX: translateX.value }],
        }
    })

    const setStarted = useAppStore(state => state.setStarted)
    const started = useAppStore(state => state.started)
    const { setValue } = useSecureStore()

    useEffect(() => {
        if (!started) return
        const timer = setTimeout(() => {
            handleGetStarted()
        }, 1000)
        return () => clearTimeout(timer)
    }, [started])

    const handleGetStarted = () => {
        translateX.value = withTiming(-width, { duration: 500, easing: Easing.out(Easing.exp) })
        setTimeout(() => {
            setStarted(true)
            setValue("started", "ok")
        }, 500)
    }

    return <SafeAreaView className="flex-1">
        <Animated.View
            style={[{ flex: 1, alignItems: 'center', justifyContent: 'center' }, animatedContainerStyle]}
        >
            <TouchableOpacity
                className="absolute top-2 right-4"
                activeOpacity={.8}
                onPress={() => router.push('/about')}
            >
                <Feather name="info" size={22} color={colors.textPrimary} />
            </TouchableOpacity>

            <View className="flex-col items-center justify-center gap-2">
                <Animated.View style={animatedStyle}>
                    <Feather
                        name="refresh-cw"
                        size={30}
                        color={colors.primary}
                    />
                </Animated.View>
                <ThemedText className="text-sm font-bold">ClipboardX</ThemedText>
            </View>

            {!loading && <View className="absolute bottom-36 flex-col gap-1 w-full px-4">
                <View className="flex-row items-center gap-2 self-center">
                    <Image
                        source={require("@/assets/images/hello.gif")}
                        style={{ width: 20, height: 20 }}
                    />
                    <ThemedText className="text-3xl font-bold italic">
                        Yoooooo !
                    </ThemedText>
                </View>
                <ThemedText className="text-center">
                    Copie, Synchronise, Réutilise.
                </ThemedText>
                <Button
                    icon={<Feather name="chevron-right" size={20} color={colors.primary} />}
                    iconPosition="right"
                    className="mt-6"
                    onPress={handleGetStarted}
                >
                    Demarrer
                </Button>
            </View>}

        </Animated.View>
    </SafeAreaView>
}