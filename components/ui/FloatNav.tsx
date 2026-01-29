import {TouchableOpacity, View} from "react-native";
import {Button} from "@/components/forms/Button";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Feather from '@expo/vector-icons/Feather';
import {useThemeColor} from "@/hooks/useThemeColor";
import {useState} from "react";

export function FloatNav() {
    const { isDark, colors } = useThemeColor()
    const defaultIconColor = isDark ? "#fff" : "#000"
    const navElements = [
        {
            name: "Historique",
            defaultIcon: <MaterialIcons name="history" size={24} color={defaultIconColor} />,
            activeIcon: <MaterialIcons name="history" size={24} color="#fff" />,
        },
        {
            name: "Paramètres",
            defaultIcon: <Feather name="settings" size={20} color={defaultIconColor} />,
            activeIcon: <Feather name="settings" size={20} color="#fff" />,
        }
    ]

    const [active, setActive] = useState(0)
    const handleChangeTab = (index: number) => {
        if (index === active) return
        setActive(index)
    }

    return <View style={{ backgroundColor: colors.navColor, borderRadius: 90, elevation: 1, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.18, shadowRadius: 1.0  }} className={`"pointer-events-auto absolute bottom-12 p-2 w-100 self-center items-center flex-row gap-2`}>
        {navElements.map(((el, index) => {
            const { name, activeIcon, defaultIcon } = el
            if (index === active) {
                return <Button key={index} active className="!rounded-full" icon={activeIcon} onPress={() => handleChangeTab(index)}>
                    {name}
                </Button>
            }

            return <TouchableOpacity key={index} className="px-4" activeOpacity={.8} onPress={() => handleChangeTab(index)}>
                {defaultIcon}
            </TouchableOpacity>
        }))}
    </View>
}