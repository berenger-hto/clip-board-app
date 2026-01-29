import {View} from "@/components/View";
import {Input} from "@/components/forms/Input";
import Feather from '@expo/vector-icons/Feather';
import {useThemeColor} from "@/hooks/useThemeColor";

export function SearchInput() {
    const { colors } = useThemeColor()
    return <View>
        <Feather name="search" className="absolute top-[13.5px] left-5 z-10 opacity-50" size={20} color={colors.textPrimary} />
        <Input className="pl-14" placeholder="Rechercher..." />
    </View>
}