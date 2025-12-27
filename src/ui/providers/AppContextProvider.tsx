import React, { createContext, FC, useContext, useEffect, useState } from "react"
import { AppHeaderProps } from "../components/AppHeader"

export type AppContextType = {
    userPreferences: UserPreferences | null
    isUserPrefsFetching: boolean
    theme: 'light' | 'dark' | 'system'
    isFullscreen: boolean
    showOnlyInstalledGamesAsDefault: boolean
    gameViewKind: 'list' | 'icon' | 'card'
    openBigPictureMode: boolean
    startOnWindowsBoot: boolean
    sideMenuCollapsed: boolean
    loginWithPin: boolean
    appHeaderProps?: AppHeaderProps
    setIsUserPrefsFetching: React.Dispatch<React.SetStateAction<boolean>>
    setIsFullscreen: React.Dispatch<React.SetStateAction<boolean>>
    setAppHeaderProps: React.Dispatch<React.SetStateAction<AppHeaderProps | undefined>>
    setSideMenuCollapsed: React.Dispatch<React.SetStateAction<boolean>>
    setGameViewKind: React.Dispatch<React.SetStateAction<"list" | "icon" | "card">>
    setShowOnlyInstalledGamesAsDefault: React.Dispatch<React.SetStateAction<boolean>>
    setOpenBigPictureMode: React.Dispatch<React.SetStateAction<boolean>>
    setStartOnWindowsBoot: React.Dispatch<React.SetStateAction<boolean>>
    setLoginWithPin: React.Dispatch<React.SetStateAction<boolean>>
    setTheme: React.Dispatch<React.SetStateAction<"light" | "dark" | "system">>
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export const AppContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [userPreferences, setUserPreferences] = useState<UserPreferences | null>(null)
    const [isUserPrefsFetching, setIsUserPrefsFetching] = useState<boolean>(true)
    const [isFullscreen, setIsFullscreen] = useState<boolean>(false)
    const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system')
    const [appHeaderProps, setAppHeaderProps] = useState<AppHeaderProps | undefined>(undefined)
    const [sideMenuCollapsed, setSideMenuCollapsed] = useState<boolean>(false)
    const [openBigPictureMode, setOpenBigPictureMode] = useState<boolean>(false)
    const [startOnWindowsBoot, setStartOnWindowsBoot] = useState<boolean>(false)
    const [loginWithPin, setLoginWithPin] = useState<boolean>(false)
    const [gameViewKind, setGameViewKind] = useState<'list' | 'icon' | 'card'>('card')
    const [showOnlyInstalledGamesAsDefault, setShowOnlyInstalledGamesAsDefault] = 
        useState<boolean>(false)

    useEffect(() => {
        const unsubscribe = window.electron.app.isFullscreen((isFull) => {
            setIsFullscreen(isFull)
        })

        setIsUserPrefsFetching(true)

        window.electron.userPreferences.get()
            .then(userPrefs => {
                if (userPrefs) {
                    setIsFullscreen(userPrefs.fullScreen || false)
                    setTheme(userPrefs.theme || 'system')
                    setSideMenuCollapsed(userPrefs.sideMenuCollapsed || false)
                    setOpenBigPictureMode(userPrefs.openBigpictureMode || false)
                    setStartOnWindowsBoot(userPrefs.startOnWindowsBoot || false)
                    setGameViewKind(userPrefs.gameViewKind || 'card')
                    setShowOnlyInstalledGamesAsDefault(
                        userPrefs.showOnlyInstalledGamesAsDefault || false
                    )
                    setLoginWithPin(userPrefs.loginWithPin || false)
                    setUserPreferences(userPrefs)
                }
            })
            .finally(() => setIsUserPrefsFetching(false))

        return () => {
            unsubscribe()
        }
    }, [])

    return (
        <AppContext.Provider
            value={{
                userPreferences,
                isUserPrefsFetching,
                theme,
                isFullscreen,
                sideMenuCollapsed,
                gameViewKind,
                appHeaderProps,
                showOnlyInstalledGamesAsDefault,
                openBigPictureMode,
                startOnWindowsBoot,
                loginWithPin,
                setIsUserPrefsFetching,
                setIsFullscreen,
                setTheme,
                setSideMenuCollapsed,
                setGameViewKind,
                setAppHeaderProps,
                setShowOnlyInstalledGamesAsDefault,
                setOpenBigPictureMode,
                setStartOnWindowsBoot,
                setLoginWithPin
            }}
        >
            {children}
        </AppContext.Provider>
    )
}

export const useAppContext = (): AppContextType => {
    const context = useContext(AppContext)

    if (!context) {
        throw new Error("useAppContext must be used within an AppContextProvider")
    }

    return context
}