import { MainLayout } from "./MainLayout"
import DesktopIcon from "../assets/desktop-icon.png"
import { motion } from "motion/react"
import clsx from "clsx"

interface Props {
    duration: number
}

export default function SplashScreen({
    duration
}: Props) {
    return (
        <MainLayout>
            <div
                className="flex flex-col justify-center items-center gap-6 w-full h-full"
            >
                <motion.div
                    className="flex justify-center items-center gap-4"
                    initial={{ opacity: 0, width: 0, height: 0 }}
                    animate={{ opacity: 1, width: '15rem', height: '15rem' }}
                    transition={{ duration: duration - 1 }}
                >
                    <img src={DesktopIcon} alt="" className="w-full h-full rounded-full" />
                </motion.div>
                <motion.h1
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: duration - 1.5 }}
                    className={clsx([
                        "text-center text-4xl font-bold text-gray-700 dark:text-gray-100",
                        "font-[ScienceGothic]"
                    ])}
                >
                    CNR  GAME  LAUNCHER
                </motion.h1>
            </div>
        </MainLayout>
    )
}