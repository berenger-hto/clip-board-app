import { TouchableOpacity, View as NativeView, Pressable } from "react-native";
import { useThemeColor } from "@/hooks/useThemeColor";
import { type RefObject, useCallback, useImperativeHandle, useMemo, useRef, useState } from "react";
import { BottomSheetBackdrop, BottomSheetModal as Modal, BottomSheetView, useBottomSheetModal } from "@gorhom/bottom-sheet";
import { ThemedText } from "@/components/ThemedText";
import { View } from "@/components/View"
import { Textarea } from "@/components/forms/Textarea";
import { Button } from "@/components/forms/Button";
import { SegmentedButton } from "./SegmentedButton";
import type { SegmentedButtonType } from "@/types/types";

type Props = {
    title: string
    actionButtonTitle: string
    handleAction: (value: string, segmentedButtonItem: SegmentedButtonType) => void
    ref: RefObject<BottomSheetModalMethods | null>
    inputValue?: string
    buttonDisabled?: boolean
}

export type BottomSheetModalMethods = {
    open: () => void
}

export function BottomSheetModal({ title, actionButtonTitle, handleAction, ref, inputValue, buttonDisabled }: Props) {
    const { colors } = useThemeColor()
    const bottomSheetModalRef = useRef<Modal>(null)
    const snapPoints = useMemo(() => ['75%', '93%'], [])
    const handlePresentModalPress = useCallback(() => {
        bottomSheetModalRef.current?.present()
    }, [])
    const { dismiss } = useBottomSheetModal()

    const [segmentedButtonValue, setSegmentedButtonValue] = useState<SegmentedButtonType>("AUTO")
    const textValueRef = useRef(inputValue || "")

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

    const handlePressActionButton = () => {
        handleAction(textValueRef.current, segmentedButtonValue)
    }

    useImperativeHandle(ref, () => ({
        open: () => handlePresentModalPress()
    }))

    return <>
        <Modal
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
            onDismiss={() => {
                textValueRef.current = ""
                setSegmentedButtonValue("AUTO")
            }}
        >
            <BottomSheetView className="p-4" style={{ flex: 1 }}>
                <View className="flex-1">
                    <ThemedText className="opacity-60 uppercase text-center text-sm font-bold -mt-2 mb-8">
                        {title}
                    </ThemedText>
                    <Textarea
                        placeholder="Collez ou écrivez votre contenu ici"
                        defaultValue={textValueRef.current}
                        onChangeText={(text) => { textValueRef.current = text }}
                    />
                </View>

                <View className="mt-5">
                    <ThemedText className="opacity-80 font-bold mb-5">Type de contenu</ThemedText>
                    <NativeView
                        className="rounded-xl items-center justify-between w-full flex-row p-2"
                        style={{
                            backgroundColor: colors.segmentedButtonsContainerBackground
                        }}
                    >
                        {["AUTO", "TEXT", "URL", "CODE"].map((a, index) => (
                            <SegmentedButton
                                title={a}
                                key={index}
                                active={a === segmentedButtonValue}
                                onPress={() => setSegmentedButtonValue(a as SegmentedButtonType)}
                            />
                        ))}
                    </NativeView>
                </View>
                <View className="mt-6 flex-col gap-3 items-center justify-center">
                    <Button
                        active
                        className={`w-full h-16 ${buttonDisabled ? "opacity-50" : ""}`}
                        textClassName="!text-lg !font-semibold"
                        onPress={handlePressActionButton}
                        disabled={buttonDisabled}
                        activeOpacity={buttonDisabled ? .5 : .8}
                    >
                        {actionButtonTitle}
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
        </Modal>
    </>
}