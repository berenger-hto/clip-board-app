import "../styles/global.css"
import {SafeAreaView} from "@/components/SafeAreaView";
import {Alert, Keyboard, TouchableWithoutFeedback, View, StyleSheet, ScrollView, Pressable} from "react-native";
import {useThemeColor} from "@/hooks/useThemeColor";
import {Button} from "@/components/forms/Button"
import {Header} from "@/components/ui/Header";
import {Input} from "@/components/forms/Input";
import {FilterButtons} from "@/components/ui/FilterButtons";
import {Card} from "@/components/datas/Card";
import FontAwesome from '@expo/vector-icons/FontAwesome';
import {useEffect} from "react";
import {contentType} from "@/functions/detectContentType";
import {WebView} from 'react-native-webview';
import Constants from 'expo-constants';
import {ThemedText} from "@/components/ThemedText";
import {DATA_MOCK} from "@/constants/fakeData";
import Feather from '@expo/vector-icons/Feather';
import {FloatNav} from "@/components/ui/FloatNav";

export default function App() {

    return <SafeAreaView className="p-4 flex-1">
        {/* Header */}
        <Header/>
        <ScrollView
            className="flex-1 mt-2 rounded-xl"
            contentContainerStyle={{paddingBottom: 20}}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
        >
            <Pressable onPress={Keyboard.dismiss}>
                <View className="mt-5 gap-4">
                    {DATA_MOCK.map((d, i) => (
                        <Card data={d} key={i}/>
                    ))}
                </View>
            </Pressable>
        </ScrollView>

        {/*Add new item button*/}
        <Button
            className="h-[56px] absolute bottom-[120px] right-5"
            icon={<Feather name="plus" size={22} color="#FFF"/>}
            active
        />

        {/*Float navigation*/}

        <FloatNav />

    </SafeAreaView>
}