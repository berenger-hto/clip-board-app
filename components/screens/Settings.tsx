import { Input } from "@/components/forms/Input";
import { ThemedText } from "@/components/ThemedText";
import { View } from "@/components/View";
import { useThemeColor } from "@/hooks/useThemeColor";
import Feather from '@expo/vector-icons/Feather';
import { Text as NativeText, View as NativeView, Pressable, Switch, TextProps } from "react-native";
import { useAppStore } from "@/hooks/useAppStore";

type Preference = {
    name: string
    iconName: "refresh-cw" | "lock" | "moon" | "eye" | "volume-2"
    active: boolean
    setActive: () => void
}

type PreferenceProps = {
    preference: Preference
    active: boolean
    setActive: () => void
}

export function Settings() {
    const { isDark } = useThemeColor()
    const ip = useAppStore(state => state.ip)
    const appTheme = useAppStore(state => state.appTheme)
    const setAppTheme = useAppStore(state => state.setAppTheme)
    const autoSync = useAppStore(state => state.autoSync)
    const setAutoSync = useAppStore(state => state.setAutoSync)
    const soundOfCopy = useAppStore(state => state.soundOfCopy)
    const setSoundOfCopy = useAppStore(state => state.setSoundOfCopy)
    
    const preferences: Preference[] = [
        {
            name: "Synchronisation Automatique",
            iconName: "refresh-cw",
            active: autoSync,
            setActive: () => setAutoSync(!autoSync)
        },
        {
            name: "Mode sombre",
            iconName: "moon",
            active: appTheme ? appTheme === "dark" : isDark,
            setActive: () => setAppTheme(appTheme && appTheme === "dark" ? "light" : "dark")
        },
        {
            name: "Son de Copie", 
            iconName: "volume-2",
            active: soundOfCopy,
            setActive: () => setSoundOfCopy(!soundOfCopy)
        },
        /**
        {
            name: "Mode Incognito",
            iconName: "eye",
            active: false,
            setActive: () => {}
        }
        */
    ]

    return <View>
        <ThemedText className="text-3xl font-bold">Paramètres</ThemedText>
        <View className="mt-8">
            <Text className="uppercase font-bold mb-6 text-sm">Configuration du serveur</Text>
            <Input
                label="URL Serveur"
                value={`http://${ip ?? "127.0.0.1"}`}
                placeholder="ex: http://192.168.0.123"
                editable={false}
                className="opacity-75"
            />
        </View>
        <View className="mt-8">
            <Text className="uppercase font-bold mb-4 text-sm">Préférences générales</Text>
            <View>
                {preferences.map((preference, index) => (
                    <Preference
                        key={index}
                        preference={preference}
                        active={preference.active}
                        setActive={preference.setActive}
                    />
                ))}
            </View>
        </View>
        {/**
        <View className="mt-8">
            <Text className="uppercase font-bold text-sm mb-4">Sécurité</Text>
            <Preference
                preference={
                    {
                        name: "Utiliser l'empreinte digitale",
                        iconName: "lock"
                    }
                }
                active={biometric}
                setActive={onBiometricChange}
            />
        </View>
         */}
    </View>
}

function Preference({ preference, active, setActive }: PreferenceProps) {
    const { colors } = useThemeColor()

    return <Pressable
        className="flex-row items-center justify-between border-b py-3"
        style={{ borderColor: colors.tagSourceBorderColor }}
        onPress={setActive}
    >
        <NativeView className="flex-row items-center justify-center gap-2">
            <NativeView style={{ backgroundColor: colors.tagSourceBackground }} className="h-12 w-12 rounded-lg items-center justify-center">
                <Feather name={preference.iconName} size={18} color={colors.tagSourceIconColor} />
            </NativeView>
            <ThemedText className="font-semibold text-lg">{preference.name}</ThemedText>
        </NativeView>
        <Switch 
            value={active} 
            onValueChange={setActive} 
            thumbColor={colors.primary} 
            trackColor={{
                true: colors.tagSourceIconColor,
                false: colors.tagSourceBorderColor
            }} 
        />
    </Pressable>
}

function Text({ children, ...rest }: TextProps) {
    const { colors } = useThemeColor()
    return <NativeText
        style={{ color: colors.tagSourceColor }}
        {...rest}
    >
        {children}
    </NativeText>
}
