import { useEffect, useState } from "react"
import { MainLayout } from "../components/MainLayout"
import { useNavigate } from "react-router-dom"
import LoadingScreen from "./components/addgame/LoadingScreen"
import GameForm, { GameFormData } from "./components/addgame/GameForm"
import { addGame, saveGameIcons } from "../lib"
import { useAppContext } from "../providers/AppContextProvider"
import { AppbarButtons } from "../components/AppHeader"
import SteamLogo from "../assets/steam.png"
import EpicLogo from "../assets/epic.png"
import EaLogo from "../assets/eagames.png"
import UplayLogo from "../assets/uplay.png"
import XboxLogo from "../assets/xbox-logo.png"
import { useWindowModal } from "../providers/WindowModalProvider"
import LibraryGameImportModal from "./components/addgame/LibraryGameImportModal"

export default function AddGame() {
    const navigate = useNavigate()
    const appContext = useAppContext()
    const { showWindow } = useWindowModal()
    
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

    function handleGetSteamDataBtnClick() {
        showWindow(
            "Import Steam Games",
            <LibraryGameImportModal library="steam" />,
            (res) => {
                if (res === 'yes') {
                    navigate('/home')
                }
            }
        )
    }

    function handleGetEpicDataBtnClick() {
        showWindow(
            "Import EpicGames Games",
            <LibraryGameImportModal library="epic" />,
            (res) => {
                if (res === 'yes') {
                    navigate('/home')
                }
            }
        )
    }

    function handleGetEaGamesDataBtnClick() {
        showWindow(
            "Import Ea Games Games",
            <LibraryGameImportModal library="eagames" />,
            (res) => {
                if (res === 'yes') {
                    navigate('/home')
                }
            }
        )
    }

    function handleGetXboxGamesDataBtnClick() {
        showWindow(
            "Import Xbox Games",
            <LibraryGameImportModal library="xbox" />,
            (res) => {
                if (res === 'yes') {
                    navigate('/home')
                }
            }
        )
    }

    function handleGetUplayGamesDataBtnClick() {
        showWindow(
            "Import Uplay Games",
            <LibraryGameImportModal library="uplay" />,
            (res) => {
                if (res === 'yes') {
                    navigate('/home')
                }
            }
        )
    }

    if (isSaving) {
        return <LoadingScreen />
    }
    
    return (
        <MainLayout>
            <div className="w-full h-full flex">
                <div className="flex flex-col items-center gap-4 border-r-2 border-gray-300 dark:border-gray-500">
                    <div
                        className="p-4 border-b-2 border-gray-300 font-bold dark:text-gray-100 dark:border-gray-500"
                    >
                        From Your Libraries
                    </div>
                    <button
                        className="outline-none cursor-pointer hover:opacity-80"
                        onClick={handleGetSteamDataBtnClick}
                    >
                        <div className="flex flex-col items-center gap-1">
                            <img src={SteamLogo} alt="Steam Logo" className="w-8 h-8" />
                            <p className="text-sm font-bold dark:text-gray-100">Steam</p>
                        </div>
                    </button>
                    <button
                        className="outline-none cursor-pointer hover:opacity-80"
                        onClick={handleGetEpicDataBtnClick}
                    >
                        <div className="flex flex-col items-center gap-1">
                            <img src={EpicLogo} alt="Epic Logo" className="w-8 h-8" />
                            <p className="text-sm font-bold dark:text-gray-100">Epic Games</p>
                        </div>
                    </button>
                    <button
                        className="outline-none cursor-pointer hover:opacity-80"
                        onClick={handleGetEaGamesDataBtnClick}
                    >
                        <div className="flex flex-col items-center gap-1">
                            <img src={EaLogo} alt="Epic Logo" className="w-8 h-8" />
                            <p className="text-sm font-bold dark:text-gray-100">Ea Games</p>
                        </div>
                    </button>
                    <button
                        className="outline-none cursor-pointer hover:opacity-80"
                        onClick={handleGetXboxGamesDataBtnClick}
                    >
                        <div className="flex flex-col items-center gap-1">
                            <img src={XboxLogo} alt="Epic Logo" className="w-8 h-8" />
                            <p className="text-sm font-bold dark:text-gray-100">Xbox Games</p>
                        </div>
                    </button>
                    <button
                        className="outline-none cursor-pointer hover:opacity-80"
                        onClick={handleGetUplayGamesDataBtnClick}
                    >
                        <div className="flex flex-col items-center gap-1">
                            <img src={UplayLogo} alt="Epic Logo" className="w-8 h-8" />
                            <p className="text-sm font-bold dark:text-gray-100">Uplay</p>
                        </div>
                    </button>
                </div>
                <GameForm
                    mode="add"
                    collections={collections}
                    onSubmit={handleSaveGame}
                />
            </div>
        </MainLayout>
    )
}