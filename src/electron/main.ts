import { app, BrowserWindow, shell, protocol, net, Menu } from 'electron'
import path, { dirname } from 'path'
import { fileURLToPath, pathToFileURL } from 'url'
import { ipcMainHandle, ipcMainOn, isDev } from './util.js'
import { getPreloadPath, getUIPath } from './pathResolver.js'
import { UserPreferencesStore } from './store/UserPreferencesStore.js'
import { CollectionStore } from './store/CollectionStore.js'
import Store from 'electron-store'
import { GameStore } from './store/GameStore.js'
import * as fs from 'fs/promises'
import * as fsExtra from 'fs-extra'
import { dialog } from 'electron/main'
import _Ajv from 'ajv'

const Ajv = _Ajv as unknown as typeof _Ajv.default
const ajv = new Ajv({ allErrors: true })

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const uploadsFolderPath = path.join(
    isDev() ? __dirname : app.getPath('userData'),
    'uploads'
)

const USER_PREFERENCES_KEY = 'user.preferences'
const COLLECTION_STORE_KEY = 'collections'
const GAME_STORE_KEY = 'games'

const storeSchema = {
    type: 'object',
    properties: {
        collections: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    id: { type: 'string' },
                    name: { type: 'string' },
                    gameIds: {
                        type: 'array',
                        items: { type: 'string' },
                    },
                },
                required: ['id', 'name', 'gameIds'],
                additionalProperties: false,
            },
        },
        games: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    id: { type: 'string' },
                    name: { type: 'string' },
                    exePath: { type: 'string', nullable: true },
                    isInstalled: { type: 'boolean' },
                    createdAt: { type: 'string' },
                    lastPlayed: { type: 'string' },
                    playCount: { type: 'number' },
                    iconPath: { type: 'string', nullable: true },
                    cardIconPath: { type: 'string', nullable: true },
                    collectionIds: {
                        type: 'array',
                        items: { type: 'string' },
                    },
                },
                required: [
                    'id',
                    'name',
                    'isInstalled',
                    'createdAt',
                    'lastPlayed',
                    'playCount',
                    'collectionIds',
                ],
                additionalProperties: false,
            },
        },
        user: {
            type: 'object',
            properties: {
                preferences: {
                    type: 'object',
                    properties: {
                        windowBounds: {
                            type: 'object',
                            properties: {
                                x: { type: 'number' },
                                y: { type: 'number' },
                                width: { type: 'number' },
                                height: { type: 'number' },
                            },
                            required: ['x', 'y', 'width', 'height'],
                            additionalProperties: false,
                        },
                        fullScreen: { type: 'boolean', nullable: true },
                        maximized: { type: 'boolean', nullable: true },
                        loginWithPin: { type: 'boolean', nullable: true },
                        pinCode: { type: 'string', nullable: true },
                        sideMenuCollapsed: { type: 'boolean', nullable: true },
                        theme: {
                            type: 'string',
                            enum: ['light', 'dark', 'system'],
                            nullable: true,
                        },
                        showOnlyInstalledGamesAsDefault: { type: 'boolean', nullable: true },
                        gameViewKind: {
                            type: 'string',
                            enum: ['list', 'icon', 'card'],
                            nullable: true,
                        },
                        openBigpictureMode: { type: 'boolean', nullable: true },
                        startOnWindowsBoot: { type: 'boolean', nullable: true },
                    },
                    additionalProperties: false,
                },
            },
            required: ['preferences'],
            additionalProperties: false,
        },
    },
    required: ['games'],
    additionalProperties: false,
}


const validate = ajv.compile(storeSchema)

const store = new Store()

const userPreferencesStore = new UserPreferencesStore(store, USER_PREFERENCES_KEY)
const collectionStore = new CollectionStore(store, COLLECTION_STORE_KEY)
const gameStore = new GameStore(store, GAME_STORE_KEY)

var mainWindow: BrowserWindow | null = null

