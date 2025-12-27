import React, { createContext, useContext, useState } from "react"

export type MessageModalContextType = {
    show: boolean
    title: string
    message: string
    messageType: 'info' | 'warning'
    onClose: () => void
    closeButton?: boolean
}

type MessageModalProviderType = MessageModalContextType & {
    showMessage: (
        title: string,
        message: string,
        messageType?: 'info' | 'warning',
        closeButton?: boolean
    ) => void
    hideMessage: () => void
}

export const MessageModalContext = createContext<MessageModalProviderType>({
    show: false,
    title: "",
    message: "",
    messageType: "info",
    closeButton: true,
    onClose: () => {},
    showMessage: () => {},
    hideMessage: () => {}
})

export const MessageModalProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
    const [modalState, setModalState] = useState<Omit<MessageModalContextType, 'onClose'>>({
        show: false,
        title: "",
        message: "",
        messageType: "info",
        closeButton: true
    })

    const hideMessage = () => {
        setModalState(prev => ({
            ...prev,
            show: false
        }))
    }

    const showMessage = (
        title: string,
        message: string,
        messageType: 'info' | 'warning' = 'info',
        closeButton: boolean = true
    ) => {
        setModalState({
            show: true,
            title,
            message,
            messageType,
            closeButton
        })
    }

    const contextValue: MessageModalProviderType = {
        ...modalState,
        onClose: hideMessage,
        showMessage,
        hideMessage
    }

    return (
        <MessageModalContext.Provider value={contextValue}>
            {children}
        </MessageModalContext.Provider>
    )
}

export const useMessageModal = () => {
    const context = useContext(MessageModalContext)

    if (!context) {
        throw new Error('useMessageModal must be used within a MessageModalProvider')
    }
    
    return context
}