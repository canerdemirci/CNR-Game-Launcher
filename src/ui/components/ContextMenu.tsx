import clsx from "clsx"
import { useRef } from "react"
import { MenuItem, useContextMenu } from "../providers/ContextMenuProvider"
import { useClickOutside } from "../hooks/useClickOutside"
import { useAdjustedPosition } from "../hooks/useAdjustedPosition"

export default function ContextMenu() {
    const ref = useRef<HTMLDivElement | null>(null)

    const { show, position, menuItems, hideContextMenu } = useContextMenu()
    
    useClickOutside(ref, hideContextMenu)

    const { adjustedPosition } = useAdjustedPosition(ref, position)

    function handleItemClick(item: MenuItem) {
        item.onClick()
        hideContextMenu()
    }

    if (!show) return null

    return (
        <div
            ref={ref}
            className={clsx([
                "absolute z-50 w-48 bg-white dark:bg-gray-800 shadow-lg rounded-md",
                "border border-gray-200 dark:border-gray-700",
                "p-2", "max-h-100", "overflow-y-auto"
            ])}
            style={{
                left: adjustedPosition.x,
                top: adjustedPosition.y
            }}
        >
            {
                menuItems.map((item, i) => (
                    <div
                        key={i}
                        className={clsx([
                            "px-3", "py-2", "rounded-md", 
                            !item.disabled && [
                                "cursor-pointer", "hover:bg-gray-100", "dark:hover:bg-gray-700",
                                "text-gray-800", "dark:text-gray-100"
                            ],
                            item.disabled && ["text-gray-400", "dark:text-gray-400"]
                        ])}
                        onClick={() => {
                            if (!item.disabled) {
                                handleItemClick(item)
                            }
                        }}
                    >
                        {item.label}
                    </div>
                ))
            }
        </div>
    )
}