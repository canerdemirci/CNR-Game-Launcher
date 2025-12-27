import clsx from "clsx"

interface Props {
    searchQuery?: string
    foundGamesCountOnSearch: number
    totalGamesCount: number
    totalCollectionsCount: number
    installedGamesCount: number
    filteredGamesCountInSelectedCollection?: number
    selectedCollection?: GameCollection
}

function Chip(value: any, caption: string) {
    return (
        <span
            className={clsx([
                "flex items-center justify-start gap-2", "font-bold",
                "bg-red-700 dark:bg-white/15 rounded-md text-[0.7rem]"
            ])}
        >
            <span
                className="rounded-l-md bg-purple-700 dark:bg-white/25 p-1 px-2"
            >
                {value}
            </span>
            <span className="pr-2">{caption}</span>
        </span>
    )
}

export default function StatusBar({
    searchQuery,
    foundGamesCountOnSearch,
    totalGamesCount,
    totalCollectionsCount,
    installedGamesCount,
    filteredGamesCountInSelectedCollection,
    selectedCollection
}: Props) {
    return (
        <footer className={clsx([
            "flex justify-end items-center gap-4", "border-t-2 border-purple-400",
            "backdrop-blur-2xl",
            "bg-linear-to-l from-indigo-300 to-pink-300",
            "h-10 px-4 shadow-md text-gray-100",
            "dark:bg-linear-to-l dark:from-blue-950/10 dark:via-pink-800/30 dark:to-purple-800/10",
            "dark:border-white/10"
        ])}>
            {
                searchQuery &&
                Chip(foundGamesCountOnSearch, "Games found")
            }
            {
                !searchQuery &&
                <>
                    {Chip(totalGamesCount, "Game")}
                    {Chip(totalCollectionsCount, "Collection")}
                    {Chip(installedGamesCount, "Installed Games")}
                </>
            }
            {
                selectedCollection &&
                Chip(filteredGamesCountInSelectedCollection, "in " + selectedCollection.name)
            }
        </footer>
    )
}