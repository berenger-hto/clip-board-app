import {View} from "@/components/View";
import {ThemedText} from "@/components/ThemedText";
import {Pressable, Switch, Text as NativeText, TextProps, View as NativeView} from "react-native";
import {useThemeColor} from "@/hooks/useThemeColor";
import {Input} from "@/components/forms/Input";
import Feather from '@expo/vector-icons/Feather';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import {useEffect, useState} from "react";
import Slider from "@react-native-community/slider";
import {createMMKV} from "react-native-mmkv";

type PreferenceType = {
    name: string
    iconName: "refresh-cw" | "bell" | "lock"
}

type PreferenceProps = {
    preference: PreferenceType
    active: boolean
    setActive: () => void
}

export function Settings() {
    const preferences: PreferenceType[] = [
        {
            name: "Synchronisation Automatique",
            iconName: "refresh-cw"
        },
        {
            name: "Notifications",
            iconName: "bell"
        }
    ]
    const storage = createMMKV()

    const [value, setValue] = useState(false)
    const onValueChange = () => setValue(prevState => !prevState)
    const [sliderValue, setSliderValue] = useState(0)
    const { colors } = useThemeColor()
    const [url, setUrl] = useState("http://192.168.1.107")

    useEffect(() => {
        storage.set("url", url)
        console.log("URL in storage: ", storage.getString("url"))
    }, [storage, url])

    return <View>
        <ThemedText className="text-3xl font-bold">Paramètres</ThemedText>
        <View className="mt-8">
            <Text className="uppercase font-bold mb-6 text-sm">Configuration du serveur</Text>
            <Input
                label="URL Serveur"
                value={url}
                onChangeText={(url) => setUrl(url)}
                placeholder="ex: http://192.168.0.123"
            />
        </View>
        <View className="mt-8">
            <Text className="uppercase font-bold mb-4 text-sm">Préférences générales</Text>
            <View>
                {preferences.map((p, index) => (
                    <Preference
                        preference={p}
                        active={value}
                        setActive={onValueChange}
                        key={index}
                    />
                ))}
            </View>
        </View>
        <View className="mt-8">
            <Text className="font-bold uppercase mb-4 text-sm">Mémoire et Historique</Text>
            <View className="flex-row items-center justify-between">
                <NativeView className="flex-row items-center justify-center gap-2">
                    <NativeView style={{ backgroundColor: colors.tagSourceBackground}} className="h-12 w-12 rounded-lg items-center justify-center">
                        <MaterialIcons name="history" size={18} color={colors.tagSourceIconColor} />
                    </NativeView>
                    <ThemedText className="font-semibold text-lg">Conservation de l'historique</ThemedText>
                </NativeView>
                <NativeText className="font-bold text-lg opacity-75" style={{color: colors.primary}}>
                    {Math.round(sliderValue)} {sliderValue > 1 ? "jours" : "jour"}
                </NativeText>
            </View>
            <View className="mt-2">
                <Slider
                    style={{width: "100%"}}
                    minimumValue={1}
                    maximumValue={90}
                    minimumTrackTintColor={colors.textPrimary}
                    maximumTrackTintColor={colors.textPrimary}
                    thumbTintColor={colors.textPrimary}
                    value={sliderValue}
                    onValueChange={(value) => setSliderValue(value)}
                />
                <View className="flex-row items-center justify-between mt-2">
                    <Text className="text-sm">1 jour</Text>
                    <Text className="text-sm">90 jours</Text>
                </View>
            </View>
        </View>
        <View className="mt-8">
            <Text className="uppercase font-bold text-sm mb-4">Sécurité</Text>
            <Preference
                preference={
                    {
                        name: "Utiliser l'empreinte digitale",
                        iconName: "lock"
                    }
                }
                active={value}
                setActive={onValueChange}
            />
        </View>
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
            <NativeView style={{ backgroundColor: colors.tagSourceBackground}} className="h-12 w-12 rounded-lg items-center justify-center">
                <Feather name={preference.iconName} size={18} color={colors.tagSourceIconColor} />
            </NativeView>
            <ThemedText className="font-semibold text-lg">{preference.name}</ThemedText>
        </NativeView>
        <Switch value={active} onValueChange={setActive} thumbColor={active ? colors.primary : colors.switchNotActiveColor} />
    </Pressable>
}

function Text({ children, ...rest }: TextProps) {
    const { colors } = useThemeColor()
    return <NativeText
        style={{color: colors.tagSourceColor}}
        {...rest}
    >
        {children}
    </NativeText>
}
