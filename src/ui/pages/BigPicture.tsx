import { useEffect, useRef, useState } from "react"
import { useAppContext } from "../providers/AppContextProvider"
import clsx from "clsx"
import { soundManager } from "../SoundManager"
import IntroSound from "../assets/sounds/intro.mp3"
import ClickSound from "../assets/sounds/menu_click.wav"
import InvalidSound from "../assets/sounds/invalid.wav"
import ConnectSound from "../assets/sounds/connect.mp3"
import { motion } from "motion/react"
import { TbDeviceGamepad3Filled } from "react-icons/tb"
import Focusable, { KeyOrButton } from "./components/bigpicture/Focusable"
import { clampText } from "../utils"
import { IoGameController } from "react-icons/io5"
import { runGame, saveUserPreferencesOnExit, setWindowsBootStartOption, updateGameStoreAfterGameRun } from "../lib"
import { FilterData } from "../components/Filter"
import { OrderTypes } from "../components/AppHeader"
import { useGamepad } from "../hooks/useGamepad"
import BPMessageModal from "./components/bigpicture/BPMessageModal"
import BPHelpModal from "./components/bigpicture/BPHelpModal"
import BPQuitModal from "./components/bigpicture/BPQuitModal"
import { useNavigate } from "react-router-dom"
import { useAppData } from "../providers/DataProvider"
import BPSearchModal from "./components/bigpicture/BPSearchModal"
import BPSortModal from "./components/bigpicture/BPSortModal"

type Focusable = {
    name: string
    focusIndex: string
    keyButtonSet: KeyOrButton[]
    data?: any
    focusables?: Focusable[]
}

