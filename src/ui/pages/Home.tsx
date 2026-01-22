import {
    deleteCollection,
    deleteGameFromStore,
    removeGameFromCollection,
    runGame,
    updateGameStoreAfterGameRun
} from "../lib"
import { debounce, formatDate } from "../utils"
import clsx from "clsx"
import { useEffect, useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import { AnimationDefinition, useAnimation } from "motion/react"

import { useMessageModal } from "../providers/MessageModalProvider"
import { useConfirmationModal } from "../providers/ConfirmationModalProvider"
import { useWindowModal } from "../providers/WindowModalProvider"
import { useContextMenu } from "../providers/ContextMenuProvider"
import { useAppContext } from "../providers/AppContextProvider"

import { AppbarButtons, OrderTypes } from "../components/AppHeader"
import { MainLayout } from "../components/MainLayout"
import { Option } from '../form_elements/SelectBox'
import { FilterData } from "../components/Filter"
import Games from "./components/home/Games"
import GameCollectionUpdate from "./components/home/GameCollectionUpdate"
import Collections, { SIDE_MENU_MAX_WIDTH } from "./components/home/Collections"
import StatusBar from "./components/home/StatusBar"
import { useAppData } from "../providers/DataProvider"
import ReviewRemindWindow from "./components/home/ReviewRemindWindow"

const defaultFilterData: FilterData = {
    installedOnes: false,
    allGames: 'ALL_GAMES',
    collection: undefined,
    searchQuery: undefined,
    mostPlayedOnes: undefined,
    newOnes: undefined,
}
const openCollAnim: AnimationDefinition = {
    opacity: [0, 1],
    width: ["0rem", SIDE_MENU_MAX_WIDTH],
    maxWidth: ["0rem", SIDE_MENU_MAX_WIDTH],
    padding: "1rem",
    transition: {
        duration: 0.3,
    }
}
const closeCollAnim: AnimationDefinition = {
    opacity: [1, 0],
    width: [SIDE_MENU_MAX_WIDTH, "0rem"],
    maxWidth: [SIDE_MENU_MAX_WIDTH, "0rem"],
    padding: "0px",
    transition: {
        duration: 0.3,
    }
}

export default function Home() {
    const appContext = useAppContext()
    const {
        games,
        collections,
        setGames,
        setCollections,
        fetchGames,
        fetchCollections
    } = useAppData()
    const navigate = useNavigate()
    const collectionsAnimController = useAnimation()
    const { showMessage, hideMessage } = useMessageModal()
    const { showConfirmation } = useConfirmationModal()
    const { showWindow } = useWindowModal()
    const contextMenu = useContextMenu()

    const [filteredGames, setFilteredGames] = useState<Game[]>(games)
    const [selectedCollection, setSelectedCollection] =
        useState<GameCollection | undefined>(undefined)
    const [filterData, setFilterData] = useState<FilterData>(defaultFilterData)
    const [gameSortData, setGameSortData] = useState<{
        sortType: OrderTypes,
        direction: 'ascending' | 'descending'
    }>({
        sortType: OrderTypes.ALPHABETIC,
        direction: 'ascending'
    })

    useEffect(() => {
        fetchGames()
        fetchCollections()
        
        window.electron.app.getReviewReminder()
            .then((rreminder) => {
                const now = Date.now()
                const oneWeek = 7 * 24 * 60 * 60 * 1000

                if (!rreminder) {
                    return window.electron.app.setReviewReminder(
                        new Date(now + oneWeek), 1, false
                    )
                }

                if (rreminder.complete) return
                
                if (now >= new Date(rreminder!.date).getTime()) {
                    showWindow(
                        "Enjoying the App?",
                        <ReviewRemindWindow />,
                        (data) => {
                            if (data === 'yes') {
                                window.electron.app.openReviewPage()
                                window.electron.app.setReviewReminder(
                                    new Date(now), 1, true
                                )
                            } else if (data === 'notnow' || !data) {
                                if (rreminder.periodWeek === 1) {
                                    window.electron.app.setReviewReminder(
                                        new Date(now + (2 * oneWeek)), 2, false
                                    )
                                } else {
                                    window.electron.app.setReviewReminder(
                                        new Date(now + (4 * oneWeek)), 4, false
                                    )
                                }
                            } else if (data === 'no') {
                                window.electron.app.setReviewReminder(
                                    new Date(now), 1, true
                                )
                            } else if (data === 'mailfeedback') {
                                window.electron.app.mailFeedback()
                                window.electron.app.setReviewReminder(
                                    new Date(now + (12 * oneWeek)), 12, false
                                )
                            }
                        }
                   )
                }
            })
    }, [])

    useEffect(() => {
        appContext.setAppHeaderProps({
            excludedButtons: (
                !collections.length
                    ? [AppbarButtons.COLLECTIONS]
                    : []
            ).concat(
                [AppbarButtons.BACK]
            ).concat(
                (games.length === 0 || games.filter(g => g.isInstalled).length === 0)
                    ? [
                        AppbarButtons.BIGPICTURE,
                    ]
                    : []
            ).concat(
                (filteredGames.length === 0)
                    ? [
                        AppbarButtons.VIEWSELECTOR,
                        AppbarButtons.FILTER,
                        AppbarButtons.ORDERBOX
                    ]
                    : []
            ),
            onCollectionsClick: handleCollectionToggleClick,
            toolbarProps: {
                defaultViewStyle: appContext.gameViewKind,
                defaultFilterData: defaultFilterData,
                filterData: filterData,
                onChangeView: (view) => appContext.setGameViewKind(view),
                onChangeOrder: handleChangeOrder,
                onChangeFilter: handleFilterGames,
                onChangeSearch: handleSearchboxChange
            }
        })
    }, [collections, filterData, games, filteredGames])

    useEffect(() => {
        if (collections.length &&
            appContext.appHeaderProps &&
            appContext.appHeaderProps.excludedButtons.length)
        {
            appContext.setAppHeaderProps(prev => ({
                ...prev,
                excludedButtons: prev!.excludedButtons.filter(b => b !== AppbarButtons.COLLECTIONS)
            }))
        }
    }, [collections])

    useEffect(() => {
        if (games.length > 0) {
            filterAndSortGames(filterData)
        }
    }, [games, filterData, gameSortData])

    useEffect(() => {
        if (appContext.sideMenuCollapsed) {
            setTimeout(() => playCollCloseAnim(), 100)
        } else {
            setTimeout(() => playCollOpenAnim(), 100)
        }
    }, [appContext.sideMenuCollapsed])

    useEffect(() => {
        setFilterData(prev => ({
            ...prev,
            installedOnes: appContext.showOnlyInstalledGamesAsDefault
        }))
        appContext.setAppHeaderProps(prev => {
            if (prev && prev.toolbarProps) {
                return {
                    ...prev,
                    toolbarProps: {
                        ...prev.toolbarProps,
                        filterData: {
                            ...prev.toolbarProps.filterData,
                            installedOnes: appContext.showOnlyInstalledGamesAsDefault
                        }
                    }
                }
            }

            return prev
        })
    }, [appContext.showOnlyInstalledGamesAsDefault])

    const sortedCollections = useMemo(() => {
        return [...collections.sort((a, b) => a.name.localeCompare(b.name))]
    }, [collections])

    /**
     * Change games' play count and last played date in UI after running a game
     */
    function updateUIAfterGameRun(game: Game) {
        let playCount = 0
        let lastPlayedDate = new Date(Date.now())

        function mappedGames(games: Game[]) {
            return games.map(g => {
                if (g.id === game.id) {
                    playCount = g.playCount + 1

                    return {
                        ...g,
                        playCount: playCount,
                        lastPlayed: lastPlayedDate
                    } as Game
                }

                return g
            })
        }

        setGames(prev => mappedGames(prev))
        setFilteredGames(prev => mappedGames(prev))
    }

    /**
     * Update game list after game delete
     */
    function updateUIAfterGameDelete(game: Game) {
        setGames(prev => prev.filter(g => g.id !== game.id))
        setFilteredGames(prev => prev.filter(g => g.id !== game.id))
    }

    /**
     * Update UI after removing a game from a collection
     */
    function updateUIAfterGameRemoveFromCollection(game: Game, collection: GameCollection) {
        setCollections(prev => prev.map(c => {
            if (c.id === collection.id) {
                return {
                    ...c,
                    gameIds: c.gameIds.filter(gid => gid !== game.id)
                }
            }

            return c
        }))
        if (selectedCollection) {
            const modifiedCollection = {
                ...selectedCollection,
                gameIds: selectedCollection.gameIds.filter(gid => gid !== game.id)
            }

            setSelectedCollection(modifiedCollection)
            setFilterData(prev => ({ ...prev, collection: modifiedCollection }))
        }
        setGames(prev => prev.map(g => {
            if (g.id === game.id) {
                return {
                    ...g,
                    collectionIds: g.collectionIds.filter(cid => cid !== collection.id)
                }
            }

            return g
        }))
    }

    /**
     * Update UI after collection delete
     */
    function updateUIAfterCollectionDelete(collection: GameCollection) {
        setCollections(prev => prev.filter(p => p.id !== collection.id))
        window.electron.games.get()
            .then(gs => {
                setGames(gs)

                const newFilterData: FilterData = {
                    ...filterData,
                    allGames: 'ALL_GAMES',
                    collection: undefined
                }

                setFilterData({
                    ...newFilterData,
                    mostPlayedOnes: undefined,
                    newOnes: undefined,
                    searchQuery: undefined
                })
                setSelectedCollection(undefined)
            })
    }
    
    function playCollOpenAnim(): Promise<any> {
        return collectionsAnimController.start(openCollAnim)
    }

    function playCollCloseAnim(): Promise<any> {
        return collectionsAnimController.start(closeCollAnim)
    }

    function filterAndSortGames(filters: FilterData) {
        if (games.length === 0) return

        if (filters.searchQuery && filters.searchQuery.trim().length > 0) {
            const query = filters.searchQuery.trim().toLowerCase()
            const searchedGames = games.filter(g => g.name.toLowerCase().includes(query))

            setFilteredGames([...sortGames(searchedGames, OrderTypes.ALPHABETIC, 'ascending')])

            return
        }

        if (filters.mostPlayedOnes) {
            const playedGames = games.filter(g => g.playCount > 0)
            setFilteredGames([...sortGames(playedGames, OrderTypes.MOSTPLAYED, 'descending')])

            return
        }

        if (filters.newOnes) {
            setFilteredGames([...sortGames(games, OrderTypes.CREATEDAT, 'descending')])

            return
        }

        const fGames = games
            .filter(g => filters.installedOnes ? g.isInstalled === true : true)
            .filter(g => filters.collection && filters.allGames === 'ALL_GAMES_COLLECTION'
                ? filters.collection?.gameIds.includes(g.id)
                : true
            )

        setFilteredGames([
            ...sortGames(
                fGames,
                gameSortData.sortType,
                gameSortData.direction
            )
        ])
    }

    const debouncedSearch = useMemo(() => debounce((query: string) => {
        setSelectedCollection(undefined)
        setFilterData({
            ...filterData,
            mostPlayedOnes: undefined,
            newOnes: undefined,
            searchQuery: query
        })
    }, 300), [])

    function sortGames(
        arr: Array<Game>,
        orderType: OrderTypes,
        direction: 'ascending' | 'descending')
    {
        return arr.sort((a, b) => {
            switch (orderType) {
                case OrderTypes.ALPHABETIC:
                    return direction === 'ascending'
                        ? a.name.localeCompare(b.name)
                        : b.name.localeCompare(a.name)
                case OrderTypes.CREATEDAT:
                    return direction === 'ascending'
                        ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
                        : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                case OrderTypes.MOSTPLAYED:
                    return direction === 'ascending'
                        ? a.playCount - b.playCount
                        : b.playCount - a.playCount
                case OrderTypes.RECENTLYPLAYED:
                    return direction === 'ascending'
                        ? new Date(a.lastPlayed).getTime() - new Date(b.lastPlayed).getTime()
                        : new Date(b.lastPlayed).getTime() - new Date(a.lastPlayed).getTime()
            }
        })
    }
    
    // EVENTS
    function handleSearchboxChange(query: string) {
        debouncedSearch(query)
    }

    function handleCollectionDeleteClick(collection: GameCollection) {
        showConfirmation(
            "Delete Collection",
            "Are you sure you want to delete this collection?",
            (decision) => {
                if (decision === 'yes') {
                    deleteCollection(collection)
                    updateUIAfterCollectionDelete(collection)
                }
            }
        )
    }

    function handleAllGamesClick() {
        const fakeCollection: GameCollection = { name: "ALLGAMES", id: "0", gameIds: [] }

        const filters: FilterData = {
            ...filterData,
            allGames: 'ALL_GAMES',
            collection: fakeCollection,
            mostPlayedOnes: undefined,
            newOnes: undefined
        }
        
        setSelectedCollection(fakeCollection)
        setFilterData(filters)
    }

    function handleMostPlayedGamesClick() {
        const fakeCollection: GameCollection = { name: "MOSTPLAYED", id: "1", gameIds: [] }

        const filters: FilterData = {
            ...filterData,
            allGames: 'ALL_GAMES',
            collection: fakeCollection,
            mostPlayedOnes: true,
            newOnes: undefined
        }
        
        setSelectedCollection(fakeCollection)
        setFilterData(filters)
    }

    function handleNewGamesClick() {
        const fakeCollection: GameCollection = { name: "NEWGAMES", id: "2", gameIds: [] }

        const filters: FilterData = {
            ...filterData,
            allGames: 'ALL_GAMES',
            collection: fakeCollection,
            mostPlayedOnes: undefined,
            newOnes: true
        }
        
        setSelectedCollection(fakeCollection)
        setFilterData(filters)
    }

    function handleFilterGames(filters: FilterData) {
        setFilterData({
            ...filters,
            mostPlayedOnes: undefined,
            newOnes: undefined,
            searchQuery: undefined
        })

        if (filters.allGames === 'ALL_GAMES') {
            setSelectedCollection(undefined)
        }
    }

    function handleCollectionClick(collection: GameCollection) {
        setSelectedCollection(collection)
        setFilterData(prev => ({
            ...prev,
            allGames: 'ALL_GAMES_COLLECTION',
            collection: collection,
            mostPlayedOnes: undefined,
            newOnes: undefined,
            searchQuery: undefined
        }))
    }

    async function handleGameClick(game: Game) {
        const res = await runGame(game)

        if (res) {
            showMessage(
                "Game is opening...",
                "Game is opening...",
                "info",
                false
            )
            updateGameStoreAfterGameRun(game)
            updateUIAfterGameRun(game)
            setTimeout(() => {
                hideMessage()
                window.electron.app.minimize()
            }, 1000)
        } else {
            showMessage(
                "Game cannot be run",
                "Game executable path is not set or wrong.",
                "warning",
                true
            )
        }
    }

    function handleGameRightClick(game: Game, mousePos: { x: number, y: number }) {
        contextMenu.showContextMenu(
            mousePos,
            [
                {
                    id: "run",
                    label: "Run",
                    onClick: () => {
                        handleGameClick(game)
                    }
                },
                {
                    id: "edit",
                    label: "Edit Game",
                    onClick: () => {
                        navigate(`/editgame/${game.id}`)
                    }
                },
                {
                    id: "delete",
                    label: "Delete Game",
                    onClick: () => {
                        showConfirmation(
                            "Delete Game",
                            "Are you sure you want to delete this game?",
                            (decision) => {
                                if (decision === 'yes' && game) {
                                    deleteGameFromStore(game)
                                    updateUIAfterGameDelete(game)
                                }
                            }
                        )
                    }
                },
                {
                    id: "addcoll",
                    label: "Add to Collection",
                    onClick: () => {
                        showWindow(
                            "Update Game's Collections",
                            <GameCollectionUpdate
                                collections={collections}
                                game={game}
                            />,
                            (data) => {
                                if (data) {
                                    if (!data) return

                                    const gColls = data as GameCollection[]

                                    // Store updates
                                    window.electron.games.setCollections(
                                        game.id,
                                        gColls.map(c => c.id)
                                    )
                                    window.electron.gameCollections.      
                                        removeAGameFromAllCollections(game.id)
                                    gColls.forEach(coll => {
                                        window.electron.gameCollections.addGame(coll.id, game.id)
                                    })

                                    // UI updates
                                    window.electron.gameCollections.get()
                                        .then(colls => {
                                            setCollections(colls)

                                            if (selectedCollection) {
                                                setFilterData(prev => ({
                                                    ...prev,
                                                    collection: colls.find(
                                                        c => c.id === selectedCollection.id
                                                    )
                                                }))
                                            }
                                        })
                                    window.electron.games.get()
                                        .then(gs => {
                                            setGames(gs)
                                        })
                                }
                            }
                        )
                    }
                },
                {
                    id: "removecoll",
                    label: "Remove from Collection",
                    disabled: filterData.allGames === 'ALL_GAMES' &&
                        (!filterData.collection ||
                            (filterData.collection &&
                                filterData.collection.name !== 'ALLGAMES' ||
                                filterData.collection.name !== 'MOSTPLAYED')),
                    onClick: () => {
                        if (selectedCollection) {
                            removeGameFromCollection(selectedCollection, game)
                            updateUIAfterGameRemoveFromCollection(game, selectedCollection)
                        }
                    }
                },
                {
                    id: "properties",
                    label: "Properties",
                    onClick: () => {
                        const relatedCollections = collections.filter(
                            coll => game.collectionIds.includes(coll.id)).map(c => c.name)
                        const relatedCollectionsString = relatedCollections.length > 0 ?
                            'Related Game Collections\n' + relatedCollections.map(c => `* ${c}\n`)
                                .join('') 
                                : ''

                        showMessage(
                            'Game Properties',
                            `Game Name: ${game.name}\n` +
                            `Created Date: ${formatDate(game.createdAt.toString())}\n` +
                            `Is installed: ${game.isInstalled ? 'installed' : 'not installed'}\n` +
                            `Play Count: ${game.playCount}\n` +
                            `Last play date: ${formatDate(game.lastPlayed.toString())}\n` +
                            `Executable Path: ${game.exePath}\n\n` +
                            `${relatedCollectionsString}`,
                            'info',
                        )
                    }
                }
            ]
        )
    }

    async function handleCollectionToggleClick() {
        appContext.setSideMenuCollapsed(prev => !prev)
    }

    function handleChangeOrder(option: Option) {
        setGameSortData({ sortType: option.value as OrderTypes, direction: option.direction })
    }

    return (
        <MainLayout>
            <div className="flex flex-col w-full h-full">
                <div
                    className={clsx([
                        "w-full h-full overflow-hidden",
                        "flex items-start justify-start gap-0",
                        "bg-linear-to-br from-gray-50 to-yellow-50/10",
                        "dark:from-gray-700 dark:to-gray-900"
                    ])}
                >
                    {/* Left Side: Collections */}
                    <Collections
                        collections={sortedCollections}
                        collectionsAnimController={collectionsAnimController}
                        selectedCollection={selectedCollection}
                        handleAllGamesClick={handleAllGamesClick}
                        handleMostPlayedGamesClick={handleMostPlayedGamesClick}
                        handleNewGamesClick={handleNewGamesClick}
                        handleCollectionClick={handleCollectionClick}
                        handleDeletBtnClick={handleCollectionDeleteClick}
                    />
                    {/* Right Side: Games */}
                    <Games
                        viewStyle={appContext.gameViewKind}
                        games={filteredGames}
                        gameOnClick={handleGameClick}
                        gameOnRightClick={handleGameRightClick}
                        selectedCollection={selectedCollection}
                    />
                </div>
                {/* Info section */}
                <StatusBar
                    searchQuery={filterData.searchQuery}
                    foundGamesCountOnSearch={filteredGames.length}
                    totalGamesCount={games.length}
                    totalCollectionsCount={collections.length}
                    installedGamesCount={games.filter(g => g.isInstalled).length}
                    selectedCollection={selectedCollection}
                    filteredGamesCountInSelectedCollection={filteredGames.length}
                />
            </div>
        </MainLayout>
    )
}