import clsx from "clsx"
import { useEffect, useState } from "react"
import { MdCheckBox, MdCheckBoxOutlineBlank } from "react-icons/md"

interface Props {
    id: string
    checked: boolean
    labelText?: string
    labelSide?: 'left' | 'right'
    styleVariant: StyleVariant
    onChange: (check: boolean) => void
}

type StyleVariant = {
    labelClassname: string,
    iconClassname: string,
    iconSize: number
}

export const checkBoxStyleVariants = {
    1: {
        labelClassname: "text-gray-800 dark:text-gray-100",
        iconClassname: "text-gray-800 dark:text-yellow-500",
        iconSize: 20
    } as StyleVariant
}

export default function CheckBox({
    id,
    checked,
    labelText,
    labelSide = 'left',
    styleVariant,
    onChange
}: Props) {
    const [checkState, setCheckState] = useState<boolean>(checked)

    useEffect(() => {
        setCheckState(checked)
    }, [checked])

    function LabelText() {
        return <span
            className={clsx([
                styleVariant.labelClassname,
                labelSide === 'left' ? "mr-2" : "ml-2"
            ])}
        >
            {labelText}
        </span>
    }

    return (
        <div className="cursor-pointer inline-block">
            <label
                htmlFor={id}
                className="inline-block"
            >
                {(labelText && labelSide === 'left') && LabelText()}
                {!labelText && <span className="hidden">checkbox</span>}
                {checkState && <MdCheckBox
                    size={styleVariant.iconSize}
                    className={clsx([styleVariant.iconClassname, "inline-block"])}
                />}
                {!checkState && <MdCheckBoxOutlineBlank
                    size={styleVariant.iconSize}
                    className={clsx([styleVariant.iconClassname, "inline-block"])}
                />}
                {(labelText && labelSide === 'right') && LabelText()}
                <input
                    type="checkbox"
                    id={id}
                    checked={checked}
                    onChange={(e) => {
                        setCheckState(e.target.checked)
                        onChange(e.target.checked)
                    }}
                    hidden
                />
            </label>
        </div>
    )
}