import Store from 'electron-store'

export class UserPreferencesStore {
    private readonly store: Store<any>
    private readonly key: string

    constructor(store: Store<any>, key: string) {
        this.store = store
        this.key = key
    }

    public getUserPreferences(): UserPreferences | null {
        return this.store.get(this.key) as UserPreferences | null
    }

    public setUserPreferences(userPrefs: UserPreferences): void {
        this.store.set(this.key, {
            ...(this.getUserPreferences() || {}),
            ...userPrefs
        })
    }
}