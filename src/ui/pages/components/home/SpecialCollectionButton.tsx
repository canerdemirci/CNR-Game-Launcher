import clsx from "clsx"

interface Props {
    isSelected: boolean
    icon: React.ReactNode
    caption: string
    onClick: () => void
}

export default function SpecialCollectionButton({
    isSelected,
    icon,
    caption,
    onClick
}: Props) {
    return (
        <div
            className={clsx([
                "rounded-lg h-10 mb-4",
            ])}
            onClick={onClick}
        >
            <div
                className={clsx([
                    isSelected
                        ? [
                            "from-white to-sky-300 border-sky-300", 
                            "hover:text-blue-500",
                            "dark:from-sky-500/25 dark:to-sky-500/10",
                            "dark:border-x-sky-500/25 dark:border-y-sky-500/50",
                            "dark:text-white",
                            "dark:hover:from-sky-500/55 dark:hover:to-transparent",
                            "dark:hover:text-white",
                            "dark:hover:border-x-sky-500/35 dark:hover:border-y-sky-500/65",
                        ]
                        : [
                            "bg-linear-to-b from-white to-gray-200",
                            "hover:from-white hover:to-gray-300 hover:text-gray-800",
                            "dark:bg-linear-to-b dark:from-white/25 dark:to-white/10",
                            "dark:border-x-white/15 dark:border-y-white/35 dark:text-white",
                            "dark:hover:from-green-500/40 dark:hover:to-transparent",
                            "dark:hover:text-white",
                            "dark:hover:border-x-green-500/35 dark:hover:border-y-green-500/50",
                        ],
                    "bg-linear-to-b",
                    "px-4 mx-2", "rounded-lg",
                    "flex", "items-center", "gap-3",
                    "cursor-pointer", "font-bold",
                    "border-2", "border-sky-300", "h-full",
                ])}
            >
                {icon}
                <span>{caption}</span>
            </div>
        </div>
    )
}