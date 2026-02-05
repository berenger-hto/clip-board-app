import {TouchableOpacity, TouchableOpacityProps, View as NativeView} from "react-native";
import Feather from '@expo/vector-icons/Feather';
import {useThemeColor} from "@/hooks/useThemeColor";
import {useEffect} from "react";
import {ThemedText} from "@/components/ThemedText";
import {useAppStore} from "@/store";

type Tab = {
    name: string
    iconName: "clipboard" | "settings" | "monitor"
}

type TabElementProps = TouchableOpacityProps & {
    tab: Tab
    active?: boolean
}

export function FloatNav() {
    const {colors} = useThemeColor()
    const tabElements: Tab[] = [
        {
            name: "Presse-Papier",
            iconName: "clipboard",
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
            shadowColor: "#444",
            shadowOffset: {
                width: 0,
                height: 2,
            },
            shadowOpacity: 0,
            shadowRadius: 50,
            elevation: 4,
        }}
        className={`"pointer-events-auto absolute bottom-8 py-3 px-8 w-100 self-center items-center flex-row gap-10 border`}
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

function TabElement({tab, active, ...rest}: TabElementProps) {
    const {colors, isDark} = useThemeColor()

    return <TouchableOpacity
        activeOpacity={.8}
        className="flex-col items-center justify-center"
        {...rest}
    >
        <Feather name={tab.iconName} size={16} color={active ? colors.primary : isDark ? "#aaa" : "#888"}/>
        <ThemedText
            className={`text-[10px] font-bold}`}
            style={{color: active ? colors.primary : isDark ? "#aaa" : "#888", fontWeight: active ? "bold" : "normal"}}
        >
            {tab.name}
        </ThemedText>
    </TouchableOpacity>
}