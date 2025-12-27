import clsx from "clsx"
import { ChangeEvent, useState } from "react"

interface Props {
    id: string
    value: string
    minLength: number
    maxLength: number
    labelText?: string
    styleVariant: StyleVariant
    onChange: (value: string) => void
}

type StyleVariant = {
    inputClassName: string
    labelClassName: string
}

export const passwordInputStyleVariants = {
    1: {
        inputClassName: "border dark:border-gray-500 dark:text-gray-100 rounded-md p-2 " +
            " outline-none border-gray-400 text-gray-700 focus:border-gray-700 focus:bg-gray-200 " +
            "dark:focus:border-gray-400 dark:focus:bg-gray-900",
        labelClassName: "text-gray-800 dark:text-gray-100 text-md"
    } as StyleVariant
}

export default function PasswordInput({
    id,
    value,
    minLength,
    maxLength,
    labelText,
    styleVariant,
    onChange
}: Props) {
    const [internalValue, setInternalValue] = useState<string>(value)

    function handleChange(e: ChangeEvent<HTMLInputElement>) {
        setInternalValue(e.target.value)
        onChange(e.target.value)
    }

    return (
        <div
            className={clsx([
                "w-116", "flex", "items-start", "justify-between"
            ])}
        >
            {labelText && <label
                htmlFor={id}
                className={styleVariant.labelClassName}
            >
                {labelText}
            </label>}
            <input
                id={id}
                type="password"
                className={styleVariant.inputClassName}
                minLength={minLength}
                maxLength={maxLength}
                value={internalValue}
                onChange={handleChange}
            />
        </div>
    )
}