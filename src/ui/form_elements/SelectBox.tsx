import clsx from "clsx"
import { AnimationDefinition } from "motion"
import { motion, useAnimation } from "motion/react"
import { useRef, useState } from "react"
import { MdArrowDropDown, MdArrowDropUp, MdCheck, MdOutlineArrowDownward, MdOutlineArrowUpward } from "react-icons/md"
import { useClickOutside } from "../hooks/useClickOutside"

export type Option = {
    caption: string,
    value: string | number | readonly string[],
    direction: 'ascending' | 'descending'
}

type StyleVariant = {
    className: (open: boolean) => string
    optionContainerClassName: (open: boolean) => string
    optionClassName: (isSelected: boolean) => string
    directionClassName: string
    pickerClassName: string
    captionClassName: string
}

export const selectBoxStyleVariants: StyleVariant[] = [
    {
        className: (open: boolean) => clsx([
            open ? "rounded-b-none rounded-t-lg border-b-0" : "rounded-lg",

            "flex justify-between items-center gap-4",
            "max-w-100", "cursor-pointer", "p-1",
            "border-2 border-sky-300",
            "bg-linear-to-r from-green-300 to-cyan-300",
            "hover:border-sky-400",
            "dark:border-1 dark:border-gray-400 dark:border-x-0 dark:text-gray-100",
            "dark:bg-linear-to-r dark:from-white/25 dark:to-white/25",
            "dark:hover:border-gray-300",
        ]),
        optionContainerClassName: (open: boolean) => clsx([
            open ? "visible" : "invisible",

            "max-w-100", "min-w-full", "absolute", "z-50", "top-full", "left-0",
            "m-0", "p-0", "max-h-72", "overflow-y-auto", "rounded-b-lg", "shadow-xl",
            "border-2 border-sky-300",
            "dark:border-gray-400 dark:border-1",
        ]),
        optionClassName: (isSelected: boolean) => clsx([
            "max-w-100", "p-2", "select-none",
            "border-b border-sky-300", 
            "last:border-b-0",
            "whitespace-nowrap overflow-hidden overflow-ellipsis",
            "dark:text-white", "dark:border-gray-400",
            "dark:backdrop-blur-lg",
            "dark:hover:bg-gray-500", "dark:hover:text-gray-200",
            isSelected
                ? [
                    "flex", "justify-between", "items-center", "gap-4", "bg-cyan-200",
                    "text-blue-900",
                    "hover:bg-sky-200", "hover:text-blue-700",
                    "dark:bg-pink-600/25 dark:text-white",
                    "dark:hover:bg-gray-700 dark:hover:text-gray-100",
                ]
                : [
                    "bg-sky-100",
                    "hover:bg-sky-200 hover:text-blue-700",
                    "dark:bg-white/35",
                    "dark:hover:bg-gray-800 dark:hover:text-gray-100",
                ],
        ]),
        directionClassName: "text-green-700",
        pickerClassName: "text-sky-700",
        captionClassName: clsx([
            "text-gray-700", "whitespace-nowrap", "overflow-hidden", 
            "overflow-ellipsis", "dark:text-gray-300"
        ])
    }
]

interface Props {
    caption: string
    options: Option[]
    defaultOption: Option
    styleVariant: StyleVariant
    onChange: (option: Option) => void
}

function PickerIcon(openState: boolean, className?: string) {
    const classes = "text-gray-700 dark:text-gray-300" + (className ? " " + className : "")

    if (openState) {
        return <MdArrowDropUp size={24} className={classes} />
    }

    return <MdArrowDropDown size={24} className={classes} />
}

function DirectionIcon(direction: 'ascending' | 'descending', className?: string) {
    return direction === 'ascending'
        ? <MdOutlineArrowUpward
            size={20}
            className={"text-gray-700 dark:text-gray-300" + (className ? " " + className : "")}
        />
        : <MdOutlineArrowDownward
            size={20}
            className={"text-gray-700 dark:text-gray-300" + (className ? " " + className : "")}
        />
}

export default function SelectBox({
    caption,
    options,
    defaultOption,
    styleVariant,
    onChange
}: Props) {
    const ref = useRef<HTMLDivElement | null>(null)
    const animControls = useAnimation()

    useClickOutside(ref, playCloseAnim)
    
    const [open, setOpen] = useState<boolean>(false)
    const [selected, setSelected] = useState<Option>(defaultOption)

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

    function playCloseAnim() {
        animControls.start(closeAnim).then(_ => setOpen(false))
    }

    function handleOptionClick(option: Option) {
        const direction = option.value !== selected.value 
            ? undefined
            : option.direction === 'ascending'
                ? 'descending'
                : 'ascending'
        const selectedOption: Option = { ...option, direction: direction || option.direction }

        setSelected(selectedOption)
        onChange(selectedOption)
        playCloseAnim()
    }

    function onClick(isOpen: boolean) {
        if (!isOpen) {
            setOpen(true)
            animControls.start(openAnim)
        } else {
            playCloseAnim()
        }
    }
    
    return (
        <div ref={ref} className="relative">
            <div
                className={styleVariant.className(open)}
                onClick={() => onClick(open)}
            >
                {DirectionIcon(selected.direction, styleVariant.directionClassName)}
                <div
                    className={styleVariant.captionClassName}
                >
                    {selected ? selected.caption : caption}
                </div>
                {PickerIcon(open, styleVariant.pickerClassName)}
            </div>
            <motion.div
                className={styleVariant.optionContainerClassName(open)}
                animate={animControls}
            >
                {
                    options.map((option, index) => {
                        const isSelected = (selected && selected.value === option.value)
                            ? true : false
                        
                        const renderedOption = selected?.value === option.value ? selected : option

                        return (<div
                            key={index}
                            className={styleVariant.optionClassName(isSelected)}
                            onClick={() => handleOptionClick(renderedOption)}
                        >
                            <span className="whitespace-nowrap overflow-hidden overflow-ellipsis">
                                {renderedOption.caption}
                            </span>
                            {
                                (isSelected && !selected?.direction) &&
                                    <MdCheck
                                        size={20}
                                        className="text-black dark:text-gray-100"
                                    />
                            }
                            {
                                (isSelected && selected?.direction) &&
                                    DirectionIcon(
                                        selected.direction,
                                        styleVariant.directionClassName
                                    )
                            }
                        </div>)
                    })
                }
            </motion.div>
        </div>
    )
}