import React, { createContext, useContext, useRef, useState } from "react"

export type WindowModalContextType = {
    show: boolean
    title: string
    children: React.ReactNode
    onClose: () => void
}

type WindowModalProviderType = WindowModalContextType & {
    showWindow: (
        title: string,
        children: React.ReactNode,
        callback?: (data?: any) => void
    ) => void
    hideWindow: (data?: any) => void
}

export const WindowModalContext = createContext<WindowModalProviderType>({
    show: false,
    title: "",
    children: <></>,
    onClose: () => {},
    showWindow: () => {},
    hideWindow: () => {}
})

export const WindowModalProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
    const [modalState, setModalState] = useState<Omit<WindowModalContextType, 'onClose'>>({
        show: false,
        title: "",
        children: <></>,
    })

    const dataCallback = useRef<(data?: any) => void>(undefined)

    const hideWindow = (data?: any) => {
        if (dataCallback.current) {
            dataCallback.current(data)
        }

        setModalState(prev => ({
            ...prev,
            show: false
        }))
    }

    const showWindow = (
        title: string,
        children: React.ReactNode,
        callback?: (data?: any) => void
    ) => {
        dataCallback.current = callback
        setModalState({
            show: true,
            title,
            children
        })
    }

    const contextValue: WindowModalProviderType = {
        ...modalState,
        onClose: hideWindow,
        showWindow,
        hideWindow
    }

    return (
        <WindowModalContext.Provider value={contextValue}>
            {children}
        </WindowModalContext.Provider>
    )
}

export const useWindowModal = () => {
    const context = useContext(WindowModalContext)

    if (!context) {
        throw new Error('useWindowModal must be used within a WindowModalProvider')
    }
    
    return context
}