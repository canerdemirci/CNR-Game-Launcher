import { Route, HashRouter as Router, Routes, useLocation, useNavigate } from 'react-router-dom'
import './App.css'
import Home from './pages/Home'
import Settings from './pages/Settings'
import Login from './pages/Login'
import AddGame from './pages/AddGame'
import EditGame from './pages/EditGame'
import BigPicture from './pages/BigPicture'
import MessageModal from './components/MessageModal'
import { MessageModalProvider } from './providers/MessageModalProvider'
import { ConfirmationModalProvider } from './providers/ConfirmationModalProvider'
import ConfirmationModal from './components/ConfirmationModal'
import { WindowModalProvider } from './providers/WindowModalProvider'
import WindowModal from './components/WindowModal'
import { ContextMenuProvider } from './providers/ContextMenuProvider'
import ContextMenu from './components/ContextMenu'
import { AnimatePresence, motion, Transition } from 'motion/react'
import { VscChromeClose, VscChromeMaximize, VscChromeMinimize } from 'react-icons/vsc'
import clsx from 'clsx'
import { AppContextProvider, useAppContext } from './providers/AppContextProvider'
import { useTheme } from './hooks/useTheme'
import { useEffect, useState } from 'react'
import DesktopIcon from './assets/desktop-icon.png'
import { AppHeader } from './components/AppHeader'
import { saveUserPreferencesOnExit, setWindowsBootStartOption } from './lib'
import { DataProvider } from './providers/DataProvider'

