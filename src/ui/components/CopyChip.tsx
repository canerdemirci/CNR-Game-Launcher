import clsx from "clsx"
import { useState } from "react"
import { MdCheck, MdContentCopy } from "react-icons/md"

interface Props {
    title: string
    text: string
}

export default function CopyChip({ title, text }: Props) {
    const [copied, setCopied] = useState<boolean>(false)

    const iconClasses = clsx([
        "bg-gray-200", "cursor-pointer", "text-gray-700", "px-3 py-1.5", "rounded-r-lg",
        "hover:bg-gray-500", "hover:text-white",
        "dark:text-gray-100", "dark:bg-gray-500",
        "dark:hover:bg-gray-300", "dark:hover:text-black"
    ])
    
    function handleCopyClick() {
        setCopied(false)
        navigator.clipboard.writeText(text)
            .finally(() => {
                setCopied(true)
                setTimeout(() => setCopied(false), 500)
            })
    }
    
    return (
        <div
            className={clsx([
                "flex", "items-center", "justify-between", "gap-2", "bg-white", "rounded-lg", 
                "border", "border-gray-300",
                "dark:bg-gray-900", "dark:border-gray-600"
            ])}
        >
            <span className={clsx([
                "px-3 py-1 text-sm text-gray-700 bg-gray-100 rounded-l-lg",
                "dark:text-gray-100 dark:bg-gray-800"
            ])}>{title}</span>
            <span className="px-3 py-1 text-sm text-gray-700 dark:text-gray-100">{text}</span>
            {!copied &&
                <div
                    className={iconClasses}
                    onClick={handleCopyClick}
                >
                    <MdContentCopy size={16} />
                </div>
            }
            {copied &&
                <div
                    className={iconClasses}
                    onClick={handleCopyClick}
                >
                    <MdCheck size={16} />
                </div>
            }
        </div>
    )
}