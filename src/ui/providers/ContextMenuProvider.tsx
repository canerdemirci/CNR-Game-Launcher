import React, { createContext, useContext, useState } from "react"

export type MenuItem = {
    id: string
    label: string
    disabled?: boolean
    onClick: () => void
}

export type ContextMenuContextType = {
    show: boolean
    position: { x: number, y: number }
    menuItems: MenuItem[]
}

type ContextMenuProviderType = ContextMenuContextType & {
    showContextMenu: (
        position: { x: number, y: number },
        menuItems: MenuItem[]
    ) => void
    hideContextMenu: () => void,
}

export const ContextMenuContext = createContext<ContextMenuProviderType>({
    show: false,
    position: { x: 0, y: 0 },
    menuItems: [],
    showContextMenu: () => {},
    hideContextMenu: () => {},
})

export const ContextMenuProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
    const [menuState, setMenuState] = useState<ContextMenuContextType>({
        show: false,
        position: { x: 0, y: 0 },
        menuItems: []
    })

    const hideContextMenu = () => {
        setMenuState(prev => ({
            ...prev,
            show: false
        }))
    }

    const showContextMenu = (
        position: { x: number, y: number },
        menuItems: MenuItem[]
    ) => {
        setMenuState(prev => ({
            ...prev,
            show: true,
            position: position,
            menuItems: menuItems
        }))
    }

    const contextValue: ContextMenuProviderType = {
        ...menuState,
        showContextMenu,
        hideContextMenu,
    }

    return (
        <ContextMenuContext.Provider value={contextValue}>
            {children}
        </ContextMenuContext.Provider>
    )
}

export const useContextMenu = () => {
    const context = useContext(ContextMenuContext)

    if (!context) {
        throw new Error('useContextMenu must be used within a ContextMenuProvider')
    }
    
    return context
}