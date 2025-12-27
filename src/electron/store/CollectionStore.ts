import Store from 'electron-store'
import { nanoid } from 'nanoid'

export class CollectionStore {
    private readonly store: Store<any>
    private readonly key: string

    constructor(store: Store<any>, key: string) {
        this.store = store
        this.key = key
    }

    public getCollections(): GameCollection[] {
        return this.store.get(this.key) as GameCollection[] || []
    }

    public createCollection(name: string): GameCollection | null {
        if (!name.trim() || name.trim().length < 2) return null
        
        const collection = { id: nanoid(), name: name, gameIds: [] } as GameCollection
        const existingCollections = this.getCollections()

        if (existingCollections
            .some(c => c.name.toLocaleLowerCase() === name.toLocaleLowerCase())
        ) {
            return null
        }

        this.store.set(this.key, [collection, ...existingCollections])

        return collection
    }

    public addGame(collectionId: string, gameId: string) {
        const existingCollections = this.getCollections()
        const collection = existingCollections.filter(excols => excols.id === collectionId)[0]
        const newCollection = { ...collection, gameIds: [...collection.gameIds, gameId]}
        const updatedCollections = existingCollections
            .filter(excols => excols.id !== collection.id)

        updatedCollections.push(newCollection)

        this.store.set(this.key, updatedCollections)
    }

    public setGames(collectionId: string, gameIds: string[]): void {
        this.store.set(
            this.key,
            this.getCollections().map(coll => {
                if (coll.id === collectionId) {
                    return {
                        ...coll,
                        gameIds: gameIds
                    }
                }

                return coll
            })
        )
    }

    public removeGamesFromCollection(collectionId: string, gameIds: string[]): void {
        const existingCollections = this.getCollections()
        const collection = existingCollections.filter(excols => excols.id === collectionId)[0]
        const newCollection = { 
            ...collection, 
            gameIds: collection.gameIds.filter(id => !gameIds.includes(id)) 
        }
        const updatedCollections = existingCollections
            .filter(excols => excols.id !== collection.id)
        
        updatedCollections.push(newCollection)

        this.store.set(this.key, updatedCollections)
    }

    public removeAGameFromAllCollections(gameId: string): void {
        const existingCollections = this.getCollections()
        const updatedCollections = existingCollections.map(collection => {
            return {
                ...collection,
                gameIds: collection.gameIds.filter(id => id !== gameId)
            }
        })

        this.store.set(this.key, updatedCollections)
    }

    delete(id: string) {
        this.store.set(
            this.key,
            this.getCollections().filter(c => c.id !== id)
        )
    }
}