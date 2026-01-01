const electron = require("electron")

electron.contextBridge.exposeInMainWorld("electron", {
    userPreferences: {
      get: () => ipcInvoke('getUserPrefs'),
      set: (userPrefs: UserPreferences) => ipcSend('setUserPrefs', userPrefs)
    },
    app: {
      quit: () => ipcSend('quitApp'),
      toggleFullscreen: () => ipcSend('toggleFullscreen'),
      setFullscreen: (isFullscreen: boolean) => ipcSend('setFullscreen', isFullscreen),
      isFullscreen: (callback: (isFull: boolean) => void) => ipcOn('isFullscreen', callback),
      minimize: () => ipcSend('minimizeScreen'),
      maximize: () => ipcSend('maximizeScreen'),
      close: () => ipcSend('closeApp'),
      backup: () => ipcInvoke('backup'),
      restoreBackup: () => ipcInvoke('restoreBackup'),
      setWindowsBootStartOption: (startOnWindowsBoot: boolean) => ipcSend(
        'setWindowsBootStartOption',
        startOnWindowsBoot
      )
    },
    gameCollections: {
      get: () => ipcInvoke('getCollections'),
      add: (collectionName: string) => ipcInvoke('addCollection', collectionName),
      delete: (id: string) => ipcSend('deleteCollection', id),
      setGames: (collectionId: string, gameIds: string[]) => ipcSend(
        'setGamesToCollection',
        { collectionId: collectionId, gameIds: gameIds }
      ),
      addGame: (collectionId: string, gameId: string) => ipcSend(
        'addGameToCollection',
        { collectionId: collectionId, gameId: gameId }
      ),
      removeGamesFromCollection: (collectionId: string, gameIds: string[]) => ipcSend(
        'removeGamesFromCollection',
        { collectionId: collectionId, gameIds: gameIds }
      ),
      removeAGameFromAllCollections: (gameId: string) => ipcSend(
        'removeAGameFromAllCollections',
        gameId
      )
    },
    games: {
      get: () => ipcInvoke('getGames'),
      getById: (id: string) => ipcInvoke('getGameById', id),
      add: (gameData: Omit<Game, 'id' | 'createdAt'>) => ipcInvoke('addGame', gameData),
      update: (game: Game) => ipcSend('updateGame', game),
      run: (path: string) => ipcInvoke('run', path),
      incrementPlayCount: (id: string) => ipcSend('incrementPlayCount', id),
      setLastPlayedDate: (id: string) => ipcSend('setLastPlayedDate', id),
      deleteGame: (id: string) => ipcSend('deleteGame', id),
      deleteGameIcons: (iconPaths: Array<string | undefined>) => ipcInvoke(
        'deleteGameIcons',
        iconPaths
      ),
      setCollections: (id: string, collectionIds: string[]) => ipcSend(
        'setCollections',
        { id: id, collectionIds: collectionIds }
      )
    },
    saveImage: (imageData: string) => ipcInvoke('saveImage', imageData),
    selectFile: (options: Electron.OpenDialogOptions) => ipcInvoke('selectFile', options)
} satisfies Window['electron'])

function ipcInvoke<Key extends keyof EventPayloadMapping>(
    key: Key,
    payload?: EventPayloadMapping[Key]
): Promise<EventReturnMapping[Key]> {
    return electron.ipcRenderer.invoke(key, payload)
}

function ipcOn<Key extends keyof EventPayloadMapping>(
  key: Key,
  callback: (payload: EventPayloadMapping[Key]) => void
) {
  const cb = (_: Electron.IpcRendererEvent, payload: any) => callback(payload)
  electron.ipcRenderer.on(key, cb)
  return () => electron.ipcRenderer.off(key, cb)
}

function ipcSend<Key extends keyof EventPayloadMapping>(
  key: Key,
  ...args: EventPayloadMapping[Key] extends void ? [] : [EventPayloadMapping[Key]]
) {
  electron.ipcRenderer.send(key, args[0]);
}