import { useEffect, useState } from "react"
import { MainLayout } from "../components/MainLayout"
import { useNavigate } from "react-router-dom"
import LoadingScreen from "./components/addgame/LoadingScreen"
import GameForm, { GameFormData } from "./components/addgame/GameForm"
import { addGame, saveGameIcons } from "../lib"
import { useAppContext } from "../providers/AppContextProvider"
import { AppbarButtons } from "../components/AppHeader"

export default function AddGame() {
    const navigate = useNavigate()
    const appContext = useAppContext()
    
    const [collections, setCollections] = useState<GameCollection[]>([])
    const [isSaving, setIsSaving] = useState<boolean>(false)

    useEffect(() => {
        appContext.setAppHeaderProps({
            pageTitle: "Add Game",
            excludedButtons: [
                AppbarButtons.SETTINGS, AppbarButtons.ADD, AppbarButtons.COLLECTIONS,
                AppbarButtons.BIGPICTURE, AppbarButtons.ORDERBOX, AppbarButtons.FILTER,
                AppbarButtons.VIEWSELECTOR, AppbarButtons.SEARCH
            ]
        })

        window.electron.gameCollections.get().then(cls => setCollections(cls))
    }, [])
    
    function handleSaveGame(formData: GameFormData) {
        setIsSaving(true)

        saveGameIcons(formData.iconFile, formData.cardIconFile)
            .then(([iconPath, cardIconPath]) => {
                addGame({
                    name: formData.name,
                    exePath: formData.exePath,
                    isInstalled: formData.isInstalled,
                    collectionIds: formData.selectedCollections.map(sc => sc.id),
                    lastPlayed: new Date(Date.now()),
                    playCount: 0,
                    iconPath: iconPath,
                    cardIconPath: cardIconPath
                }, formData.selectedCollections)
            })
            .finally(() => {
                setIsSaving(false)
                navigate('/home')
            })
    }

    if (isSaving) {
        return <LoadingScreen />
    }
    
    return (
        <MainLayout>
            <GameForm
                mode="add"
                collections={collections}
                onSubmit={handleSaveGame}
            />
        </MainLayout>
    )
}