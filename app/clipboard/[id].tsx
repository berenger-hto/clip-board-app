import { SafeAreaView } from "@/components/SafeAreaView";
import { useLocalSearchParams } from "expo-router";
import { CardHeader } from "@/components/clipboard/CardHeader";
import { NotFound } from "@/components/ui/NotFound";
import { useClipboardDetails } from "@/hooks/clipboard/useClipboardDetails";
import { useClipboardActions } from "@/hooks/clipboard/useClipboardActions";
import { useClipboardEffects } from "@/hooks/clipboard/useClipboardEffects";
import { CardContent } from "@/components/clipboard/CardContent";
import { CardActions } from "@/components/clipboard/CardActions";
import { Loader } from "@/components/clipboard/Loader";

export default function ClipboardCardPreview() {
    const { id } = useLocalSearchParams()
    const { data: clipboardData, isPending, isError } = useClipboardDetails(id as string)
    const data = clipboardData?.data

    const {
        deleteMutation,
        editMutation,
        favoriteMutation,
        handleDelete,
        handleEditClipboard,
        handleFavorite
    } = useClipboardActions(id as string)

    useClipboardEffects(id as string, { deleteMutation, editMutation, favoriteMutation })


    if (isError || (clipboardData && !clipboardData.success)) {
        return <NotFound title="Oops !" description="Cette donnée n'a pas été retrouvée" />
    }

    return <SafeAreaView className="flex-1">
        {isPending && <Loader />}

        {data &&
            <>
                <CardHeader
                    favorite={data.isFavorite}
                    starDisabled={favoriteMutation.isPending}
                    mutate={handleFavorite}
                />
                <CardContent data={data} />
                <CardActions
                    data={data}
                    handleEditClipboard={handleEditClipboard}
                    handleDelete={handleDelete}
                    editMutation={editMutation}
                    deleteMutation={deleteMutation}
                />
            </>
        }

    </SafeAreaView>
}