export default function BigPicture() {
    const navigate = useNavigate()
    const appContext = useAppContext()
    const {
        games,
        collectionsOnlyHasInstalledGames,
        setGames,
        fetchGames,
        fetchCollections
    } = useAppData()
    const { connected, buttons, leftStick, isStickMovedCardinal } = useGamepad()

    const [introFinish, setIntroFinish] = useState<boolean>(false)
    const [messageModalData, setMessageModalData] = useState<{
        show: boolean
        message: string,
        closeButton?: boolean
    }>({
        show: false,
        message: '',
        closeButton: true
    })
    const [isConnectSoundPlayed, setIsConnectSoundPlayed] = useState<boolean>(false)
    const [showLeftSide, setShowLeftSide] = useState<boolean>(false)
    const [helpModalShow, setHelpModalShow] = useState<boolean>(false)
    const [quitModalShow, setQuitModalShow] = useState<boolean>(false)
    const [searchModalShow, setSearchModalShow] = useState<boolean>(false)
    const [sortModalShow, setSortModalShow] = useState<boolean>(false)
    const [keyOrButton, setKeyOrButton] = useState<KeyOrButton | undefined>(undefined)
    const [focusIndex, setFocusIndex] = useState<string>("1.1")
    const [selectedCollection, setSelectedCollection] =
        useState<GameCollection | undefined>(undefined)
    const [filteredGames, setFilteredGames] = useState<Game[]>([])
    const [filterData, setFilterData] = useState<FilterData>({
        installedOnes: true,
        allGames: 'ALL_GAMES',
        collection: undefined,
        searchQuery: undefined,
        mostPlayedOnes: undefined,
        newOnes: undefined,
    })
    const [gameSortData, setGameSortData] = useState<{
        sortType: OrderTypes,
        direction: 'ascending' | 'descending'
    }>({
        sortType: OrderTypes.ALPHABETIC,
        direction: 'ascending'
    })

    // 3 - Message Modal
    // 4 - Help Modal
    // 5 - Quit Modal
    const uiMap: Focusable[] = [
        {
            name: "Main",
            focusIndex: "1",
            keyButtonSet: [
                { key: "ArrowUp", button: "Up", stick: 'left', direction: 'up' },
                { key: "ArrowDown", button: "Down", stick: 'left', direction: 'down' },
                { key: "ArrowLeft", button: "Left", stick: 'left', direction: 'left' },
                { key: "ArrowRight", button: "Right", stick: 'left', direction: 'right' },
                { key: "Tab", button: "LB" },
                { key: "Escape", button: "B" },
                // Space
                { key: " ", button: "View" },
                { key: "Shift", button: "LT" },
                { key: "a", button: "RB" },
                { key: "m", button: "Y" },
                { key: "n", button: "X" },
                { button: "Menu" }
            ],
            focusables: filteredGames.map((g, i) => ({
                name: g.name,
                focusIndex: `1.${i+1}`,
                data: g,
                keyButtonSet: [
                    { key: "ArrowUp", button: "Up", stick: 'left', direction: 'up' },
                    { key: "ArrowDown", button: "Down", stick: 'left', direction: 'down' },
                    { key: "ArrowLeft", button: "Left", stick: 'left', direction: 'left' },
                    { key: "ArrowRight", button: "Right", stick: 'left', direction: 'right' },
                    { key: "Tab", button: "LB" },
                    { key: "Enter", button: "A" },
                    { key: "Escape", button: "B" },
                    // Space
                    { key: " ", button: "View" },
                    { key: "Shift", button: "LT" },
                    { key: "a", button: "RB" },
                    { key: "m", button: "Y" },
                    { key: "n", button: "X" },
                    { button: "Menu" }
                ]
            }))
        },
        {
            name: "Aside",
            focusIndex: "2",
            keyButtonSet: [
                { key: "ArrowUp", button: "Up", stick: 'left', direction: 'up' },
                { key: "ArrowDown", button: "Down", stick: 'left', direction: 'down' },
                { key: "Tab", button: "LB" },
                { key: "Enter", button: "A" },
                { key: "Escape", button: "B" },
                // Space
                { key: " ", button: "View" },
                { key: "Shift", button: "LT" },
                { key: "a", button: "RB" },
                { key: "m", button: "Y" },
                { key: "n", button: "X" },
                { button: "Menu" }
            ],
            focusables: collectionsOnlyHasInstalledGames.map((c, i) => ({
                name: c.name,
                focusIndex: `2.${i+1}`,
                data: c,
                keyButtonSet: [
                    { key: "ArrowUp", button: "Up", stick: 'left', direction: 'up' },
                    { key: "ArrowDown", button: "Down", stick: 'left', direction: 'down' },
                    { key: "Tab", button: "LB" },
                    { key: "Enter", button: "A" },
                    { key: "Escape", button: "B" },
                    // Space
                    { key: " ", button: "View" },
                    { key: "Shift", button: "LT" },
                    { key: "a", button: "RB" },
                    { key: "m", button: "Y" },
                    { key: "n", button: "X" },
                    { button: "Menu" }
                ]
            }))
        },
        {
            name: "MessageModal",
            focusIndex: "3",
            keyButtonSet: [
                { key: "Enter", button: "A" },
                { key: "Escape", button: "B" },
            ]
        },
        {
            name: "HelpModal",
            focusIndex: "4",
            keyButtonSet: [
                { key: "Enter", button: "A" },
                { key: "Escape", button: "B" }
            ]
        },
        {
            name: "QuitModal",
            focusIndex: "5",
            keyButtonSet: [
                { key: "Escape", button: "B" },
                { key: "Enter", button: "A" },
                { key: "ArrowUp", button: "Up", stick: 'left', direction: 'up' },
                { key: "ArrowDown", button: "Down", stick: 'left', direction: 'down' },
            ],
            focusables: [
                {
                    name: "Cancel",
                    focusIndex: "5.1",
                    keyButtonSet: [
                        { key: "Escape", button: "B" },
                        { key: "Enter", button: "A" },
                        { key: "ArrowUp", button: "Up", stick: 'left', direction: 'up' },
                        { key: "ArrowDown", button: "Down", stick: 'left', direction: 'down' },
                    ],
                },
                {
                    name: "Help",
                    focusIndex: "5.2",
                    keyButtonSet: [
                        { key: "Escape", button: "B" },
                        { key: "Enter", button: "A" },
                        { key: "ArrowUp", button: "Up", stick: 'left', direction: 'up' },
                        { key: "ArrowDown", button: "Down", stick: 'left', direction: 'down' },
                    ],
                },
                {
                    name: "BackNormal",
                    focusIndex: "5.3",
                    keyButtonSet: [
                        { key: "Escape", button: "B" },
                        { key: "Enter", button: "A" },
                        { key: "ArrowUp", button: "Up", stick: 'left', direction: 'up' },
                        { key: "ArrowDown", button: "Down", stick: 'left', direction: 'down' },
                    ],
                },
                {
                    name: "Quit",
                    focusIndex: "5.4",
                    keyButtonSet: [
                        { key: "Escape", button: "B" },
                        { key: "Enter", button: "A" },
                        { key: "ArrowUp", button: "Up", stick: 'left', direction: 'up' },
                        { key: "ArrowDown", button: "Down", stick: 'left', direction: 'down' },
                    ],
                }
            ]
        },
        {
            name: "SearchModal",
            focusIndex: "6",
            keyButtonSet: [
                { key: "Escape", button: "B" },
                { key: "Enter", button: "A" },
            ]
        },
        {
            name: "SortModal",
            focusIndex: "7",
            keyButtonSet: [
                { key: "Escape", button: "B" },
                { key: "Enter", button: "A" },
                { key: "Shift", button: "LT" },
                { key: "ArrowUp", button: "Up", stick: 'left', direction: 'up' },
                { key: "ArrowDown", button: "Down", stick: 'left', direction: 'down' },
            ],
            focusables: [
                {
                    name: "Alphabetic",
                    focusIndex: "7.1",
                    keyButtonSet: [
                        { key: "Escape", button: "B" },
                        { key: "Enter", button: "A" },
                        { key: "Shift", button: "LT" },
                        { key: "ArrowUp", button: "Up", stick: 'left', direction: 'up' },
                        { key: "ArrowDown", button: "Down", stick: 'left', direction: 'down' },
                    ]
                },
                {
                    name: "CreatedDate",
                    focusIndex: "7.2",
                    keyButtonSet: [
                        { key: "Escape", button: "B" },
                        { key: "Enter", button: "A" },
                        { key: "Shift", button: "LT" },
                        { key: "ArrowUp", button: "Up", stick: 'left', direction: 'up' },
                        { key: "ArrowDown", button: "Down", stick: 'left', direction: 'down' },
                    ]
                },
                {
                    name: "MostPlayed",
                    focusIndex: "7.3",
                    keyButtonSet: [
                        { key: "Escape", button: "B" },
                        { key: "Enter", button: "A" },
                        { key: "Shift", button: "LT" },
                        { key: "ArrowUp", button: "Up", stick: 'left', direction: 'up' },
                        { key: "ArrowDown", button: "Down", stick: 'left', direction: 'down' },
                    ]
                },
                {
                    name: "RecentlyPlayed",
                    focusIndex: "7.4",
                    keyButtonSet: [
                        { key: "Escape", button: "B" },
                        { key: "Enter", button: "A" },
                        { key: "Shift", button: "LT" },
                        { key: "ArrowUp", button: "Up", stick: 'left', direction: 'up' },
                        { key: "ArrowDown", button: "Down", stick: 'left', direction: 'down' },
                    ]
                },
            ]
        }
    ] as const

    function lastIncreasedFocusIndex(
        currentIndex: string,
        focusableLength: number,
        increaseAmount: number = 1): string
    {
        if (!currentIndex.includes('.')) return currentIndex + '.1'
        
        const arr = currentIndex.split('.')
        const lastIndex = parseInt(arr[arr.length - 1])
        const nextIndex = lastIndex + increaseAmount
        const adjustedNextIndex = nextIndex > focusableLength ? (
            increaseAmount !== 1 ? (
                nextIndex % increaseAmount === 0
                    ? increaseAmount
                    : nextIndex % increaseAmount
            ) : 1
        ) : nextIndex

        return currentIndex.slice(0, currentIndex.lastIndexOf('.'))
            + "." + adjustedNextIndex.toString()
    }

    function lastDecreasedFocusIndex(
        currentIndex: string,
        focusableLength: number,
        decreaseAmount: number = 1): string
    {
        if (!currentIndex.includes('.')) return currentIndex + '.' + focusableLength.toString()

        const arr = currentIndex.split('.')
        const lastIndex = parseInt(arr[arr.length - 1])
        const prevIndex = lastIndex - decreaseAmount
        
        const adjustedPrevIndex = prevIndex < 1
            ? focusableLength
            : prevIndex

        return currentIndex.slice(0, currentIndex.lastIndexOf('.'))
            + "." + adjustedPrevIndex.toString()
    }

    function findFocusable(focusables: Focusable[], currentIndex: string): Focusable | null {
        for (const item of focusables) {
            if (item.focusIndex === currentIndex) {
                return item
            }
            
            if (item.focusables && item.focusables.length > 0) {
                const found = findFocusable(item.focusables, currentIndex)

                if (found) {
                    return found
                }
            }
        }

        return null
    }

    function findFocusableByName(
        name: string,
        focusables: Focusable[],
        currentIndex: string): Focusable | null
    {
        for (const item of focusables) {
            if (item.name === name) {
                return item
            }
            
            if (item.focusables && item.focusables.length > 0) {
                const found = findFocusableByName(item.name, item.focusables, currentIndex)

                if (found) {
                    return found
                }
            }
        }

        return null
    }

    function getFocusIndexByName(name: string, focusables: Focusable[]): string {
        for (const item of focusables) {
            if (item.name === name) {
                return item.focusIndex
            }

            if (item.focusables && item.focusables.length > 0) {
                const foundInChildren = getFocusIndexByName(name, item.focusables)

                if (foundInChildren) {
                    return foundInChildren
                }
            }
        }

        return ''
    }

    const lastKeyTime = useRef(0)

    useEffect(() => {
        if (games.filter(g => g.isInstalled).length === 0) {
            navigate('/home')
            return
        }
        
        appContext.setAppHeaderProps(undefined)

        window.electron.app.setFullscreen(true)

        fetchGames()
        fetchCollections()
        
        soundManager.register('intro', new Howl({ src: IntroSound, onend: handleIntroSoundEnd }))
        soundManager.register('invalid', new Howl({ src: InvalidSound }))
        soundManager.register('click', new Howl({ src: ClickSound }))
        soundManager.register('connect', new Howl({ src: ConnectSound }))
        soundManager.play('intro')

        const handleKeyDown = (event: KeyboardEvent) => {
            event.stopPropagation()
            event.stopImmediatePropagation()

            const now = Date.now()

            if (now - lastKeyTime.current < 100) {
                event.preventDefault()
                return
            }

            lastKeyTime.current = now

            setKeyOrButton({ key: event.key })
        }

        window.addEventListener('keydown', handleKeyDown)

        return () => {
            window.removeEventListener('keydown', handleKeyDown)
        }
    }, [])

    useEffect(() => {
        if (games.length > 0) {
            filterAndSortGames(filterData)

            if (filterData.searchQuery?.trim().length! > 0) {
                const query = filterData.searchQuery!.trim().toLowerCase()
                const searchedGames = games.filter(g => g.name.toLowerCase().includes(query))

                if (searchedGames.length === 0) {
                    setFocusIndex("3")
                    setMessageModalData({
                        show: true,
                        message: `No games found for "${filterData.searchQuery!.trim()}"`,
                        closeButton: true
                    })
                    setFilterData(prev => ({ ...prev, searchQuery: undefined }))
                }
            }
        }
    }, [games, filterData, gameSortData])

    useEffect(() => {
        if (connected) {
            soundManager.play('connect')
            setIsConnectSoundPlayed(true)
            console.log('gamepad connected')
        } else {
            if (isConnectSoundPlayed) {
                soundManager.play('connect')
            }

            console.log('gamepad disconnected')
        }
    }, [connected])

    /*const lastKeyTime2 = useRef(0)
    
    useEffect(() => {
        const now = Date.now()

        if (now - lastKeyTime2.current < 100) {
            return
        }

        lastKeyTime2.current = now
        
        const pressedBtn = buttons.find(b => b.pressed === true)

        if (pressedBtn) {
            setKeyOrButton({ button: pressedBtn.name })
        }

        if (isStickMovedCardinal('left', 'left')) {
            setKeyOrButton({ stick: 'left', direction: 'left' })
        } else if (isStickMovedCardinal('left', 'right')) {
            setKeyOrButton({ stick: 'left', direction: 'right' })
        } else if (isStickMovedCardinal('left', 'up')) {
            setKeyOrButton({ stick: 'left', direction: 'up' })
        } else if (isStickMovedCardinal('left', 'down')) {
            setKeyOrButton({ stick: 'left', direction: 'down' })
        }
    }, [buttons, leftStick])*/

    const lastKeyTime2 = useRef(0)
    const prevButtonsRef = useRef<boolean[]>([])
    const prevStickDirection = useRef<string | null>(null)

    useEffect(() => {
    const now = performance.now()

    // Handle buttons
    const pressedBtn = buttons.find((b, index) => {
        const wasPressed = prevButtonsRef.current[index]
        return b.pressed && !wasPressed
    })

    if (pressedBtn) {
        setKeyOrButton({ button: pressedBtn.name })
    }

    // Handle stick
    let stickDirection: string | null = null
    if (isStickMovedCardinal('left', 'left')) stickDirection = 'left'
    else if (isStickMovedCardinal('left', 'right')) stickDirection = 'right'
    else if (isStickMovedCardinal('left', 'up')) stickDirection = 'up'
    else if (isStickMovedCardinal('left', 'down')) stickDirection = 'down'

    if (
        stickDirection &&
        stickDirection !== prevStickDirection.current && // only fire on change
        now - lastKeyTime2.current > 100 // debounce
    ) {
        setKeyOrButton({ stick: 'left', direction: stickDirection } as KeyOrButton)
        lastKeyTime2.current = now
        prevStickDirection.current = stickDirection
    }

    // Reset when stick returns to neutral
    if (!stickDirection) {
        prevStickDirection.current = null
    }

    prevButtonsRef.current = buttons.map(b => b.pressed)
    }, [buttons, leftStick])


    useEffect(() => {
        if ((keyOrButton?.key || keyOrButton?.button || keyOrButton?.stick) && introFinish) {
            const focusable = findFocusable(uiMap, focusIndex)
            
            if (
                focusable?.keyButtonSet.find(s => {
                    if (keyOrButton.key) {
                        if (s.key === keyOrButton.key) return true
                    }

                    if (keyOrButton.button) {
                        if (s.button === keyOrButton.button) return true
                    }

                    if (keyOrButton.stick && keyOrButton.direction) {
                        if (s.stick === keyOrButton.stick && s.direction === keyOrButton.direction) 
                        {
                            return true
                        }
                    }
                    
                    return false
                })
            ) {
                soundManager.play('click')

                // Start button (Quit Modal)
                if (keyOrButton.button === 'Menu') {
                    // If current focus on Games or Collections:
                    // Turn to Quit Modal and show Quit Modal and
                    // close collections if it was open
                    if (focusIndex.startsWith("1") || focusIndex.startsWith("2")) {
                        if (showLeftSide) {
                            setShowLeftSide(false)
                        }

                        setFocusIndex("5.1")
                        setQuitModalShow(true)
                    }
                }

                // ESC key or B button (BACK / CLOSE)
                if (keyOrButton?.key === 'Escape' || keyOrButton?.button === 'B') {
                    // If current focus on Help Modal: Turn to Games and close Help Modal
                    if (focusIndex === "4") {
                        setFocusIndex("1.1")
                        setHelpModalShow(false)
                    }

                    // If current focus on Games: Turn to Quit Modal and show Quit Modal and
                    // close collections if it was open
                    if (focusIndex.startsWith("1")) {
                        if (showLeftSide) {
                            setShowLeftSide(false)
                        }

                        setFocusIndex("5.1")
                        setQuitModalShow(true)
                    }

                    // If current focus on Quit Modal: Turn to Games and close Quit Modal
                    if (focusIndex.startsWith("5")) {
                        setFocusIndex("1.1")
                        setQuitModalShow(false)
                    }

                    // If current focus on Message Modal: Turn to Games and close Mes.Modal
                    if (focusIndex.startsWith("3")) {
                        setFocusIndex("1.1")
                        setMessageModalData(prev => ({ ...prev, show: false }))
                    }

                    // If current focus on Collections: Turn to Games and close Collections
                    if (focusIndex.startsWith("2")) {
                        setFocusIndex("1.1")
                        setShowLeftSide(false)
                    }

                    // If current focus on Search Modal: Turn to Games and close Search Modal
                    if (focusIndex.startsWith("6")) {
                        setFocusIndex("1.1")
                        setSearchModalShow(false)
                    }

                    // If current focus on Sort Modal: Turn to Games and close Sort Modal
                    if (focusIndex.startsWith("7")) {
                        setFocusIndex("1.1")
                        setSortModalShow(false)
                    }
                }

                // Space key or Options button (SEARCH GAME)
                if (keyOrButton.key === ' ' || keyOrButton.button === 'View') {
                    // If current focus on Games or Collections: Open search modal
                    if (focusIndex.startsWith("1") || focusIndex.startsWith("2")) {
                        setFocusIndex("6")
                        setSearchModalShow(true)
                    }
                }

                // Shift key or LT button (SORT GAMES)
                if (keyOrButton.key === 'Shift' || keyOrButton.button === 'LT') {
                    // If current focus on Games or Collections: Open sort modal
                    if (focusIndex.startsWith("1") || focusIndex.startsWith("2")) {
                        setFocusIndex("7.1")
                        setSortModalShow(true)
                    }

                    if (focusIndex.startsWith("7")) {
                        setFocusIndex("1.1")
                        setSortModalShow(false)
                    }
                }

                // A key or RB button (Display All Games - Clear filter)
                if (keyOrButton.key === 'a' || keyOrButton.button === 'RB') {
                    setSelectedCollection(undefined)
                    setFilterData({
                        allGames: 'ALL_GAMES',
                        installedOnes: true,
                        collection: undefined,
                        mostPlayedOnes: undefined,
                        newOnes: undefined,
                        searchQuery: undefined
                    })
                    setGameSortData({
                        sortType: OrderTypes.ALPHABETIC,
                        direction: 'ascending'
                    })
                    setMessageModalData({
                        show: true,
                        message: 'Displaying all games',
                        closeButton: false
                    })
                    setTimeout(() => setMessageModalData(prev => ({ ...prev, show: false })), 1000)
                }

                // M key or Y button (Display Most Played Games)
                if (keyOrButton.key === 'm' || keyOrButton.button === 'Y') {
                    setSelectedCollection(undefined)
                    setFilterData({
                        allGames: 'ALL_GAMES',
                        installedOnes: true,
                        collection: undefined,
                        mostPlayedOnes: true,
                        newOnes: undefined,
                        searchQuery: undefined
                    })
                    setMessageModalData({
                        show: true,
                        message: 'Displaying most played games',
                        closeButton: false
                    })
                    setTimeout(() => setMessageModalData(prev => ({ ...prev, show: false })), 1000)
                }

                // N key or X button (Display New Games)
                if (keyOrButton.key === 'n' || keyOrButton.button === 'X') {
                    setSelectedCollection(undefined)
                    setFilterData({
                        allGames: 'ALL_GAMES',
                        installedOnes: true,
                        collection: undefined,
                        mostPlayedOnes: undefined,
                        newOnes: true,
                        searchQuery: undefined
                    })
                    setMessageModalData({
                        show: true,
                        message: 'Displaying new games',
                        closeButton: false
                    })
                    setTimeout(() => setMessageModalData(prev => ({ ...prev, show: false })), 1000)
                }

                // Enter key or A button (SELECT / OPEN / RUN)
                if (keyOrButton?.key === 'Enter' || keyOrButton?.button === 'A') {
                    // If current focus on Games: Run game
                    if (focusIndex.startsWith("1")) {
                        const game: Game = findFocusable(
                            uiMap.filter(m => m.name === 'Main'),
                            focusIndex
                        )?.data

                        if (game) {
                            return handleGameClick(game)
                        }
                    }

                    // If current focus on Collections:
                    // 1. Set selected collection
                    // 2. Set filter data
                    // 3. Close left side (close collections)
                    // 4. Turn to games
                    if (focusIndex.startsWith("2")) {
                        const collection: GameCollection = findFocusable(
                            uiMap.filter(m => m.name === 'Aside'),
                            focusIndex
                        )?.data

                        if (collection) {
                            setSelectedCollection(collection)
                            setFilterData(prev => ({
                                ...prev,
                                allGames: 'ALL_GAMES_COLLECTION',
                                collection: collection,
                                mostPlayedOnes: undefined,
                                newOnes: undefined,
                                searchQuery: undefined
                            }))
                            setShowLeftSide(false)
                            setFocusIndex('1.1')
                        }
                    }

                    // If current focus on Message Modal: Turn to Games and close Mes. Modal
                    if (focusIndex.startsWith("3")) {
                        setMessageModalData(prev => ({ ...prev, show: false }))
                        setFocusIndex('1.1')
                    }

                    // If current focus on Help Modal: Turn to Games and close Help Modal
                    if (focusIndex.startsWith("4")) {
                        setFocusIndex("1.1")
                        setHelpModalShow(false)
                    }

                    // If current focus on Quit Modal - Cancel option:
                    // Turn to Games and close Quit Modal
                    if (focusIndex === "5.1") {
                        setFocusIndex('1.1')
                        setQuitModalShow(false)
                    }

                    // If current focus on Quit Modal - Help option:
                    // show help modal and close quit modal
                    if (focusIndex === "5.2") {
                        setFocusIndex("4")
                        setHelpModalShow(true)
                        setQuitModalShow(false)
                    }

                    // If current focus on Quit Modal - Back to normal mode option:
                    // Turn to Home page
                    if (focusIndex === "5.3") {
                        navigate('/home')
                    }

                    // If current focus on Quit Modal - Quit option:
                    // Quit from the app
                    if (focusIndex === "5.4") {
                        appContext.setOpenBigPictureMode(true)
                        saveUserPreferencesOnExit(
                            appContext.sideMenuCollapsed,
                            appContext.gameViewKind,
                            appContext.theme
                        )
                        setWindowsBootStartOption(appContext.startOnWindowsBoot)
                        window.electron.app.quit()
                    }

                    // If current focus on Sort Modal - Alphabetic option
                    if (focusIndex === "7.1") {
                        setGameSortData(prev => ({
                            sortType: OrderTypes.ALPHABETIC,
                            direction: prev.direction === 'ascending' ? 'descending' : 'ascending'
                        }))
                        setFocusIndex("1.1")
                        setSortModalShow(false)
                    }

                    // If current focus on Sort Modal - CreatedDate option
                    if (focusIndex === "7.2") {
                        setGameSortData(prev => ({
                            sortType: OrderTypes.CREATEDAT,
                            direction: prev.direction === 'ascending' ? 'descending' : 'ascending'
                        }))
                        setFocusIndex("1.1")
                        setSortModalShow(false)
                    }

                    // If current focus on Sort Modal - MostPlayed option
                    if (focusIndex === "7.3") {
                        setGameSortData(prev => ({
                            sortType: OrderTypes.MOSTPLAYED,
                            direction: prev.direction === 'ascending' ? 'descending' : 'ascending'
                        }))
                        setFocusIndex("1.1")
                        setSortModalShow(false)
                    }

                    // If current focus on Sort Modal - MostPlayed option
                    if (focusIndex === "7.4") {
                        setGameSortData(prev => ({
                            sortType: OrderTypes.RECENTLYPLAYED,
                            direction: prev.direction === 'ascending' ? 'descending' : 'ascending'
                        }))
                        setFocusIndex("1.1")
                        setSortModalShow(false)
                    }
                }

                // Tab key or LB button (TOGGLE COLLECTIONS)
                if (keyOrButton.key === 'Tab' || keyOrButton.button === 'LB') {
                    // If the current focus on Games and there's any collection: Open collections
                    if (focusIndex.startsWith("1") && collectionsOnlyHasInstalledGames.length > 0) {
                        setFocusIndex("2.1")
                        setShowLeftSide(true)
                    }

                    // If the current focus on Collections: Turn to games
                    if (focusIndex.startsWith("2")) {
                        setFocusIndex("1.1")
                        setShowLeftSide(false)
                    }
                }

                // ArrowDown key or Down button or Left stick down direction
                if (keyOrButton?.key === 'ArrowDown' ||
                    keyOrButton?.button === 'Down' ||
                    (keyOrButton?.stick === 'left' && keyOrButton.direction === 'down'))
                {
                    setFocusIndex(prev => {
                        // Down in collections
                        if (prev.startsWith('2')) {
                            return lastIncreasedFocusIndex(
                                prev,
                                collectionsOnlyHasInstalledGames.length
                            )
                        }

                        // Down in games
                        if (prev.startsWith('1')) {
                            return lastIncreasedFocusIndex(prev, filteredGames.length, 4)
                        }

                        // Down in quit menu
                        if (prev.startsWith('5')) {
                            return lastIncreasedFocusIndex(prev, 4)
                        }

                        // Down in sort menu
                        if (prev.startsWith('7')) {
                            return lastIncreasedFocusIndex(prev, 4)
                        }

                        return prev
                    })
                }

                // ArrowUp key or Up button or Left stick up direction
                if (keyOrButton?.key === 'ArrowUp' ||
                    keyOrButton?.button === 'Up' ||
                    (keyOrButton?.stick === 'left' && keyOrButton.direction === 'up'))
                {
                    setFocusIndex(prev => {
                        // Up in collections
                        if (prev.startsWith('2')) {
                            return lastDecreasedFocusIndex(
                                prev,
                                collectionsOnlyHasInstalledGames.length
                            )
                        }

                        // Up in games
                        if (prev.startsWith('1')) {
                            return lastDecreasedFocusIndex(prev, filteredGames.length, 4)
                        }

                        // Up in quit menu
                        if (prev.startsWith('5')) {
                            return lastDecreasedFocusIndex(prev, 4)
                        }

                        // Up in sort menu
                        if (prev.startsWith('7')) {
                            return lastDecreasedFocusIndex(prev, 4)
                        }

                        return prev
                    })
                }

                // ArrowRight key or Right button or Left stick right direction
                if (keyOrButton?.key === 'ArrowRight' ||
                    keyOrButton?.button === 'Right' ||
                    (keyOrButton?.stick === 'left' && keyOrButton.direction === 'right'))
                {
                    setFocusIndex(prev => {
                        // Right in games
                        if (prev.startsWith('1')) {
                            return lastIncreasedFocusIndex(prev, filteredGames.length)
                        }

                        return prev
                    })
                }

                // ArrowLeft key or Left button or Left stick left direction
                if (keyOrButton?.key === 'ArrowLeft' ||
                    keyOrButton?.button === 'Left' ||
                    (keyOrButton?.stick === 'left' && keyOrButton.direction === 'left'))
                {
                    setFocusIndex(prev => {
                        // Left in games
                        if (prev.startsWith('1')) {
                            return lastDecreasedFocusIndex(prev, filteredGames.length)
                        }

                        return prev
                    })
                }
            } else {
                soundManager.play('invalid')
            }
        }
    }, [keyOrButton, introFinish])

    function handleIntroSoundEnd() {
        setTimeout(() => setIntroFinish(true), 1500)
    }

    function handleGameClick(game: Game) {
        runGame(game).then(res => {
            if (res) {
                setFocusIndex('3')
                setMessageModalData({
                    show: true,
                    message: 'Game is opening',
                    closeButton: false
                })
                updateGameStoreAfterGameRun(game)
                updateUIAfterGameRun(game)
                setTimeout(() => {
                    setFocusIndex('1.1')
                    setMessageModalData(prev => ({ ...prev, show: false }))
                    window.electron.app.minimize()
                }, 1000)
            } else {
                setFocusIndex('3')
                setMessageModalData({
                    show: true,
                    message: "Game executable path is not set or wrong.",
                    closeButton: true
                })
            }
        })
    }

    function handleSearchGame(query: string) {
        setFocusIndex("1.1")
        setSearchModalShow(false)

        if (query.trim()) {
            setFilterData(prev => ({
                ...prev,
                searchQuery: query.trim()
            }))
        }
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

    if (!introFinish) {
        return (
            <div
                className={clsx([
                    "w-full h-full flex justify-center items-center",
                    "bg-radial from-black to-blue-950"
                ])}
            >
                <motion.div
                    initial={{
                        opacity: 0,
                        fontSize: '1rem'
                    }}
                    animate={{
                        opacity: [0, 1],
                        fontSize: '25rem',
                        transition: {
                            duration: 4
                        }
                    }}
                >
                    <TbDeviceGamepad3Filled
                        className="text-white"
                    />
                </motion.div>
            </div>
        )
    }
    
    return (
        <div
            className={clsx([
                introFinish && ["gradient_anim4"],
                "w-full h-full overflow-hidden cursor-none bg-black", "text-white",
            ])}
        >
            {/* MODALS ---Start--- */}
            <BPMessageModal
                show={messageModalData.show}
                focusIndex={focusIndex}
                message={messageModalData.message}
                closeButton={messageModalData.closeButton}
            />
            <BPHelpModal
                show={helpModalShow}
                focusIndex={focusIndex}
            />
            <BPQuitModal
                show={quitModalShow}
                focusIndex={focusIndex}
            />
            <BPSearchModal
                show={searchModalShow}
                focusIndex={focusIndex}
                onSearch={handleSearchGame}
            />
            <BPSortModal
                show={sortModalShow}
                focusIndex={focusIndex}
                sortData={gameSortData}
            />
            {/* MODALS ---End--- */}

            {/* Big Picture UI */}
            <main
                className={clsx([
                    "w-full h-full flex gap-8"
                ])}
            >
                {
                    showLeftSide &&
                    <Focusable
                        element="aside"
                        index="2"
                        focusIndex={focusIndex}
                        className={clsx([
                            showLeftSide ? "w-[20%]" : "w-0",
                            "h-full bg-black/25",
                            "shadow-2xl shadow-white/25 backdrop-blur-lg",
                            "border-r border-white/15"
                            
                        ])}
                        focusClasses={clsx([
                            showLeftSide ? "w-[20%]" : "w-0",
                            "h-full bg-black/25",
                            "shadow-2xl shadow-white/25 backdrop-blur-lg",
                            "border-r border-white/15"
                        ])}
                    >
                        <div
                            className={clsx([
                                "overflow-hidden h-full w-full",
                                "flex flex-col items-center"
                            ])}
                        >
                            <div
                                className={clsx([
                                    "font-bold text-2xl p-4 bg-black/50 w-full",
                                    "border-b-2 border-white/50"
                                ])}
                            >
                                COLLECTIONS
                            </div>
                            {
                                collectionsOnlyHasInstalledGames.map((coll, i) =>
                                    <Focusable
                                        key={coll.id}
                                        element="div"
                                        index={`2.${i + 1}`}
                                        focusOnScroll={{
                                            behavior: 'smooth',
                                            block: 'nearest'
                                        }}
                                        focusIndex={focusIndex}
                                        className={clsx([
                                            "transition-all duration-100 w-full",
                                            "border-b border-white/15",
                                            selectedCollection?.id === coll.id
                                                ? [
                                                    "p-4 bg-orange-500 text-white font-bold",
                                                ]
                                                : [
                                                    "p-4 bg-white/20 text-white font-bold",
                                                ]
                                        ])}
                                        focusClasses={clsx([
                                            "p-4 bg-black/30 w-full",
                                            "text-white font-bold border-l-5 border-white",
                                        ])}
                                    >
                                        {coll.name}
                                    </Focusable>
                                )
                            }
                        </div>
                    </Focusable>
                }
                <Focusable
                    element="section"
                    index="1"
                    focusIndex={focusIndex}
                    className={clsx([
                        showLeftSide ? "w-[80%]" : "w-full",
                        "h-full px-8 pt-8 pb-32 grid grid-cols-4 overflow-hidden",
                        "2xl:gap-24",
                        "xl:gap-16",
                        "lg:gap-12",
                    ])}
                    focusClasses={clsx([
                        showLeftSide ? "w-[80%]" : "w-full",
                        "h-full px-8 pt-8 pb-32 grid grid-cols-4 overflow-hidden",
                        "2xl:gap-24",
                        "xl:gap-16",
                        "lg:gap-12",
                    ])}
                >
                    {
                        filteredGames.map((game, gi) => <motion.div
                                key={game.id}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: [0, 1] }}
                                transition={{ duration: 0.7, delay: gi * 0.07 }}
                                className={clsx([
                                    "gradient_anim2",
                                    "rounded-md", "aspect-2/3",
                                    "drop-shadow-xl drop-shadow-black/60",
                                    "duration-200 transition-transform ease-in",

                                    focusIndex === `1.${gi+1}` ? [
                                        "scale-110 p-[0.18rem] drop-shadow-blue-500 border-0"
                                    ] : [
                                        "border-2 border-white"
                                    ]
                                ])}
                            >
                                {/* Shining effect div */}
                                <div className={clsx([
                                    "invisible absolute top-0 left-0 w-full h-full bg-linear-to-r",
                                    "transition-[transform,background] duration-500",
                                    "from-transparent via-white/10 to-transparent",
                                    "bg-size-[200%_100%] bg-position-[-200%_0%]",

                                    focusIndex === `1.${gi+1}` && ["bg-position-[0%_0%] visible"]
                                ])} />
                                <Focusable
                                    element="div"
                                    index={`1.${gi+1}`}
                                    focusIndex={focusIndex}
                                    focusOnScroll={{
                                        behavior: 'smooth',
                                        block: 'center'
                                    }}
                                    className="w-full h-full"
                                    focusClasses={clsx([
                                        "w-full h-full",
                                    ])}
                                >
                                    {game.cardIconPath && <img
                                        src={game.cardIconPath}
                                        alt={game.name}
                                        className="w-full h-full object-cover rounded-md"
                                    />}
                                    {
                                        !game.cardIconPath &&
                                        <div
                                            className={clsx([
                                                "w-full h-full p-4",
                                                "rounded-md border border-gray-950",
                                                "flex flex-col items-center justify-center gap-4",
                                                "bg-linear-to-r",
                                                "from-gray-800 to-gray-900",
                                            ])}
                                        >
                                            <IoGameController
                                                size={46}
                                                className={clsx([
                                                    "text-gray-700 dark:text-gray-400"
                                                ])}
                                            />
                                            <span
                                                className={clsx([
                                                    "text-center font-[ScienceGothic]", "text-gray-400",
                                                    "capitalize", "text-sm lg:text-lg", "wrap-anywhere",
                                                ])}
                                            >{clampText(game.name, 30)}</span>
                                        </div>
                                    }
                                </Focusable>
                            </motion.div>)
                    }
                </Focusable>
            </main>
        </div>
    )
}