function createWindow() {
    const userPrefs = userPreferencesStore.getUserPreferences()
    const windowBounds = userPrefs?.windowBounds
    const isFullScreen = userPrefs?.fullScreen
    const isMaximized = userPrefs?.maximized
    
    mainWindow = new BrowserWindow({
        title: "CNR - Game Launcher",
        x: windowBounds?.x,
        y: windowBounds?.y,
        width: windowBounds?.width,
        height: windowBounds?.height,
        center: !windowBounds ? true : undefined,
        icon: './desktop-icon.png',
        minWidth: 950,
        minHeight: 450,
        fullscreen: isFullScreen,
        fullscreenable: true,
        resizable: true,
        maximizable: true,
        autoHideMenuBar: true,
        frame: false,
        titleBarStyle: process.platform === 'darwin' ? 'default' : undefined,
        transparent: false,
        webPreferences: {
            preload: getPreloadPath(),
            nodeIntegration: false,
            contextIsolation: true,
            webSecurity: true,
            allowRunningInsecureContent: false,
            experimentalFeatures: false,
            sandbox: true
        }
    })

    if (!isDev()) {
        Menu.setApplicationMenu(null)

        mainWindow.webContents.on('devtools-opened', () => {
            mainWindow?.webContents.closeDevTools()
        })
    }

    if (isMaximized) {
        mainWindow.maximize()
    }

    if (isFullScreen) {
        mainWindow.setFullScreen(true)
    }

    if (isDev()) {
        mainWindow.loadURL('http://localhost:5123')
    } else {
        mainWindow.loadFile(getUIPath())
    }

    handleCloseEvents()
}

