import { useEffect, useState } from "react"
import RadioButton, { RadioButtonProps, radioButtonStyleVariants } from "./RadioButton"

interface Props {
    buttonProps: Omit<RadioButtonProps, 'onChange' | 'checked' | 'styleVariant'>[]
    selectedIndex?: number 
    onChange: (value: string | number | string[]) => void
}

export default function RadioButtonGroup({
    buttonProps,
    selectedIndex = 0,
    onChange
}: Props) {
    const [selected, setSelected] = useState<number>(selectedIndex)

    useEffect(() => {
        setSelected(selectedIndex)
    }, [selectedIndex])
    
    function handleOnChange(value: string | number | string[]) {
        onChange(value)
    }
    
    return (
        <div className="flex flex-col gap-2">
            {buttonProps.map((bp, i) => {
                const id = bp.id + ':' + i

                return <RadioButton
                    key={id}
                    checked={i === selected ? true : false}
                    styleVariant={radioButtonStyleVariants[1]}
                    {...bp}
                    onChange={_ => {
                        setSelected(i)
                        handleOnChange(bp.value)
                    }}
                />
            })}
        </div>
    )
}