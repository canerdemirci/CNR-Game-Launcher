import { createContext, Dispatch, SetStateAction, useContext, useEffect, useState } from "react"

type DataContextType = {
    games: Game[]
    collections: GameCollection[]
    collectionsOnlyHasInstalledGames: GameCollection[]
}

type DataProviderType = DataContextType & {
    setGames: Dispatch<SetStateAction<Game[]>>,
    setCollections: Dispatch<SetStateAction<GameCollection[]>>,
    fetchGames: () => void,
    fetchCollections: () => void
}

export const DataProviderContext = createContext<DataProviderType>({
    games: [],
    collections: [],
    collectionsOnlyHasInstalledGames: [],
    setGames: (value: SetStateAction<Game[]>) => {},
    setCollections: (value: SetStateAction<GameCollection[]>) => {},
    fetchGames: () => {},
    fetchCollections: () => {}
})

export const DataProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
    const [games, setGames] = useState<Game[]>([])
    const [collections, setCollections] = useState<GameCollection[]>([])
    const [
        collectionsOnlyHasInstalledGames,
        setCollectionsOnlyHasInstalledGames
    ] = useState<GameCollection[]>([])

    useEffect(() => {
        fetchGames()
        fetchCollections()
    }, [])

    useEffect(() => {
        const installedGameIds = new Set(games.filter(g => g.isInstalled).map(g => g.id))

        setCollectionsOnlyHasInstalledGames(collections.filter(
            c => c.gameIds.some(
                gid => installedGameIds.has(gid))
            )
        )
    }, [collections, games])

    function fetchGames() {
        window.electron.games.get().then(gs => {
            setGames(gs.sort((a, b) => a.name.localeCompare(b.name)))
        })
    }

    function fetchCollections() {
        window.electron.gameCollections.get().then(gc => {
            setCollections(gc)
        })
    }

    const contextValue: DataProviderType = {
        games,
        collections,
        collectionsOnlyHasInstalledGames,
        setGames,
        setCollections,
        fetchGames,
        fetchCollections
    }
    
    return (
        <DataProviderContext.Provider value={contextValue}>
            {children}
        </DataProviderContext.Provider>
    )
}

export const useAppData = () => {
    const context = useContext(DataProviderContext)

    if (!context) {
        throw new Error('useAppData must be used within a DataProvider')
    }
    
    return context
}