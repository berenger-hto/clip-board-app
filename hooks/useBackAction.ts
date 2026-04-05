import { useAppStore } from "./useAppStore";
import { useBackHandler } from "./useBackHandler";

export function useBackAction() {
    const setTabActiveIndex = useAppStore(state => state.setTabActiveIndex)
    return useBackHandler(() => {
        setTabActiveIndex(0)
        return true
    })
}