import clsx from "clsx"
import { useEffect, useRef, useState } from "react"
import { MdFilterAlt, MdFilterAltOff } from "react-icons/md"
import CheckBox, { checkBoxStyleVariants } from "../form_elements/CheckBox"
import RadioButtonGroup from "../form_elements/RadioButtonGroup"
import { AnimationDefinition, motion, useAnimation } from "motion/react"
import { useClickOutside } from "../hooks/useClickOutside"

interface Props {
    defaultFilterData: FilterData,
    filterData: FilterData,
    onChange: (filters: FilterData) => void
}

type AllGames = 'ALL_GAMES' | 'ALL_GAMES_COLLECTION'

export type FilterData = {
    installedOnes: boolean
    allGames: AllGames
    mostPlayedOnes?: boolean
    newOnes?: boolean
    collection?: GameCollection
    searchQuery?: string
}

export default function Filter({ defaultFilterData, filterData, onChange }: Props) {
    const ref = useRef<HTMLDivElement | null>(null)
    const animControls = useAnimation()

    useClickOutside(ref, playCloseAnim)

    const [open, setOpen] = useState<boolean>(false)
    const [filterDataInternal, setFilterDataInternal] = useState<FilterData>(defaultFilterData)

    const iconProps = {
        size: 28,
        className: "text-purple-500 dark:text-white/75 cursor-pointer hover:opacity-75"
    }

    const openAnim: AnimationDefinition = {
        opacity: [0.5, 1],
        maxHeight: ["0rem", "18rem"],
        transition: {
            duration: 0.2,
        }
    }
    
    const closeAnim: AnimationDefinition = {
        opacity: [1, 0.5],
        maxHeight: ["18rem", "0rem"],
        transition: {
            duration: 0.2,
        }
    }

    useEffect(() => {
        setFilterDataInternal(filterData)
    }, [filterData])

    function handleFilterClick() {
        if (!open) {
            setOpen(true)
            animControls.start(openAnim)
        } else {
            playCloseAnim()
        }
    }

    function playCloseAnim() {
        animControls.start(closeAnim).then(_ => setOpen(false))
    }

    return (
        <div ref={ref} className="relative">
            <MdFilterAlt
                {...iconProps}
                onClick={handleFilterClick}
            />
            <motion.div
                className={clsx([
                    open ? "visible" : "invisible",
                    "absolute", "z-50", "top-full", "right-0", "shadow-lg", "bg-white",
                    "max-w-100", "min-w-64", "max-h-100", "overflow-y-auto",
                    "bg-gray-100", "p-4", "border", "border-gray-700", "rounded-md",
                    "dark:bg-gray-900", "dark:border-gray-600"
                ])}
                animate={animControls}
            >
                <div
                    className={clsx([
                        "flex", "items-center", "gap-4", "mb-4", "p-2", "cursor-pointer",
                        "rounded-md", "bg-gray-200",
                        "hover:bg-gray-300",
                        "dark:bg-gray-700",
                        "dark:hover:bg-gray-600"
                    ])}
                    onClick={() => {
                        setFilterDataInternal(defaultFilterData)
                        onChange(defaultFilterData)
                    }}
                >
                    <MdFilterAltOff size={20} className="text-gray-700 dark:text-gray-300" />
                    <span className="text-gray-700 dark:text-gray-300">Clear Filter</span>
                </div>
                
                {/* All games or All games in collection choice */}
                <div className="mb-4">
                    {
                        <RadioButtonGroup
                            selectedIndex={filterDataInternal.allGames === 'ALL_GAMES' ? 0 : 1}
                            buttonProps={[
                                {
                                    id: 0,
                                    labelText: 'All Games',
                                    labelSide: 'right',
                                    value: 'ALL_GAMES'
                                },
                                {
                                    id: 1,
                                    labelText: 'All Games in Collection',
                                    labelSide: 'right',
                                    value: 'ALL_GAMES_COLLECTION'
                                },
                            ]}
                            onChange={(value) => {
                                const filters: FilterData = {
                                    ...filterDataInternal,
                                    allGames: value as AllGames
                                }
                                setFilterDataInternal(filters)
                                onChange(filters)
                            }}
                        />
                    }
                </div>

                {/* Installed ones option */}
                <div>
                    <CheckBox
                        labelText="Installed ones"
                        labelSide="right"
                        checked={filterDataInternal.installedOnes}
                        styleVariant={checkBoxStyleVariants[1]}
                        onChange={(check: boolean) => {
                            const filters = {
                                ...filterDataInternal,
                                installedOnes: check
                            }
                            setFilterDataInternal(filters)
                            onChange(filters)
                        }}
                        id="installed_ones"
                    />
                </div>
            </motion.div>
        </div>
    )
}