app.on('ready', () => {
    protocol.handle('app-image', (request) => {
        const filePath = new URL(request.url).pathname
        const absolutePath = path.join(uploadsFolderPath, filePath)
        const fileUrl = pathToFileURL(absolutePath).toString()

        return net.fetch(fileUrl)
    })
    
    createWindow()

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow()
        }
    })

    ipcMainHandle('getUserPrefs', () => userPreferencesStore.getUserPreferences())
    ipcMainOn('toggleFullscreen', () => {
        if (process.platform === 'darwin') {
            mainWindow?.setFullScreen(!mainWindow.isFullScreen())
        } else {
            if (mainWindow?.isSimpleFullScreen()) {
                mainWindow?.setSimpleFullScreen(false)
            } else {
                mainWindow?.setSimpleFullScreen(true)
            }
        }
    })

    mainWindow?.webContents.once('did-finish-load', () => {
        setTimeout(() => {
            mainWindow?.webContents.send('isFullscreen', mainWindow.isFullScreen() ?? false)
        }, 50)
    })

    mainWindow?.on('enter-full-screen', () => {
        mainWindow?.webContents.send('isFullscreen', true)
    })

    mainWindow?.on('leave-full-screen', () => {
        mainWindow?.webContents.send('isFullscreen', false)
    })
    
    ipcMainOn('minimizeScreen', () => mainWindow?.minimize())
    ipcMainOn('maximizeScreen', () => {
        const win = mainWindow

        if (!win) return

        if (win.isMaximized()) {
            win.unmaximize()

            if (process.platform !== 'darwin') {
                win.restore()
            }
        } else {
            win.maximize()
        }
    })
    ipcMainOn('closeApp', () => app.quit())
    ipcMainOn('quitApp', () => app.quit())
    ipcMainOn(
        'setUserPrefs',
        (userPrefs: UserPreferences) => userPreferencesStore.setUserPreferences(userPrefs)
    )
    ipcMainHandle('getCollections', () => collectionStore.getCollections())
    ipcMainHandle(
        'addCollection',
        (payload?: string) => {
            if (payload) {
                return collectionStore.createCollection(payload)
            }
            
            return null
        }
    )
    ipcMainOn('deleteCollection', (id) => collectionStore.delete(id))
    ipcMainHandle('getGames', () => gameStore.getGames())
    ipcMainHandle('addGame', (gameData?: Omit<Game, 'id' | 'createdAt'>) => {
        if (gameData) {
            return gameStore.createGame(gameData)
        }

        return null
    })
    ipcMainHandle('run', async (path: string) => {
        try {
            await shell.openExternal(path)
            return true
        } catch (_) {
            return false
        }
    })
    ipcMainOn(
        'setGamesToCollection',
        (payload: { collectionId: string, gameIds: string[] }) =>
            collectionStore.setGames(payload.collectionId, payload.gameIds)
    )
    ipcMainOn(
        'addGameToCollection',
        (payload: { collectionId: string, gameId: string }) =>
            collectionStore.addGame(payload.collectionId, payload.gameId)
    )
    ipcMainOn(
        'incrementPlayCount',
        (payload: string) => gameStore.incrementPlayCount(payload)
    )
    ipcMainOn(
        'setLastPlayedDate',
        (payload: string) => gameStore.setLastPlayedDate(payload)
    )
    ipcMainOn(
        'deleteGame',
        (payload: string) => gameStore.delete(payload)
    )
    ipcMainOn(
        'removeGamesFromCollection',
        (payload: { collectionId: string, gameIds: string[] }) =>
            collectionStore.removeGamesFromCollection(payload.collectionId, payload.gameIds)
    )
    ipcMainOn(
        'removeAGameFromAllCollections',
        (payload: string) => collectionStore.removeAGameFromAllCollections(payload)
    )
    ipcMainHandle(
        'saveImage',
        async (imageData: string): Promise<ImageUploadResult> => {
            try {
                const base64Data = imageData.replace(/^data:image\/\w+;base64,/, '')
                const buffer = Buffer.from(base64Data, 'base64')
                const fileName = `${Date.now()}.png`
                const uploadsDir = path.join(
                    isDev() ? __dirname : app.getPath('userData'),
                    'uploads'
                )
                const filePath = path.join(uploadsDir, fileName)

                await fs.mkdir(uploadsDir, { recursive: true })
                await fs.writeFile(filePath, buffer)

                console.log('Image saved successfully', filePath)

                const relativePathForProtocol = path.relative(
                    isDev() ? 'uploads' : app.getPath('userData'),
                    filePath
                )
                const normalizedPath = relativePathForProtocol.split(path.sep).join('/')
                const imageUrl = `app-image://${normalizedPath}`

                return { success: true, path: imageUrl }
            } catch (error) {
                console.error('Error saving image:', error)

                return {
                    success: false,
                    error: error instanceof Error ? error.message : 'Unknown error occurred'
                }
            }
        }
    )
    ipcMainHandle(
        'deleteGameIcons',
        async (files: Array<string | undefined>): Promise<{ success: boolean, error?: string }> => {
            try {
                const uploadsDir = path.join(
                    isDev() ? __dirname : app.getPath('userData'),
                    'uploads'
                )

                for (const fileUrl of files) {
                    if (fileUrl) {
                        const url = new URL(fileUrl)
                        const relativePath = url.pathname.replace(/^\//, '')
                        const filePath = path.join(uploadsDir, relativePath)

                        await fs.unlink(filePath)
                    }
                }

                console.log('Images deleted successfully')

                return { success: true }
            } catch (error) {
                console.error('Error saving image:', error)

                return {
                    success: false,
                    error: error instanceof Error ? error.message : 'Unknown error occurred'
                }
            }
        }
    )
    ipcMainOn(
        'setCollections',
        (payload: { id: string, collectionIds: string[] }) =>
            gameStore.setCollections(payload.id, payload.collectionIds)
    )
    ipcMainHandle(
        'getGameById',
        (id: string) => gameStore.getGame(id)
    )
    ipcMainOn(
        'updateGame',
        (game: Game) => gameStore.updateGame(game)
    )
    ipcMainHandle(
        'backup',
        () => exportStoreData()
    )
    ipcMainHandle(
        'restoreBackup',
        () => importStoreData()
    )
    ipcMainOn(
        'setWindowsBootStartOption',
        (startOnWindowsBoot: boolean) => {
            app.setLoginItemSettings({
                openAtLogin: startOnWindowsBoot
            })
        }
    )
    ipcMainOn(
        'setFullscreen',
        (isFullscreen: boolean) => {
            if (mainWindow) {
                if (process.platform === 'darwin') {
                    mainWindow.setFullScreen(isFullscreen)
                } else {
                    mainWindow.setSimpleFullScreen(isFullscreen)
                }
            }
        }
    )
})

function saveUserPreferences() {
    const bounds = mainWindow?.getBounds()
    const isFullScreen = process.platform === 'darwin' ?
        mainWindow?.isFullScreen() :
            mainWindow?.isSimpleFullScreen()
    const isMaximized = mainWindow?.isMaximized()

    if (bounds) {
        userPreferencesStore.setUserPreferences({
            windowBounds: (isMaximized || isFullScreen) ? undefined : bounds,
            fullScreen: isFullScreen,
            maximized: (process.platform === 'darwin' && isFullScreen) ? true : isMaximized
        })
    }
}

