import {ThemedText} from "@/components/ThemedText";
import {View as NativeView} from "react-native";
import {ToastProps} from "react-native-toast-notifications/lib/typescript/toast";
import {useThemeColor} from "@/hooks/useThemeColor";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Animated, {useSharedValue, withRepeat, withTiming, Easing, useAnimatedStyle} from "react-native-reanimated";
import {useEffect} from "react";

type Props = {
    toastOptions: ToastProps
}

export function ToastCard({ toastOptions }: Props) {
    const {colors} = useThemeColor()
    const { type, message, data } = toastOptions
    const iconName = type === "success" ? "check-circle" : type === "danger" ? "error" : type === "warning" ? "dnd-forwardslash" : "info"
    const rotation = useSharedValue(0)

    useEffect(() => {
        rotation.value = withRepeat(
            withTiming(data?.title === "sync" ? 360 : 0, {
                duration: 3000,
                easing: Easing.linear,
            }),
            -1,
            false
        )
    }, [data?.title, rotation])

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ rotate: `${rotation.value}deg` }],
    }))

    return <NativeView
        style={{backgroundColor: colors.box}}
        className="px-4 py-3 pr-7 rounded-full gap-4 flex-row items-center justify-between"
    >
        <Animated.View style={[animatedStyle]} className="bg-[#8B5CF6]/20 h-10 w-10 rounded-full items-center justify-center">
            <MaterialIcons name={data?.title === "sync" ? "sync" : iconName} size={20} color={colors.primary} />
        </Animated.View>
        <ThemedText className="text-base opacity-80 font-bold">{message}</ThemedText>
    </NativeView>
}