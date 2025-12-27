import clsx from "clsx"
import Modal from "./Modal"
import { useEffect, useState } from "react"
import { MdInfo, MdWarning } from "react-icons/md"
import { useMessageModal } from "../providers/MessageModalProvider"
import { motion } from "motion/react"
import { useModalAnimation } from "../hooks/useModalAnimation"

export default function MessageModal() {
    const { show, title, message, messageType, closeButton, onClose } = useMessageModal()
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
                        "font-bold", "rounded-t-lg", "flex items-center gap-2",
                        "dark:bg-gray-900 dark:border-b-gray-700 dark:text-gray-100"
                    ])}
                >
                    {
                        messageType === 'info'
                            ? <MdInfo size={24} className="text-green-700 inline-block" />
                            : <MdWarning size={24} className="text-red-600 inline-block" />
                    }
                    {title}
                </div>
                <div
                    className={clsx([
                        "p-4", "text-lg whitespace-pre-line wrap-break-word",
                        messageType === 'info' && "text-green-700 dark:text-green-600",
                        messageType === 'warning' && "text-red-600 dark:text-red-500"
                    ])}
                >
                    {message}
                </div>
                {closeButton && <button
                    className={clsx([
                        "block", "mx-auto", "my-4", "py-2", "px-4", "border", "bg-gray-200",
                        "font-bold", "border-gray-300", "rounded-md", "cursor-pointer",
                        "text-gray-700",
                        "hover:bg-gray-300", "hover:border-gray-500", "hover:text-gray-800",
                        "dark:bg-gray-950 dark:border-gray-700 dark:text-white"
                    ])}
                    onClick={() => {
                        start('close').finally(() => {
                            setClosed(true)
                            onClose()
                        })
                    }}
                >
                    CLOSE
                </button>}
            </motion.div>
        </Modal>
    )
}