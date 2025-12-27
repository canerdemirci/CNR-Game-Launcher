import clsx from "clsx"
import { MdDelete } from "react-icons/md"

interface Props {
    collection: GameCollection
    selectedCollection?: GameCollection
    onClick: (collection: GameCollection) => void
    onDelete: (collection: GameCollection) => void
}

export default function CollectionButton({
    collection,
    selectedCollection,
    onClick,
    onDelete
}: Props) {
    return (
        <div
            className={clsx([
                "group", "font-[ScienceGothic] text-sm",
                "flex", "justify-between", "items-center", "shadow-md",
                "p-4", "mx-2 my-6 first:mt-0", "cursor-pointer", "border",
                "rounded-lg", "transition-transform duration-500 ease-in",
                "first-letter:capitalize",
                "hover:scale-105 hover:-translate-y-1",
                selectedCollection?.id === collection.id
                    ? [
                        "bg-purple-500", "border-purple-300", "text-white",
                        "hover:bg-linear-to-r hover:from-purple-500 hover:to-purple-700",
                        "dark:bg-linear-to-bl dark:from-orange-400 dark:to-orange-600",
                        "dark:border-x-0 dark:border-y-white/25",
                        "dark:text-white",
                        "dark:hover:bg-linear-to-bl dark:hover:from-orange-400", 
                        "dark:hover:to-orange-800 dark:hover:text-white",
                        "dark:hover:border-x-0 dark:hover:border-y-orange-500/85"
                    ]
                    : [
                        "bg-white/25", "border-purple-300",
                        "hover:bg-linear-to-r hover:from-pink-200 hover:to-pink-50",
                        "dark:bg-linear-to-br dark:from-white dark:to-white/50",
                        "dark:border-x-white/15 dark:border-y-white/75",
                        "dark:text-gray-800",
                        "dark:hover:bg-linear-to-bl dark:hover:from-gray-400", 
                        "dark:hover:to-gray-600 dark:hover:text-white",
                        "dark:hover:border-x-0 dark:hover:border-y-gray-300/85"
                    ],
            ])}
            onClick={() => onClick(collection)}
        >
            <span className="first-letter:uppercase">{collection.name}</span>
            <div
                className={clsx([
                    "rounded-full p-1",
                    "cursor-pointer invisible group-hover:visible",
                    "hover:bg-white",
                    "dark:hover:bg-white"
                ])}
                onClick={(e) => {
                    e.stopPropagation()
                    onDelete(collection)
                }}
            >
                <MdDelete
                    size={18}
                    className={clsx([
                        selectedCollection?.id === collection.id
                            ? [
                                "text-purple-300 dark:text-gray-100 hover:text-purple-700",
                                "dark:hover:text-orange-500"
                            ]
                            : [
                                "text-purple-500 dark:text-white", 
                                "dark:hover:text-gray-500"
                            ]
                    ])}
                />
            </div>
        </div>
    )
}