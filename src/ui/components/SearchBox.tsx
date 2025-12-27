import clsx from "clsx"
import { useState } from "react"
import { MdClose, MdKeyboardCommandKey, MdSearch } from "react-icons/md"

interface Props {
    styleVariant: StyleVariant
    onChange?: (query: string) => void
}

type StyleVariant = {
    className: string
    inputClassName: string
    searchIconClassName: string
    clearBtnClassName: string
    shortcutClassName: string
    clearBtnIconClassName: string
}

export const searchBoxStyleVariants: StyleVariant[] = [
    {
        className: "self-center w-full max-w-120 mx-4",
        inputClassName: clsx([
            "w-full", "pl-8", "py-1", "rounded-xl", "italic", "outline-none", 
            "text-purple-900",
            "bg-linear-to-r from-sky-300 to-pink-300",
            "focus:bg-linear-to-r focus:from-yellow-300/30 focus:to-yellow-500/30",
            "border-1 border-blue-400",
            "hover:border-blue-500",
            "focus:border-2 focus:border-purple-500",
            "dark:border-white/40 dark:border-x-0", "dark:text-gray-100",
            "dark:from-white/25 dark:to-white/25",
            "dark:hover:border-gray-300",
            "dark:focus:border-gray-300",
            "dark:focus:from-white/50 dark:focus:to-white/50",
        ]),
        searchIconClassName: clsx([
            "absolute", "top-2", "left-2", "text-gray-700",
            "dark:text-gray-100"
        ]),
        clearBtnClassName: clsx([
            "absolute", "top-1", "right-2", "cursor-pointer",
            "p-1", "rounded-full",
            "hover:bg-purple-300",
            "dark:hover:bg-gray-600"
        ]),
        clearBtnIconClassName: clsx([
            "text-purple-900",
            "dark:text-gray-100"
        ]),
        shortcutClassName: clsx([
            "absolute top-1 right-3 font-bold flex items-center gap-0",
            "text-purple-800/50 dark:text-white/50"
        ]),
    }
]

export default function SearchBox({
    styleVariant,
    onChange
}: Props) {
    const [query, setQuery] = useState<string>("")
    
    function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
        const query = event.target.value

        setQuery(query)
        onChange?.(query.trim())
    }
    
    return (
        <div className={clsx(["relative", styleVariant.className])}>
            <input
                id="search-box"
                className={styleVariant.inputClassName}
                type="text"
                placeholder="Search games..."
                value={query}
                onChange={handleChange}
            />
            <MdSearch
                size={20}
                className={styleVariant.searchIconClassName}
            />
            {query ? <div
                className={styleVariant.clearBtnClassName}
                onClick={() => {
                    setQuery("")
                    onChange?.("")
                }}
            >
                <MdClose
                    size={20}
                    className={styleVariant.clearBtnIconClassName}
                />
            </div> : <div
                className={styleVariant.shortcutClassName}
            >
                <MdKeyboardCommandKey
                    size={20}
                />
                <span>+ K</span>
            </div>}
        </div>
    )
}