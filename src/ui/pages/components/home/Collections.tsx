import clsx from "clsx"
import { motion } from "motion/react"
import { AiFillThunderbolt } from "react-icons/ai"
import { MdDelete, MdOutlineSportsEsports, MdStar } from "react-icons/md"
import SpecialCollectionButton from "./SpecialCollectionButton"
import CollectionButton from "./CollectionButton"

interface Props {
    className?: string
    collections: GameCollection[]
    collectionsAnimController: any
    selectedCollection?: GameCollection
    handleAllGamesClick: () => void
    handleMostPlayedGamesClick: () => void
    handleNewGamesClick: () => void
    handleCollectionClick: (collection: GameCollection) => void
    handleDeletBtnClick: (collection: GameCollection) => void
}

export const SIDE_MENU_MAX_WIDTH = "17rem"

export default function Collections({
    className,
    collections,
    collectionsAnimController,
    selectedCollection,
    handleAllGamesClick,
    handleMostPlayedGamesClick,
    handleNewGamesClick,
    handleCollectionClick,
    handleDeletBtnClick
}: Props) {
    if (collections.length === 0) return null

    return (
        <motion.div
            animate={collectionsAnimController}
            className={clsx([
                // 17 rem (68)
                "w-68 max-w-68",
                "px-4 py-6 h-full shrink-0 border-r-2 border-purple-300 shadow-2xl",
                "bg-linear-to-l from-gray-100 to-purple-200",
                "dark:from-gray-800 dark:via-gray-800 dark:to-black/20",
                "dark:border-white/5",
                className
            ])}
        >
            {/* All Games Button */}
            <SpecialCollectionButton
                caption="ALL GAMES"
                icon={<MdOutlineSportsEsports size={28} />}
                isSelected={selectedCollection?.name === "ALLGAMES"}
                onClick={handleAllGamesClick}
            />
            {/* Most Played Games Button */}
            <SpecialCollectionButton
                caption="MOST PLAYED"
                icon={<MdStar size={28} />}
                isSelected={selectedCollection?.name === "MOSTPLAYED"}
                onClick={handleMostPlayedGamesClick}
            />
            {/* New Games Button */}
            <SpecialCollectionButton
                caption="NEW GAMES"
                icon={<AiFillThunderbolt size={28} />}
                isSelected={selectedCollection?.name === "NEWGAMES"}
                onClick={handleNewGamesClick}
            />
            {/* Collections List */}
            <div
                className={clsx([
                    "overflow-y-auto h-[calc(100%-170px)] pt-4 hide-scrollbar"
                ])}
            >
                {collections.map(coll => (
                    <CollectionButton
                        key={coll.id}
                        collection={coll}
                        selectedCollection={selectedCollection}
                        onClick={handleCollectionClick}
                        onDelete={handleDeletBtnClick}
                    />
                ))}
            </div>
        </motion.div>
    )
}