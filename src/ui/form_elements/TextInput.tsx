import clsx from "clsx"
import { ChangeEvent, useEffect, useState } from "react"

interface Props {
    id: string
    value: string
    minLength?: number
    maxLength?: number
    labelText?: string
    placeHolder?: string
    styleVariant: StyleVariant
    inputStyle?: React.CSSProperties
    labelStyle?: React.CSSProperties
    onChange: (value: string) => void
}

type StyleVariant = {
    inputClassName: string
    labelClassName: string
}

export const textInputStyleVariants = {
    1: {
        inputClassName: "border dark:border-gray-500 dark:text-gray-100 rounded-md p-2 " +
            "placeholder:text-gray-400  " +
            "outline-none border-gray-400 text-gray-700 focus:border-gray-700 focus:bg-gray-200 " +
            "dark:focus:border-gray-400 dark:focus:bg-gray-900",
        labelClassName: "text-gray-800 dark:text-gray-100 text-md dark:placeholder:text-gray-600"
    } as StyleVariant
}

export default function TextInput({
    id,
    value,
    minLength,
    maxLength,
    labelText,
    placeHolder,
    styleVariant,
    inputStyle,
    labelStyle,
    onChange
}: Props) {
    const [internalValue, setInternalValue] = useState<string>(value)

    useEffect(() => {
        setInternalValue(value)
    }, [value])

    function handleChange(e: ChangeEvent<HTMLInputElement>) {
        setInternalValue(e.target.value)
        onChange(e.target.value)
    }

    return (
        <div
            className={clsx([
                "flex", "items-start", "justify-between", "w-full"
            ])}
        >
            {labelText && <label
                htmlFor={id}
                className={styleVariant.labelClassName}
                style={labelStyle}
            >
                {labelText}
            </label>}
            <input
                id={id}
                type="text"
                placeholder={placeHolder}
                className={styleVariant.inputClassName}
                style={inputStyle}
                minLength={minLength}
                maxLength={maxLength}
                value={internalValue}
                onChange={handleChange}
            />
        </div>
    )
}