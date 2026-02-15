import {TouchableOpacity, View as NativeView, Text as NativeText, TouchableOpacityProps} from "react-native";
import Feather from '@expo/vector-icons/Feather';
import {useThemeColor} from "@/hooks/useThemeColor";
import React, {useCallback, useMemo, useRef, useState} from "react";
import {BottomSheetBackdrop, BottomSheetModal, BottomSheetView, useBottomSheetModal} from "@gorhom/bottom-sheet";
import {ThemedText} from "@/components/ThemedText";
import {View} from "@/components/View"
import {Textarea} from "@/components/forms/Textarea";
import {Button} from "@/components/forms/Button";
import {useToast} from "react-native-toast-notifications";

type SegmentedButtonProps = TouchableOpacityProps & {
    active?: boolean
    title: string
}

export function AddItemToClipboard() {
    const {colors} = useThemeColor()
    const bottomSheetModalRef = useRef<BottomSheetModal>(null)
    const snapPoints = useMemo(() => ['75%', '93%'], [])
    const handlePresentModalPress = useCallback(() => {
        bottomSheetModalRef.current?.present()
    }, [])
    const { dismiss } = useBottomSheetModal()
    const toast = useToast()

    const [segmentedButtonActiveIndex, setSegmentedButtonActiveIndex] = useState(0)
    const [value, setValue] = useState("")

    const renderBackdrop = useCallback(
        (props: any) => (
            <BottomSheetBackdrop
                {...props}
                appearsOnIndex={0}
                disappearsOnIndex={-1}
                pressBehavior="close"
                style={{ backgroundColor: colors.background }}
            />
        ),
        [colors.background]
    )

    const handleCanceled = () => {
        dismiss()
    }

    const handleAddToClipboard = () => {
        if (!value) {
            toast.show("Pas de contenu", {
                type: "warning"
            })

            return
        }

        setValue("")
        dismiss()
        toast.show("Contenu ajouté", {
            type: "success"
        })
    }

    return <>
        <TouchableOpacity
            className="absolute bottom-40 right-6 h-14 w-14 rounded-full items-center justify-center"
            style={{backgroundColor: colors.primary}}
            activeOpacity={.8}
            onPress={handlePresentModalPress}
        >
            <Feather name="plus" size={24} color={"#fff"} />
        </TouchableOpacity>

        <BottomSheetModal
            ref={bottomSheetModalRef}
            snapPoints={snapPoints}
            keyboardBehavior="fillParent"
            enableDynamicSizing={false}
            backdropComponent={renderBackdrop}
            enablePanDownToClose
            handleIndicatorStyle={{
                backgroundColor: colors.primary,
                height: 8,
                width: 40
            }}
            backgroundStyle={{
                backgroundColor: colors.background
            }}
            index={0}
        >
            <BottomSheetView className="p-4" style={{ flex: 1 }}>
                <View className="flex-1">
                    <ThemedText className="opacity-60 uppercase text-center text-sm font-bold -mt-2 mb-8">
                        Ajouter au presse-papier
                    </ThemedText>
                    <Textarea placeholder="Collez ou écrivez votre contenu ici" value={value} onChangeText={setValue} />
                </View>

                <View className="mt-5">
                    <ThemedText className="opacity-80 font-bold mb-5">Type de contenu</ThemedText>
                    <NativeView
                        className="rounded-xl items-center justify-between w-full flex-row p-2"
                        style={{
                            backgroundColor: colors.segmentedButtonsContainerBackground
                        }}
                    >
                        {["Auto", "Text", "URL", "Code"].map((a, index) => (
                            <SegmentedButton title={a} key={index} active={index === segmentedButtonActiveIndex} onPress={() => setSegmentedButtonActiveIndex(index)} />
                        ))}
                    </NativeView>
                </View>
                <View className="mt-6 flex-col gap-3 items-center justify-center">
                    <Button
                        active
                        className="w-full h-16"
                        textClassName="!text-lg !font-semibold"
                        onPress={handleAddToClipboard}
                    >
                        Ajouter au presse-papier
                    </Button>
                    <TouchableOpacity
                        className="flex-row gap-2 items-center justify-center rounded-xl py-3 px-8 w-[48%]"
                        activeOpacity={.7}
                        onPress={handleCanceled}
                    >
                        <ThemedText className="opacity-60 font-bold text-lg">Annuler</ThemedText>
                    </TouchableOpacity>
                </View>
            </BottomSheetView>
        </BottomSheetModal>
    </>
}

function SegmentedButton( { active, title, ...rest }: SegmentedButtonProps ) {
    const { isDark, colors } = useThemeColor()
    return <TouchableOpacity
        style={{ backgroundColor: (active && isDark) ? "#111" : (!isDark && active) ? "#fff" : "transparent" }}
        className="p-2 rounded-lg flex-1"
        activeOpacity={.7}
        {...rest}
    >
        <NativeText
            style={{ color: (active && isDark) ? "#fff" : (!isDark && active) ? colors.primary : colors.textPrimary }}
            className="opacity-70 text-sm font-bold text-center"
            numberOfLines={1}
        >
            {title}
        </NativeText>
    </TouchableOpacity>
}