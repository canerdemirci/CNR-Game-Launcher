import { useEffect, useState } from "react"
import { MdDarkMode, MdLightMode, MdBrightness6 } from "react-icons/md"
import clsx from "clsx"
import { useTheme } from "../hooks/useTheme"
import { useAppContext } from "../providers/AppContextProvider"

interface Props {
}

function defineNextTheme(theme: Omit<Theme, 'system'>): Omit<Theme, 'system'> {
    if (theme === 'light') {
        return 'dark'
    } else {
        return 'light'
    }
}

export default function ThemeSelector({}: Props) {
    const theme = useTheme()
    const appContext = useAppContext()
    
    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        appContext.setTheme(e.target.value as Theme)
    }

    return (
        <div
            className={clsx([
                "h-9", "p-2", "rounded-3xl", "flex", "justify-center", "items-center", "gap-2",
                "border", "border-yellow-800", "bg-yellow-500",
                "dark:bg-white/25", "dark:border-white/50 dark:border-x-0",
                "dark:hover:border-white/70",
                (theme === 'dark' || theme === 'light') ? [
                    theme === 'dark' 
                        ? "dark:border-l-5 dark:border-l-white/50"
                        : "border-l-5 border-l-yellow-800"
                ] : [
                    theme === 'dark'
                        ? "dark:border-r-5 dark:border-r-white/50"
                        : "border-r-5 border-r-yellow-800"
                ]
            ])}
        >
            <div>
                {defineNextTheme(theme) === 'light' && <label className="cursor-pointer group">
                    <MdLightMode
                        size={24}
                        className={clsx([
                            "text-gray-100",
                            "dark:text-yellow-600",
                            "group-hover:dark:text-yellow-500", "group-hover:text-gray-700",
                        ])}
                    />
                    <input
                        onChange={handleChange}
                        type="radio"
                        name="light"
                        value="light"
                        id="light"
                        checked={theme === 'light'}
                        hidden
                    />
                </label>}
                {defineNextTheme(theme) === 'dark' && <label className="cursor-pointer group">
                    <MdDarkMode
                        size={24}
                        className={clsx([
                            "text-orange-700",
                            "dark:text-black/50",
                            "group-hover:dark:text-black/75", "group-hover:text-orange-500",
                        ])}
                    />
                    <input
                        onChange={handleChange}
                        type="radio"
                        name="dark"
                        value="dark"
                        id="dark"
                        checked={theme === 'dark'}
                        hidden
                    />
                </label>}
            </div>
            <div className="w-px bg-black/25 h-[70%] rounded-md" />
            <label className="cursor-pointer group">
                <MdBrightness6
                    size={24}
                    className={clsx([
                        "text-orange-900",
                        "dark:text-purple-950/70",
                        "group-hover:dark:text-blue-950", "group-hover:text-orange-500",
                    ])}
                />
                <input
                    onChange={handleChange} 
                    type="radio" 
                    name="system"
                    value="system"
                    id="system"
                    checked={theme === 'system'}
                    hidden
                />
            </label>
        </div>
    )
}