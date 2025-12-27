import clsx from "clsx"
import { useEffect, useState } from "react"
import PinBox from "../components/PinBox"
import StickLoading from "../components/StickLoading"
import { MainLayout } from "../components/MainLayout"
import { useNavigate } from "react-router-dom"
import SplashScreen from "../components/SplashScreen"
import { useAppContext } from "../providers/AppContextProvider"

const SPLASH_TIME = 2500

export default function Login() {
    const navigate = useNavigate()
    const appContext = useAppContext()
    
    const [renderContent, setRenderContent] = useState<'loading' | 'splash' | 'pin'>('loading')
    
    useEffect(() => {
        if (!appContext.isUserPrefsFetching) {
            if (
                appContext.userPreferences?.loginWithPin &&
                appContext.userPreferences?.pinCode
            ) {
                setRenderContent('splash')
                setTimeout(() => setRenderContent('pin'), SPLASH_TIME)
            } else {
                if (appContext.openBigPictureMode) {
                    navigate('/bigpicture')
                } else {
                    setRenderContent('splash')
                    setTimeout(() => navigate('/home'), SPLASH_TIME)
                }
            }
        }
    }, [appContext.isUserPrefsFetching])

    function handleLogin() {
        if (appContext.openBigPictureMode) {
            navigate('/bigpicture')
        } else {
            navigate('/home')
        }
    }

    switch (renderContent) {
        case 'loading':
            return (
                <MainLayout>
                    <div className={clsx([
                        "w-full h-full flex", "justify-center", "items-center"
                    ])}>
                        <StickLoading />
                    </div>
                </MainLayout>
            )
        case 'splash':
            return <SplashScreen duration={SPLASH_TIME / 1000} />
        case 'pin':
            return (
                <MainLayout>
                    <div className={clsx([
                        "h-full", "flex", "flex-col", "justify-center", "items-center", "gap-4"
                    ])}>
                        <PinBox onLogin={handleLogin} />
                        <h1 className='text-2xl dark:text-gray-300 font-bold'>PIN TO LOGIN</h1>
                    </div>
                </MainLayout>
            )
    }
}