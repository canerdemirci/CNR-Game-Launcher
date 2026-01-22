import { MdCheckBoxOutlineBlank, MdOutlineCheckBox } from "react-icons/md"
import { ViewKind } from "../../../components/ViewSelector"
import { clampText, formatDate } from "../../../utils"
import clsx from "clsx"
import GameIcon from "../../../assets/game-icon.png"
import { IoGameController } from "react-icons/io5"
import { motion } from "motion/react"
import { useEffect, useRef, useState } from "react"

interface Props {
    viewStyle: ViewKind
    games: Game[]
    selectedCollection?: GameCollection
    gameOnClick: (game: Game) => void
    gameOnRightClick: (game: Game, mousePosition: { x: number, y: number }) => void
}

function CollectionTitle(collection: GameCollection) {
    if (collection.name === 'ALLGAMES' ||
        collection.name === 'MOSTPLAYED' ||
        collection.name === 'NEWGAMES')
    {
        return null
    }
    
    return (
        <div
            className={clsx([
                "w-full", "px-6", "py-3",
                "bg-linear-to-l from-blue-100 to-blue-200",
                "dark:from-gray-800 dark:to-gray-950",
                "text-sky-800", "font-[ScienceGothic]", "text-lg dark:text-gray-300",
                "border-b border-blue-300 dark:border-gray-900",
                "capitalize"
            ])}
        >
            {clampText(collection.name, 50)}
        </div>
    )
}

