import { AppContextType } from "./providers/AppContextProvider"
import { base64FromFile } from "./utils"

/**
 * Set last played date and play count in game store
 */
export function updateGameStoreAfterGameRun(game: Game) {
    window.electron.games.incrementPlayCount(game.id)
    window.electron.games.setLastPlayedDate(game.id)
}

/**
 * Delete a game from the store and remove it from all collections
 */
export function deleteGameFromStore(game: Game) {
    deleteGameIcons(game)
    window.electron.games.deleteGame(game.id)
    window.electron.gameCollections.removeAGameFromAllCollections(game.id)
}

/**
 * Remove a game from a collection
 */
export function removeGameFromCollection(collection: GameCollection, game: Game) {
    window.electron.gameCollections.setGames(
        collection.id,
        collection.gameIds.filter(g => g !== game.id)
    )
    window.electron.games.setCollections(
        game.id,
        game.collectionIds.filter(cid => cid !== collection.id)
    )
}

/**
 * Remove a collection from all games' collection list
 */
export async function removeCollectionFromAllGames(collection: GameCollection) {
    const existingGames = await window.electron.games.get()

    if (existingGames.length > 0) {
        existingGames.forEach(g => {
            window.electron.games.setCollections(
                g.id,
                [...g.collectionIds.filter(cid => cid !== collection.id)]
            )
        })
    }
}

/**
 * Update a game's data and its collections in store
 */
export function updateGame(game: Game, selectedCollections: GameCollection[]) {
    window.electron.games.update(game)
    window.electron.gameCollections.removeAGameFromAllCollections(game!.id)
    selectedCollections.forEach(sc => {
        window.electron.gameCollections.addGame(sc.id, game!.id)
    })
}

/**
 * Add a new game to the store and its collections
 */
export function addGame(
    gameData: Omit<Game, 'id' | 'createdAt'>,
    selectedCollections: GameCollection[],
    callback?: () => void) 
{
    window.electron.games.add(gameData)
        .then(game => {
            if (game) {
                selectedCollections.forEach(sc => {
                    window.electron.gameCollections.addGame(sc.id, game.id)
                })
            }
        })
        .finally(callback)
}

/**
 * Delete a collection from the store and remove it from all games
 */
export function deleteCollection(collection: GameCollection) {
    window.electron.gameCollections.delete(collection.id)
    removeCollectionFromAllGames(collection)
}

/**
 * Delete game icons from the filesystem
 */
export function deleteGameIcons(game: Game) {
    return window.electron.games.deleteGameIcons([game.iconPath, game.cardIconPath])
}

/**
 * Run a game by its executable path
 */
export async function runGame(game: Game): Promise<boolean> {
    if (!game.exePath?.trim()) return false

    return await window.electron.games.run(game.exePath)
}

/**
 * Save game icons and return their paths
 */
export function saveGameIcons(
    iconFile?: File | null,
    cardIconFile?: File | null
): Promise<[string | undefined, string | undefined]>
{
    return Promise.all([
        iconFile ? base64FromFile(iconFile)
            .then(base64str => window.electron.saveImage(base64str))
            .then(result => result.success ? result.path : undefined)
            : Promise.resolve(undefined),
        cardIconFile ? base64FromFile(cardIconFile)
            .then(base64str => window.electron.saveImage(base64str))
            .then(result => result.success ? result.path : undefined)
            : Promise.resolve(undefined)
    ])
}

export function saveUserPreferencesOnExit(
    sideMenuCollapsed: boolean,
    gameViewKind: "list" | "icon" | "card",
    theme: 'light' | 'dark' | 'system'
) {
    window.electron.userPreferences.set({
        sideMenuCollapsed,
        gameViewKind,
        theme
    })
}

export function setWindowsBootStartOption(startOnWindowsBoot: boolean) {
    window.electron.app.setWindowsBootStartOption(startOnWindowsBoot)
}