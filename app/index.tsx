import "../styles/global.css"
import {SafeAreaView} from "@/components/SafeAreaView";
import {FloatNav} from "@/components/ui/FloatNav";
import {Clipboard} from "@/components/pages/Clipboard";
import {useAppStore} from "@/store";
import {Settings} from "@/components/pages/Settings";
import {Devices} from "@/components/pages/Devices";

export default function App() {
    const tabActiveIndex = useAppStore(state => state.tabActiveIndex)

    return <SafeAreaView className="p-4 flex-1">
        {
            tabActiveIndex === 0 ?
                <Clipboard />
                : tabActiveIndex === 1 ?
                    <Devices /> :
                    <Settings />
        }

        {/*Float navigation*/}
        <FloatNav/>

    </SafeAreaView>
}