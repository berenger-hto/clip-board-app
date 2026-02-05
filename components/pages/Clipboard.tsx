import {Header} from "@/components/ui/Header";
import {Keyboard, Pressable, ScrollView, View} from "react-native";
import {DATA_MOCK} from "@/constants/fakeData";
import {Card} from "@/components/datas/Card";

export function Clipboard() {
    return <>
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
                        <Card data={d} key={i} />
                    ))}
                </View>
            </Pressable>
        </ScrollView>
    </>
}