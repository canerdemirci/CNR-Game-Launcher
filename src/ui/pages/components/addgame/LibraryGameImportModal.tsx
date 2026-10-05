import { useEffect, useState } from "react"
import Button, { buttonStyleVariants } from "../../../form_elements/Button"
import { addGame, getEaGamesData, getEpicData, getSteamData, getUplayGamesData, getXboxGamesData } from "../../../lib"
import { useWindowModal } from "../../../providers/WindowModalProvider"
import StickLoading from "../../../components/StickLoading"
import { useMessageModal } from "../../../providers/MessageModalProvider"

type GameData = {
    id: string
    name: string
}

function GameSelector({
    platformName,
    gameData,
    onSelect
}: {
    platformName: string,
    gameData: GameData[],
    onSelect: (selectedGames: GameData[]) => void
}) {
    const [allCheck, setAllCheck] = useState<boolean>(true)
    const [selectedGames, setSelectedGames] = useState<GameData[]>([...gameData])
    
    function handleAllCheck() {
        setAllCheck(prev => {
            if (prev === true) {
                setSelectedGames([])
                onSelect([])
            }
            else {
                setSelectedGames(gameData)
                onSelect(gameData)
            }

            return !prev
        })
    }

    function handleGameCheck(id: string, check: boolean) {
        let updatedSelected: GameData[]

        if (check) {
            if (selectedGames.some(g => g.id === id)) return
            
            const gameToAdd = gameData.find(g => g.id === id)
            
            if (!gameToAdd) return
            
            updatedSelected = [...selectedGames, gameToAdd]
        } else {
            updatedSelected = selectedGames.filter(g => g.id !== id)
        }
        
        setSelectedGames(updatedSelected)
        onSelect(updatedSelected)

        if (gameData.length === updatedSelected.length) {
            setAllCheck(true)
        } else {
            setAllCheck(false)
        }
    }

    
    return (
        <div>
            {
                gameData.length === 0
                    ? <h2 className="p-4">
                        Not found any installed game in {platformName}
                    </h2>
                    : <div>
                        <div>
                            <input
                                type="checkbox"
                                id="all"
                                name="all"
                                checked={allCheck}
                                onChange={handleAllCheck}
                            />
                            <label id="all" htmlFor="all">&nbsp;ALL</label>
                        </div>
                        <hr />
                        <div>
                            {
                                gameData.map((gd, index) => (
                                    <div key={gd.id}>
                                        <input
                                            type="checkbox"
                                            name={gd.id}
                                            id={gd.id}
                                            checked={selectedGames.some(g => g.id === gd.id)}
                                            onChange={(e) => handleGameCheck(
                                                gd.id,
                                                e.target.checked
                                            )}
                                        />
                                        <label htmlFor={gd.id}>
                                            &nbsp;{index + 1}. {gd.name}
                                        </label>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
            }
        </div>
    )
}

interface Props {
    library: "steam" | "epic" | "eagames" | "xbox" | "uplay"
}

export default function LibraryGameImportModal({ library }: Props) {
    const { hideWindow } = useWindowModal()
    const { showMessage } = useMessageModal()

    const [gameData, setGameData] = useState<GameData[]>([])
    const [selectedGames, setSelectedGames] = useState<GameData[]>([])
    const [fetchError, setFetchError] = useState<boolean>(false)
    const [isFetching, setIsFetching] = useState<boolean>(false)

    useEffect(() => {
        setIsFetching(true)
        
        if (library === 'steam') {
            getSteamData()
                .then(res => {
                    const ngData = res.map(r => ({ id: r.appId, name: r.name }))
                    setGameData(ngData)
                    setSelectedGames([...ngData])
                    setFetchError(false)
                })
                .catch(_ => setFetchError(true))
                .finally(() => {
                    setTimeout(() => {
                        setIsFetching(false)
                    }, 2000)
                })
        } else if (library === 'epic') {
            getEpicData()
                .then(res => {
                    const ngData = res.map(r => ({ id: r.appName, name: r.displayName }))
                    setGameData(ngData)
                    setSelectedGames([...ngData])
                    setFetchError(false)
                })
                .catch(_ => setFetchError(true))
                .finally(() => {
                    setTimeout(() => {
                        setIsFetching(false)
                    }, 2000)
                })
        } else if (library === 'eagames') {
            getEaGamesData()
                .then(res => {
                    const ngData = res.map(r => ({ id: r.gameId, name: r.name }))
                    setGameData(ngData)
                    setSelectedGames([...ngData])
                    setFetchError(false)
                })
                .catch(_ => setFetchError(true))
                .finally(() => {
                    setTimeout(() => {
                        setIsFetching(false)
                    }, 2000)
                })
        } else if (library === 'xbox') {
            getXboxGamesData()
                .then(res => {
                    const ngData = res.map(r => ({ id: r.gameId, name: r.name }))
                    setGameData(ngData)
                    setSelectedGames([...ngData])
                    setFetchError(false)
                })
                .catch(_ => setFetchError(true))
                .finally(() => {
                    setTimeout(() => {
                        setIsFetching(false)
                    }, 2000)
                })
        } else if (library === 'uplay') {
            getUplayGamesData()
                .then(res => {
                    const ngData = res.map(r => ({ id: r.gameId, name: r.name }))
                    setGameData(ngData)
                    setSelectedGames([...ngData])
                    setFetchError(false)
                })
                .catch(_ => setFetchError(true))
                .finally(() => {
                    setTimeout(() => {
                        setIsFetching(false)
                    }, 2000)
                })
        }
    }, [])
    
    return (
        <div className="p-4 flex flex-col gap-4 items-center">
            <div
                className="bg-gray-200 dark:bg-gray-500 rounded-md overflow-auto w-full h-50 p-2"
            >
                {
                    isFetching
                        ? (<div className="w-full h-full flex flex-col justify-center">
                            <StickLoading />
                        </div>)
                        : fetchError
                            ? <p className="text-red-400">
                                {`Failed to fetch ${library} games. Please make sure ${library.charAt(0).toUpperCase() + library.slice(1)} is installed and you have games in your library.`}
                            </p>
                            : <GameSelector
                                platformName={
                                    library === 'eagames'
                                        ? "EA Games"
                                            : library === 'epic'
                                                ? "Epic Games"
                                                    : library === 'steam'
                                                        ? "Steam Games"
                                                            : library === 'uplay'
                                                                ? "Uplay Games"
                                                                    : library === 'xbox'
                                                                        ? "Xbox Games"
                                                                            : ""
                                }
                                gameData={gameData}
                                onSelect={(sgames) => {
                                    setSelectedGames(sgames)
                                }}
                            />
                }
            </div>
            {!isFetching && <div className="flex gap-4">
                {!fetchError && <Button
                    caption="Add These Games"
                    onClick={() => {
                        try {
                            console.log(selectedGames)
                            for (const game of selectedGames) {
                                const exePath =
                                    library === 'steam'
                                        ? `steam://rungameid/${game.id}` :
                                    library === 'epic'
                                        ? `com.epicgames.launcher://apps/${game.id}?action=launch&silent=true` :
                                    library === 'eagames'
                                        ? `origin2://game/launch/?offerIds=${game.id}` :
                                    library === 'xbox'
                                        ? `msgamelaunch://shortcutLaunch/?ProductId=${game.id}`
                                        : `uplay://launch/${game.id}/0`

                                addGame({
                                    name: game.name,
                                    exePath: exePath,
                                    isInstalled: true,
                                    lastPlayed: new Date(Date.now()),
                                    playCount: 0,
                                    collectionIds: [],
                                    iconPath: undefined,
                                    cardIconPath: undefined
                                }, [])
                            }
                        } catch (_) {
                            showMessage(
                                "Error",
                                "Failed to add some games.",
                                "warning",
                                true
                            )
                            hideWindow("no")
                        }

                        showMessage(
                            "Games Added",
                            "Games added successfully!",
                            "info",
                            true
                        )
                        hideWindow("yes")
                    }}
                    styleVariant={buttonStyleVariants[1]}
                />}
                <Button
                    caption={fetchError ? "Close" : "Cancel"}
                    onClick={() => hideWindow("no")}
                    styleVariant={buttonStyleVariants[1]}
                />
            </div>}
        </div>
    )
}