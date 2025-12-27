import clsx from "clsx"
import Modal from "./Modal"
import { useEffect, useState } from "react"
import { useConfirmationModal } from "../providers/ConfirmationModalProvider"
import { motion } from "motion/react"
import { useModalAnimation } from "../hooks/useModalAnimation"

const buttonStyle = [
    "w-20", "block", "py-2", "px-4", "border", "bg-gray-200", "font-bold",
    "border-gray-300", "rounded-md", "cursor-pointer", "text-gray-700",
    "hover:bg-gray-300", "hover:border-gray-500", "hover:text-gray-800",
    "dark:bg-gray-950 dark:border-gray-700 dark:text-white"
]

export default function ConfirmationModal() {
    const { show, title, message, setDecision } = useConfirmationModal()
    const { animController, start } = useModalAnimation()
    
    const [closed, setClosed] = useState<boolean>(false)

    useEffect(() => {
        if (show) setClosed(false)
        setTimeout(() => start('open'), 10)
    }, [show])

    if (closed || !show) return null
    
    return (
        <Modal>
            <motion.div
                animate={animController}
                className={clsx([
                    "w-[50%]", "bg-gray-100", "border", "border-gray-400", "rounded-lg",
                    "dark:bg-gray-800 dark:border-gray-900"
                ])}
            >
                <div
                    className={clsx([
                        "p-4", "bg-gray-200", "border-b border-b-gray-400", "text-xl",
                        "font-bold", "rounded-t-lg",
                        "dark:bg-gray-900 dark:border-b-gray-900 dark:text-gray-200"
                    ])}
                >
                    {title}
                </div>
                <div
                    className={clsx([
                        "p-4", "text-lg",
                        "dark:text-gray-100"
                    ])}
                >
                    {message}
                </div>
                <div className="flex justify-center items-center gap-4 m-4">
                    <button
                        className={clsx(buttonStyle)}
                        onClick={() => {
                            setClosed(true)
                            setDecision('yes')
                        }}
                    >
                        YES
                    </button>
                    <button
                        className={clsx(buttonStyle)}
                        onClick={() => {
                            start('close').finally(() => {
                                setClosed(true)
                                setDecision('no')
                            })
                        }}
                    >
                        NO
                    </button>
                </div>
            </motion.div>
        </Modal>
    )
}