function handleCloseEvents() {
    mainWindow?.on('closed', () => {
        mainWindow = null
    })

    app.on('before-quit', () => {
        saveUserPreferences()
    })

    app.on('window-all-closed', () => {
        app.quit()
    })
}

function restartApp() {
    app.relaunch({ args: process.argv.slice(1) })
    app.quit()
}

async function exportStoreData(): Promise<BackupProcessResult | never> {
    const BACKUP_DIR_NAME = 'cnr-game-launcher-backup'
    const CONFIG_FILE_NAME = 'config.json'
    const UPLOADS_FOLDER_NAME = 'uploads'

    try {
        const result = await dialog.showOpenDialog({
            title: 'Select Export Destination Folder',
            properties: ['openDirectory', 'createDirectory']
        })

        if (result.canceled || !result.filePaths.length) {
            return 'canceled'
        }

        const selectedDirPath = result.filePaths[0]
        const targetBackupDirPath = path.join(selectedDirPath, BACKUP_DIR_NAME)

        await fs.mkdir(targetBackupDirPath, { recursive: true })

        const configFilePath = path.join(targetBackupDirPath, CONFIG_FILE_NAME)

        const allData = store.store

        await fs.writeFile(
            configFilePath,
            JSON.stringify(allData, null, 4),
            'utf-8'
        )

        const targetUploadsDirPath = path.join(targetBackupDirPath, UPLOADS_FOLDER_NAME)

        if (fsExtra.existsSync(uploadsFolderPath) === false) {
            fsExtra.mkdirSync(uploadsFolderPath)
        }

        await fsExtra.copy(uploadsFolderPath, targetUploadsDirPath, { overwrite: true })

        return 'completed'
    } catch (error) {
        console.error('App data exporting error: ', error)
        throw new Error('App data exporting error')
    }
}

async function importStoreData(): Promise<BackupRestoreProcessResult | void | never> {
    const UPLOADS_FOLDER_NAME = 'uploads'

    const currentUploadsDirPath = uploadsFolderPath

    try {
        const result = await dialog.showOpenDialog({
            title: 'Select Backup Folder to Import',
            properties: ['openDirectory'],
        })

        if (result.canceled || result.filePaths.length === 0) {
            return 'canceled'
        }

        const backupDirPath = result.filePaths[0]

        const files = await fs.readdir(backupDirPath)
        const configFileName = files.find(file => path.extname(file).toLowerCase() === '.json')

        if (!configFileName) {
            console.error('No JSON file found in the selected backup folder.')
            return 'incorrect file'
        }

        const configFilePath = path.join(backupDirPath, configFileName)
        const fileContent = await fs.readFile(configFilePath, 'utf-8')

        let importedData

        try {
            importedData = JSON.parse(fileContent)
        } catch (error) {
            console.error(`JSON syntax error in found config file (${configFileName}): `, error)

            return 'incorrect file'
        }

        const isValid = validate(importedData)

        if (isValid) {
            store.clear()
            store.set(importedData)
            console.log(`App Data imported successfully from: ${configFileName}`)
        } else {
            console.error('Imported App Data schema validation failed', validate.errors)

            return 'incorrect file'
        }

        const backupUploadsPath = path.join(backupDirPath, UPLOADS_FOLDER_NAME)

        if (fsExtra.existsSync(backupUploadsPath) === false) {
            fsExtra.mkdirSync(uploadsFolderPath)
        }

        try {
            const stats = await fs.stat(backupUploadsPath)

            if (stats.isDirectory()) {
                if (await fs.stat(currentUploadsDirPath)) {
                    await fs.rm(currentUploadsDirPath, { recursive: true, force: true })
                }

                await fs.mkdir(currentUploadsDirPath, { recursive: true })
                await fsExtra.copy(backupUploadsPath, currentUploadsDirPath, { overwrite: true })

                console.log('Uploads folder restored successfully.')
            }
        } catch (error) {
            console.warn(
                `Warning: Backup uploads folder (${UPLOADS_FOLDER_NAME}) ` +
                `not found or accessible. Skipping media restore.`
            )
        }

        return restartApp()
    } catch (error) {
        console.error('App Data Importing Process Failed')
        throw new Error('App Data Importing Process Failed')
    }
}