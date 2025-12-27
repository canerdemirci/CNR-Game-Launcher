import clsx from "clsx"

interface Props {
    caption: string
    styleVariant: StyleVariant
    style?: React.CSSProperties
    onClick: () => void
}

type StyleVariant = {
    buttonClassName: string
}

export const buttonStyleVariants = {
    1: {
        buttonClassName: clsx([
            "flex", "justify-end", "px-8", "py-2", "cursor-pointer", "font-bold",
            "border", "rounded-md", "bg-gray-200", "border-gray-400", "outline-none",
            "text-gray-600",
            "hover:bg-gray-300", "hover:border-gray-500", "hover:text-gray-800",
            "dark:bg-green-800", "dark:border-green-900", "dark:text-gray-300",
            "dark:hover:bg-green-900", "dark:hover:border-green-700", "dark:hover:text-gray-200"
        ]),
    }
}

export default function Button({
    caption,
    styleVariant,
    style,
    onClick
}: Props) {
    return (
        <button
            className={styleVariant.buttonClassName}
            style={style}
            onClick={onClick}
        >
            {caption}
        </button>
    )
}