export default function Games({
    viewStyle,
    games,
    selectedCollection,
    gameOnClick,
    gameOnRightClick
}: Props) {
    const gamesRef = useRef<HTMLDivElement>(null)

    const [selectedGame, setSelectedGame] = useState<Game | null>(null)

    useEffect(() => {
        gamesRef.current?.scrollTo({ top: 0, behavior: 'instant' })
    }, [games])
    
    function handleRightClick(e: React.MouseEvent, game: Game) {
        e.preventDefault()
        gameOnRightClick(game, { x: e.clientX, y: e.clientY })
    }

    if (games.length === 0) {
        return (
            <motion.div
                animate={{ opacity: [0.3, 1] }}
                transition={{ duration: 1, repeat: Infinity, repeatType: 'mirror' }}
                className={clsx([
                    "w-full h-full text-gray-500",
                    "flex flex-col justify-center items-center gap-8",
                    "dark:text-gray-400"
                ])}
            >
                <IoGameController size={100} />
                <p className="text-3xl font-bold">No Games Found!</p>
            </motion.div>
        )
    }

    switch (viewStyle) {
        case 'list':
            return (
                <div
                    className="w-full h-full"
                >
                    <div
                        ref={gamesRef}
                        className={clsx([
                            "grow", "overflow-y-auto", "w-full", "h-full",
                        ])}
                    >
                        {selectedCollection && CollectionTitle(selectedCollection)}
                        <table
                            className="game-table"
                        >
                            <thead className="sticky top-0 shadow-sm">
                                <tr>
                                    <th>#</th>
                                    <th></th>
                                    <th>Game Name</th>
                                    <th>Date Added</th>
                                    <th>Installed</th>
                                    <th>Last Play</th>
                                    <th>Play Count</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    games.map((g, i) => (
                                        <tr
                                            key={g.id}
                                            onClick={() => gameOnClick(g)}
                                            onContextMenu={(e) => handleRightClick(e, g)}
                                        >
                                            <td>{i + 1}</td>
                                            <td>
                                                <img
                                                    src={g.iconPath || GameIcon}
                                                    alt={g.name}
                                                    className="w-6 h-6 max-w-none max-h-none rounded-md"
                                                />
                                            </td>
                                            <td className="capitalize">{clampText(g.name, 30)}</td>
                                            <td>{formatDate(g.createdAt.toString())}</td>
                                            <td>
                                                {
                                                    g.isInstalled
                                                        ? <MdOutlineCheckBox size={20} />
                                                        : <MdCheckBoxOutlineBlank size={20} />
                                                }
                                            </td>
                                            <td>{formatDate(g.lastPlayed.toString())}</td>
                                            <td>{g.playCount}</td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
            )

        case 'icon':
            return (
                <div
                    className={clsx([
                        "w-full max-h-full flex flex-col",
                    ])}
                >
                    {selectedCollection && CollectionTitle(selectedCollection)}
                    <div
                        ref={gamesRef}
                        className={clsx([
                            "w-full h-full", "px-6 py-8", "overflow-y-auto",
                            "flex flex-wrap justify-start items-start gap-4"
                        ])}
                    >
                        {
                            games.map((g, gi) => (
                                <motion.div
                                    key={g.id + selectedCollection?.id + selectedCollection?.name}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: [0, 1], scale: [0.9, 1] }}
                                    transition={{
                                        duration: 0.1,
                                        delay: gi * 0.05,
                                        type: 'spring',
                                        damping: 5,
                                    }}
                                    className={clsx([
                                        selectedGame?.id === g.id && [
                                            "bg-sky-200 border-sky-400",
                                            "dark:bg-gray-900 dark:border-gray-700"
                                        ],
                                        "border",
                                        "w-25 p-2", "drop-shadow-xl",
                                        "rounded-md",
                                        selectedGame?.id !== g.id && [
                                            "border-transparent",
                                            "hover:bg-sky-100 hover:border hover:border-sky-300",
                                            "dark:hover:bg-gray-800 dark:hover:border-gray-600"
                                        ]
                                    ])}
                                    onClick={() => setSelectedGame(g)}
                                    onDoubleClick={() => gameOnClick(g)}
                                    onContextMenu={(e) => handleRightClick(e, g)}
                                >
                                    <div
                                        className={clsx([
                                            "aspect-square", "w-15 mx-auto", "bg-red-500", "rounded-md",
                                        ])}
                                    >
                                        <img
                                            src={g.iconPath || GameIcon}
                                            alt={g.name}
                                            className={clsx([
                                                "w-full h-full object-cover rounded-md"
                                            ])}
                                        />
                                    </div>
                                    <span
                                        className={clsx([
                                            "text-red-950", "text-center", "block", "m-auto", "mt-2",
                                            "wrap-break-word", "text-sm", "capitalize",
                                            "dark:text-gray-100"
                                        ])}
                                    >{clampText(g.name, 30)}</span>
                                </motion.div>
                            ))
                        }
                    </div>
                </div>
            )

        case 'card':
            return (
                <div
                    ref={gamesRef}
                    className="w-full h-full flex flex-col"
                >
                    {selectedCollection && CollectionTitle(selectedCollection)}
                    <div
                        className={clsx([
                            "pt-10 pb-20 px-12 mx-0 w-full max-h-full", "overflow-y-auto",
                            "2xl:grid 2xl:grid-cols-4 2xl:gap-24",
                            "xl:grid xl:grid-cols-4 xl:gap-16",
                            "lg:grid lg:grid-cols-4 lg:gap-12",
                            "md:grid md:grid-cols-3 md:gap-8",
                            "sm:grid sm:grid-cols-3 sm:gap-6",
                            "grid grid-cols-2 gap-6",
                        ])}
                    >
                        {
                            games.map((g, gi) => (
                                <motion.div
                                    key={g.id + selectedCollection?.id + selectedCollection?.name}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: [0, 1] }}
                                    transition={{ duration: 0.7, delay: gi * 0.07 }}
                                    className={clsx([
                                        "relative group", "gradient_anim2",
                                        "rounded-md", "cursor-pointer", "aspect-2/3",
                                        "drop-shadow-xl drop-shadow-black/60",
                                        "duration-200 transition-transform ease-in",
                                        "hover:scale-110 hover:p-[0.18rem] hover:drop-shadow-blue-500",
                                        "hover:border-0"
                                    ])}
                                    onClick={() => gameOnClick(g)}
                                    onContextMenu={(e) => handleRightClick(e, g)}
                                >
                                    {/* Shining effect div */}
                                    <div className={clsx([
                                        "invisible absolute top-0 left-0 w-full h-full bg-linear-to-r",
                                        "transition-[transform,background] duration-500",
                                        "from-transparent via-white/10 to-transparent",
                                        "bg-size-[200%_100%] bg-position-[-200%_0%]",
                                        "group-hover:visible",
                                        "group-hover:bg-position-[0%_0%]",
                                    ])} />
                                    <div className="w-full h-full">
                                        {g.cardIconPath && <img
                                            src={g.cardIconPath}
                                            alt={g.name}
                                            className="w-full h-full object-cover rounded-md"
                                        />}
                                        {
                                            !g.cardIconPath &&
                                            <div
                                                className={clsx([
                                                    "w-full h-full p-4",
                                                    "rounded-md border border-gray-950",
                                                    "flex flex-col items-center justify-center gap-4",
                                                    "bg-linear-to-r from-gray-100 to-gray-200",
                                                    "group-hover:border-0",
                                                    "dark:from-gray-800 dark:to-gray-900",
                                                ])}
                                            >
                                                <IoGameController
                                                    size={46}
                                                    className={clsx([
                                                        "text-gray-700 dark:text-gray-400"
                                                    ])}
                                                />
                                                <span
                                                    className={clsx([
                                                        "text-center font-[ScienceGothic] text-gray-700",
                                                        "capitalize", "text-sm lg:text-lg", "wrap-anywhere",
                                                        "dark:text-gray-400"
                                                    ])}
                                                >{clampText(g.name, 30)}</span>
                                            </div>
                                        }
                                    </div>
                                </motion.div>
                            ))
                        }
                    </div>
                </div>
            )
    }
}