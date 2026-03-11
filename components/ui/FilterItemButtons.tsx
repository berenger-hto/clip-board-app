import { View } from "@/components/View";
import { Button } from "@/components/forms/Button";
import { ScrollView } from "react-native";
import { useAppStore } from "@/hooks/useAppStore";
import { FilterType } from "@/types/types";

const filterButtons: FilterType[] = [
    {
        name: "Tout",
        indicator: "ALL"
    },
    {
        name: "URL",
        indicator: "URL"
    },
    {
        name: "Code",
        indicator: "CODE"
    },
    {
        name: "Texte",
        indicator: "TEXT"
    },
    {
        name: "Favoris",
        indicator: "FAVORITES"
    }
]

export function FilterItemButtons() {
    const filterIndicator = useAppStore(state => state.filterIndicator)
    const setFilterIndicator = useAppStore(state => state.setFilterIndicator)
    const ip = useAppStore(state => state.ip)
    const token = useAppStore(state => state.token)

    return <View className="h-30 pb-4">
        <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            nestedScrollEnabled
        >
            <View className="flex-row gap-3 mt-4">
                {filterButtons.map((button, index) => (
                    <Button
                        style={{ height: 36 }}
                        key={index}
                        active={button.indicator === filterIndicator}
                        onPress={() => setFilterIndicator(button.indicator)}
                        disabled={!ip || !token}
                    >
                        {button.name}
                    </Button>
                ))}
            </View>
        </ScrollView>
    </View>
}