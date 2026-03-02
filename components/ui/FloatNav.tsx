import { TouchableOpacity, TouchableOpacityProps, View as NativeView } from "react-native";
import Feather from '@expo/vector-icons/Feather';
import { useThemeColor } from "@/hooks/useThemeColor";
import { ThemedText } from "@/components/ThemedText";
import { useAppStore } from "@/hooks/useAppStore";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MotiView, AnimatePresence } from "moti";

type Tab = {
    name: string
    iconName: "clipboard" | "settings" | "monitor" | "search"
}

type TabElementProps = TouchableOpacityProps & {
    tab: Tab
    active?: boolean
}

export function FloatNav() {
    const { colors } = useThemeColor()
    const insets = useSafeAreaInsets()
    const tabElements: Tab[] = [
        {
            name: "Presse-Papier",
            iconName: "clipboard",
        },
        {
            name: "Rechercher",
            iconName: "search"
        },
        {
            name: "Appareils",
            iconName: "monitor"
        },
        {
            name: "Paramètres",
            iconName: "settings"
        },
    ]
    const tabActiveIndex = useAppStore(state => state.tabActiveIndex)
    const setTabActiveIndex = useAppStore(state => state.setTabActiveIndex)

    const handleChangeTab = (index: number) => {
        if (index === tabActiveIndex) return
        setTabActiveIndex(index)
    }

    return <NativeView
        style={{
            backgroundColor: colors.navColor,
            borderRadius: 90,
            borderColor: colors.borderNavColor,
            elevation: 10,
            bottom: Math.max(insets.bottom, 20)
        }}
        className="pointer-events-auto absolute py-3 px-8 self-center items-center flex-row gap-8 border shadow-lg"
    >
        {tabElements.map((tab, index) => (
            <TabElement
                tab={tab}
                active={index === tabActiveIndex}
                onPress={() => handleChangeTab(index)}
                key={index}
            />
        ))}
    </NativeView>
}

function TabElement({ tab, active, ...rest }: TabElementProps) {
    const { colors, isDark } = useThemeColor()

    return <TouchableOpacity
        activeOpacity={.8}
        {...rest}
    >
        <MotiView
            animate={{
                scale: active ? 1.1 : 1,
                opacity: active ? 1 : 0.6,
            }}
            transition={{
                type: 'spring',
                damping: 15,
                stiffness: 150
            }}
            className="flex-col items-center justify-center"
        >
            <Feather
                name={tab.iconName}
                size={active ? 14 : 20}
                color={active ? colors.primary : isDark ? "#aaa" : "#888"}
            />

            <AnimatePresence>
                {active && (
                    <MotiView
                        from={{ opacity: 0, scale: 1, height: 0 }}
                        animate={{ opacity: 1, scale: 1, height: 16 }}
                        exit={{ opacity: 0, scale: 1, height: 0 }}
                        transition={{
                            type: 'timing',
                            duration: 200,
                        }}
                    >
                        <ThemedText
                            className="text-[10px] font-bold"
                            style={{
                                color: active ? colors.primary : isDark ? "#aaa" : "#888",
                                textAlign: 'center'
                            }}
                        >
                            {tab.name}
                        </ThemedText>
                    </MotiView>
                )}
            </AnimatePresence>
        </MotiView>
    </TouchableOpacity>
}