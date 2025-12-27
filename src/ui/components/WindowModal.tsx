import clsx from "clsx"
import Modal from "./Modal"
import { useEffect, useState } from "react"
import { MdClose } from "react-icons/md"
import { useWindowModal } from "../providers/WindowModalProvider"
import { useModalAnimation } from "../hooks/useModalAnimation"
import { motion } from "motion/react"

export default function WindowModal() {
    const { show, title, children, onClose } = useWindowModal()
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
                    "dark:bg-linear-to-tl dark:from-gray-700 dark:to-gray-900",
                    "dark:border-gray-700"
                ])}
            >
                <div
                    className={clsx([
                        "p-4", "bg-gray-200", "border-b border-b-gray-400",
                        "rounded-t-lg", "flex", "items-center", "justify-between",
                        "dark:bg-gray-900 dark:text-white dark:border-b-gray-700"
                    ])}
                >
                    <span className="text-xl font-bold">{title}</span>
                    <MdClose
                        size={28}
                        className="text-red-500 font-bold hover:text-red-800 cursor-pointer"
                        onClick={() => {
                            start('close').finally(() => {
                                setClosed(true)
                                onClose()
                            })
                        }}
                    />
                </div>
                <div
                    className={clsx([
                        "p-4",
                    ])}
                >
                    {children}
                </div>
            </motion.div>
        </Modal>
    )
}