function ContentWrapper() {
    const location = useLocation()

    const slideBlurVariants = {
        initial: {
            x: '-100%',
            opacity: 0.5
        },
        animate: {
            x: 0,
            opacity: [0.5, 1]
        },
    }

    const slideBlurTransition = {
        duration: 0.2,
        exit: {
            duration: 0.01,
        },
    } as Transition

    return (
        <main className="flex-1 w-full h-full overflow-hidden">
            <MessageModal />
            <ConfirmationModal />
            <WindowModal />
            <ContextMenu />
            <AnimatePresence mode='wait'>
                {location.pathname !== '/' ? (<motion.div
                    key={location.pathname}
                    variants={slideBlurVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    transition={slideBlurTransition}
                    style={{ position: 'relative', width: '100%', height: '100%' }}
                >
                    <Routes location={location}>
                        <Route
                            path="/home"
                            element={
                                <Home />
                            }
                        />
                        <Route path="/settings" element={<Settings />} />
                        <Route path="/addgame" element={<AddGame />} />
                        <Route path="/editgame/:id" element={<EditGame />} />
                        <Route
                            path="/bigpicture"
                            element={
                                <BigPicture />
                            }
                        />
                    </Routes>
                </motion.div>)
                    : (<div key={location.pathname} className='relative w-full h-full'>
                        <Routes location={location}>
                            <Route path="/" element={<Login />} />
                        </Routes>
                    </div>)}
            </AnimatePresence>
        </main>
    )
}

function AppTitleBar({
    isFullscreen,
    onAppCloseClick,
    onAppMinimizeClick,
    onAppMaximizeClick,
} : {
    isFullscreen: boolean,
    onAppCloseClick: () => void,
    onAppMinimizeClick: () => void,
    onAppMaximizeClick: () => void
}) {
    if (isFullscreen) return null

    return (
        <div
            className={clsx([
                "draggable h-10 w-full px-4",
                "flex items-center justify-between",
                "bg-linear-to-r from-blue-200/95 to-purple-200/95",
                "dark:from-blue-950/95 dark:via-pink-800/95 dark:to-purple-800/95",
                "dark:border-b dark:border-b-white/10"
            ])}
        >
            <div className='flex items-center gap-3'>
                <img src={DesktopIcon} className='w-6 h-6 rounded-full' />
                <h1 className='font-[ScienceGothic] text-sm text-purple-900 dark:text-white'>
                    CNR - Game Launcher
                </h1>
            </div>
            <div className='flex items-center gap-2 not-draggable'>
                <div
                    className={clsx([
                        'rounded-full flex justify-center items-center w-5 h-5',
                        'bg-yellow-500 border border-black/25 cursor-pointer hover:bg-yellow-600'
                    ])}
                    onClick={onAppMinimizeClick}
                >
                    <VscChromeMinimize
                        size={10}
                        className='text-white'
                    />
                </div>
                <div
                    className={clsx([
                        'rounded-full flex justify-center items-center w-5 h-5',
                        'bg-green-500 border border-black/25 cursor-pointer',
                        'hover:bg-green-600'
                    ])}
                    onClick={onAppMaximizeClick}
                >
                    <VscChromeMaximize
                        size={10}
                        className='text-white'
                    />
                </div>
                <div
                    className={clsx([
                        'rounded-full flex justify-center items-center w-5 h-5',
                        'bg-red-500 border border-black/25 cursor-pointer',
                        'hover:bg-red-600'
                    ])}
                    onClick={onAppCloseClick}
                >
                    <VscChromeClose
                        size={10}
                        className='text-white'
                    />
                </div>
            </div>
        </div>
    )
}

function AppContentWrapper() {
    const appContext = useAppContext()
    const location = useLocation()

    useTheme()

    useEffect(() => {
        const handleKeydown = (event: KeyboardEvent) => {
            if (location.pathname !== '/bigpicture') {
                if (event.key === 'Escape' && appContext.isFullscreen) {
                    event.preventDefault()
                    window.electron.app.toggleFullscreen()
                }

                if ((event.key === 'K' || event.key === 'k') && (event.metaKey || event.ctrlKey)) {
                    event.preventDefault()
                    document.getElementById('search-box')?.focus()
                }
            }
        }

        window.addEventListener('keydown', handleKeydown)

        return () => {
            window.removeEventListener('keydown', handleKeydown)
        }
    }, [appContext.isFullscreen, location.pathname])

    function handleAppCloseClick() {
        saveUserPreferencesOnExit(
            appContext.sideMenuCollapsed,
            appContext.gameViewKind,
            appContext.theme
        )
        setWindowsBootStartOption(appContext.startOnWindowsBoot)
        window.electron.app.close()
    }
    
    function handleAppMinimizeClick() {
        window.electron.app.minimize()
    }

    function handleAppMaximizeClick() {
        window.electron.app.maximize()
    }

    return (
        <div
            className={clsx([
                !appContext.isFullscreen && "rounded-xl",
                "w-full h-full overflow-hidden hide-scrollbar relative",
                "flex flex-col",
                "bg-linear-to-br", "from-gray-100", "to-white",
                "dark:bg-linear-to-br dark:from-gray-800 dark:to-gray-950"
            ])}
        >
            <MessageModalProvider>
                <ConfirmationModalProvider>
                    <WindowModalProvider>
                        <ContextMenuProvider>
                            <AppTitleBar
                                onAppCloseClick={handleAppCloseClick}
                                onAppMaximizeClick={handleAppMaximizeClick}
                                onAppMinimizeClick={handleAppMinimizeClick}
                                isFullscreen={appContext.isFullscreen}
                            />

                            {appContext.appHeaderProps &&
                                <AppHeader {...appContext.appHeaderProps} />}

                            <ContentWrapper />
                        </ContextMenuProvider>
                    </WindowModalProvider>
                </ConfirmationModalProvider>
            </MessageModalProvider>
        </div>
    )
}

function App() {
    return <DataProvider>
        <AppContextProvider>
            <div
                className={clsx([
                    "w-screen h-screen overflow-hidden relative bg-transparent",
                    "hide-scrollbar select-none"
                ])}
            >
                <Router>
                    <AppContentWrapper />
                </Router>
            </div>
        </AppContextProvider>
    </DataProvider>
}

export default App
