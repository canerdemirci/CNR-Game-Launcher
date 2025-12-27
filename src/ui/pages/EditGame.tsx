import { useEffect, useState } from "react"
import { MainLayout } from "../components/MainLayout"
import { useNavigate, useParams } from "react-router-dom"
import LoadingScreen from "./components/addgame/LoadingScreen"
import GameForm, { GameFormData } from "./components/addgame/GameForm"
import { saveGameIcons, updateGame } from "../lib"
import { useAppContext } from "../providers/AppContextProvider"
import { AppbarButtons } from "../components/AppHeader"

export default function EditGame() {
    const navigate = useNavigate()
    const params = useParams()
    const appContext = useAppContext()
    
    const [game, setGame] = useState<Game | null>(null)
    const [collections, setCollections] = useState<GameCollection[]>([])
    const [isSaving, setIsSaving] = useState<boolean>(false)
    const [isLoading, setIsLoading] = useState<boolean>(true)

    useEffect(() => {
        if (!params.id) {
            navigate('/home')
            return
        }

        appContext.setAppHeaderProps({
            pageTitle: "Edit Game",
            excludedButtons: [
                AppbarButtons.SETTINGS, AppbarButtons.ADD, AppbarButtons.COLLECTIONS,
                AppbarButtons.TOOLBAR
            ]
        })

        getData()
    }, [])

    function getData() {
        Promise.all([
            window.electron.gameCollections.get(),
            window.electron.games.getById(params.id!)
        ])
        .then(([colls, game]) => {
            setCollections(colls)
            setGame(game)
        })
        .finally(() => setIsLoading(false))
    }
    
    function handleSaveGame(formData: GameFormData) {
        setIsSaving(true)

        saveGameIcons(formData.iconFile, formData.cardIconFile)
            .then(([iconPath, cardIconPath]) => {
                updateGame({
                    name: formData.name,
                    exePath: formData.exePath,
                    isInstalled: formData.isInstalled,
                    collectionIds: formData.selectedCollections.map(sc => sc.id),
                    lastPlayed: game!.lastPlayed,
                    playCount: game!.playCount,
                    iconPath: iconPath || game!.iconPath,
                    cardIconPath: cardIconPath || game!.cardIconPath,
                    id: game!.id,
                    createdAt: game!.createdAt
                } as Game, formData.selectedCollections)
            })
            .finally(() => {
                setIsSaving(false)
                navigate('/home')
            })
    }

    if (isSaving || isLoading) {
        return <LoadingScreen />
    }
    
    return (
        <MainLayout>
            <GameForm
                mode="edit"
                collections={collections}
                game={game!}
                onSubmit={handleSaveGame}
            />
        </MainLayout>
    )
}