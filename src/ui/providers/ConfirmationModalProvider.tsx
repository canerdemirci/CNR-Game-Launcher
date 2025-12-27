import React, { createContext, useContext, useState, useRef } from "react"

export type ConfirmationModalContextType = {
    show: boolean
    title: string
    message: string
    decision?: 'yes' | 'no'
}

type ConfirmationModalProviderType = ConfirmationModalContextType & {
    showConfirmation: (
        title: string,
        message: string,
        onDecision?: (decision: 'yes' | 'no') => void
    ) => void,
    setDecision: (decision: 'yes' | 'no') => void
}

export const ConfirmationModalContext = createContext<ConfirmationModalProviderType>({
    show: false,
    title: "",
    message: "",
    showConfirmation: () => {},
    setDecision: () => {}
})

export const ConfirmationModalProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
    const [modalState, setModalState] = useState<Omit<ConfirmationModalContextType, 'onClose'>>({
        show: false,
        title: "",
        message: "",
    })
    
    const decisionCallback = useRef<(decision: 'yes' | 'no') => void>(undefined)

    const showConfirmation = (
        title: string,
        message: string,
        onDecision?: (decision: 'yes' | 'no') => void
    ) => {
        setModalState({
            show: true,
            title,
            message,
        })
        decisionCallback.current = onDecision
    }

    const setDecision = (decision: 'yes' | 'no') => {
        setModalState(prevState => ({
            ...prevState,
            show: false,
            decision
        }))
        if (decisionCallback.current) {
            decisionCallback.current(decision)
            decisionCallback.current = undefined
        }
    }

    const contextValue: ConfirmationModalProviderType = {
        ...modalState,
        showConfirmation,
        setDecision
    }

    return (
        <ConfirmationModalContext.Provider value={contextValue}>
            {children}
        </ConfirmationModalContext.Provider>
    )
}

export const useConfirmationModal = () => {
    const context = useContext(ConfirmationModalContext)

    if (!context) {
        throw new Error('useConfirmationModal must be used within a ConfirmationModalProvider')
    }
    
    return context
}