import Store from 'electron-store'
import { nanoid } from 'nanoid'

export class GameStore {
    private readonly store: Store<any>
    private readonly key: string

    constructor(store: Store<any>, key: string) {
        this.store = store
        this.key = key
    }

    public getGames(): Game[] {
        return this.store.get(this.key) as Game[] || []
    }

    public getGame(id: string): Game {
        return this.getGames().filter(g => g.id === id)[0] || null
    }

    public createGame(gameData: Omit<Game, 'id' | 'createdAt' | 'playCount'>): Game | null {
        if (!gameData.name.trim() || gameData.name.trim().length < 2) return null
        
        const existingGames = this.getGames()
        const game = {
            id: nanoid(),
            createdAt: new Date(Date.now()),
            playCount: 0,
            ...gameData
        }

        this.store.set(this.key, [game, ...existingGames])

        return game
    }

    public updateGame(updatedGame: Game): void {
        this.store.set(
            this.key,
            this.getGames().map(g => {
                if (g.id === updatedGame.id) {
                    return updatedGame
                }

                return g
            })
        )
    }

    public incrementPlayCount(id: string) {
        this.store.set(this.key, this.getGames().map(g => {
            if (g.id === id) {
                return { ...g, playCount: g.playCount + 1 }
            }

            return g
        }))
    }

    public setLastPlayedDate(id: string) {
        this.store.set(this.key, this.getGames().map(g => {
            if (g.id === id) {
                return { ...g, lastPlayed: new Date(Date.now()) }
            }

            return g
        }))
    }

    public delete(id: string) {
        this.store.set(
            this.key,
            this.getGames().filter(g => g.id !== id)
        )
    }

    public setCollections(id: string, collectionIds: string[]) {
        this.store.set(
            this.key,
            this.getGames().map(g => {
                if (g.id === id) {
                    return { ...g, collectionIds: collectionIds }
                }

                return g
            })
        )
    }
}