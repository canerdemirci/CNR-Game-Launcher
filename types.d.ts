interface Window {
    electron: {
        userPreferences: {
            get: () => Promise<UserPreferences | null>,
            set: (userPrefs: UserPreferences) => void
        },
        app: {
            quit: () => void,
            toggleFullscreen: () => void,
            setFullscreen: (isFullscreen: boolean) => void,
            minimize: () => void,
            maximize: () => void,
            isFullscreen: (
                callback: (isFull: boolean) => void
            ) => UnsubscribeFunction,
            close: () => void,
            backup: () => Promise<BackupProcessResult>,
            restoreBackup: () => Promise<BackupRestoreProcessResult | void>,
            setWindowsBootStartOption: (startOnWindowsBoot: boolean) => void,
            setReviewReminder: (date: Date, periodWeek: number, complete: boolean) => void,
            getReviewReminder: () => Promise<{
                date: Date,
                periodWeek: number,
                complete: boolean
            } | null>,
            openReviewPage: () => void,
            mailFeedback: () => void
        },
        gameCollections: {
            get: () => Promise<GameCollection[]>,
            add: (collectionName: string) => Promise<GameCollection | null>,
            delete: (id: string) => void,
            setGames: (collectionId: string, gameIds: string[]) => void,
            addGame: (collectionId: string, gameId: string) => void,
            removeGamesFromCollection: (collectionId: string, gameIds: string[]) => void,
            removeAGameFromAllCollections: (gameId: string) => void
        },
        games: {
            get: () => Promise<Game[]>,
            getById: (id: string) => Promise<Game | null>,
            add: (gameData: Omit<Game, 'id' | 'createdAt'>) => Promise<Game | null>,
            update: (game: Game) => void,
            run: (path: string) => Promise<boolean>,
            incrementPlayCount: (id: string) => void,
            setLastPlayedDate: (id: string) => void,
            deleteGame: (id: string) => void,
            deleteGameIcons: (iconPaths: Array<string | undefined>) => Promise<{
                success: boolean, error?: string
            }>,
            setCollections: (id: string, collectionIds: string[]) => void
        },
        saveImage: (imageData: string) => Promise<ImageUploadResult>,
        selectFile: (options: Electron.OpenDialogOptions) => Promise<string[]>
    }
}

type EventPayloadMapping = {
    getUserPrefs: UserPreferences | null
    setUserPrefs: UserPreferences
    quitApp: void
    toggleFullscreen: void
    setFullscreen: boolean
    isFullscreen: boolean
    minimizeScreen: void
    maximizeScreen: void
    closeApp: void
    backup: void
    restoreBackup: void
    setWindowsBootStartOption: boolean
    getCollections: GameCollection[]
    addCollection: string
    deleteCollection: string
    setGamesToCollection: { collectionId: string, gameIds: string[] }
    addGameToCollection: { collectionId: string, gameId: string }
    getGames: Game[]
    getGameById: string
    addGame: Omit<Game, 'id' | 'createdAt'>
    updateGame: Game
    run: string
    incrementPlayCount: string
    setLastPlayedDate: string
    deleteGame: string
    removeGamesFromCollection: { collectionId: string, gameIds: string[] }
    removeAGameFromAllCollections: string
    saveImage: string
    selectFile: Electron.OpenDialogOptions
    deleteGameIcons: Array<string | undefined>
    setCollections: { id: string, collectionIds: string[] }
    setReviewReminder: { date: Date, periodWeek: number, complete: boolean }
    getReviewReminder: void
    openReviewPage: void
    mailFeedback: void
}

type EventReturnMapping = {
    getUserPrefs: UserPreferences | null
    setUserPrefs: void
    quitApp: void
    toggleFullscreen: void
    setFullscreen: void
    isFullscreen: boolean
    minimizeScreen: void
    maximizeScreen: void
    closeApp: void
    backup: BackupProcessResult
    restoreBackup: BackupRestoreProcessResult | void
    setWindowsBootStartOption: void
    getCollections: GameCollection[]
    addCollection: GameCollection | null
    deleteCollection: void
    setGamesToCollection: void
    addGameToCollection: void
    getGames: Game[]
    getGameById: Game | null
    addGame: Game | null
    updateGame: void
    run: boolean
    incrementPlayCount: void
    setLastPlayedDate: void
    deleteGame: void
    removeGamesFromCollection: void
    removeAGameFromAllCollections: void
    saveImage: ImageUploadResult
    selectFile: string[]
    deleteGameIcons: { success: boolean, error?: string }
    setCollections: void
    setReviewReminder: void
    getReviewReminder: { date: Date, periodWeek: number, complete: boolean } | null
    openReviewPage: void
    mailFeedback: void
}

type BackupProcessResult = 'completed' | 'canceled'
type BackupRestoreProcessResult = 'canceled' | 'incorrect file'

type ImageUploadResult = {
    success: boolean,
    path?: string,
    error?: string
}

type Rectangle = {
    x: number,
    y: number,
    width: number,
    height: number
}

type Theme = 'light' | 'dark' | 'system'

type UserPreferences = {
    windowBounds?: Rectangle,
    fullScreen?: boolean,
    maximized?: boolean,
    loginWithPin?: boolean,
    pinCode?: string
    sideMenuCollapsed?: boolean
    theme?: Theme
    showOnlyInstalledGamesAsDefault?: boolean
    gameViewKind?: 'list' | 'icon' | 'card'
    openBigpictureMode?: boolean
    startOnWindowsBoot?: boolean
    reviewRemind?: {
        date: Date,
        periodWeek: number
        complete: boolean
    }
}

type GameCollection = {
    id: string,
    name: string
    gameIds: string[]
}

type Game = {
    id: string,
    name: string,
    exePath?: string,
    isInstalled: boolean,
    createdAt: Date,
    lastPlayed: Date,
    playCount: number,
    iconPath?: string,
    cardIconPath?: string,
    collectionIds: string[]
}