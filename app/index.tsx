import {StyleSheet, View} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import {useTheme} from "@/hooks/useTheme";
import {ThemedText} from "@/components/ThemedText";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Feather from '@expo/vector-icons/Feather';

export default function Index() {
    const theme = useTheme()
    return <SafeAreaView style={[styles.body, { backgroundColor: theme.background }]}>
        <View style={styles.header}>
            <ThemedText size="xl" opacity={90} style={{fontWeight: "bold"}}>Clipboard</ThemedText>
            <MaterialIcons name="devices" size={18} color={theme.textPrimary} />
        </View>
    </SafeAreaView>
}

const styles = StyleSheet.create({
    body: {
        flex: 1,
        padding: 16
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between"
    }
})
