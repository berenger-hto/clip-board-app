import {View} from "@/components/View";
import {Button} from "@/components/forms/Button";
import {ScrollView} from "react-native";
import {useState} from "react";

export function FilterButtons() {
    const [active, setActive] = useState(0)
    const handleActive = (index: number) => {
        if (index === active) return
        setActive(index)
    }

    return <View className="h-30">
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View className="flex-row gap-3 mt-5">
                {["Tout", "URL", "Code", "Favoris"].map((btn, index) => (
                    <Button key={btn} active={index === active} onPress={() => handleActive(index)}>
                        {btn}
                    </Button>
                ))}
            </View>
        </ScrollView>
    </View>
}