import { useEffect, useState } from "react"
import Button, { buttonStyleVariants } from "./Button"
import CheckBox, { checkBoxStyleVariants } from "./CheckBox"
import TextInput, { textInputStyleVariants } from "./TextInput"

type StyleVariant = {
    mainContainer: string
    noCollectionText: string
}

export type CheckListItem<T> = {
    caption: string
    value: T | null
    checked: boolean
}

interface CheckListProps<T> {
    list: CheckListItem<T>[]
    className?: string
    onChange: (items: CheckListItem<T>[]) => void
}

export const checkListStyleVariants = {
    1: {
        mainContainer: "p-4 border rounded-md border-gray-300 dark:border-gray-600 " +
            "flex flex-wrap items-center gap-8 max-h-50 overflow-y-auto",
        noCollectionText: "text-center text-gray-700 dark:text-yellow-500"
    } as StyleVariant
}

export function CheckList<T>({
    list,
    className,
    onChange
} : CheckListProps<T>) {
    const [newItemCaption, setNewItemCaption] = useState<string>('')
    const [checkList, setCheckList] = useState<CheckListItem<T>[]>(list)

    useEffect(() => {
        setCheckList(list.sort((a, b) => a.caption.localeCompare(b.caption)))
    }, [list])

    function handleNewItemInput(value: string) {
        setNewItemCaption(value)
    }

    function handleAddItemClick() {
        if (!newItemCaption.trim()) return

        const updatedList = [
            ...checkList,
            {
                caption: newItemCaption,
                checked: true,
                value: null
            } as CheckListItem<T>
        ]

        setCheckList(updatedList)
        onChange(updatedList)
        setNewItemCaption('')
    }
    
    return (
        <div>
            <h3
                className="mb-4 text-2xl text-gray-700 dark:text-gray-300"
            >
                Choose Game Collections
            </h3>
            <div
                className={checkListStyleVariants[1].mainContainer + " " + className}
            >
                {
                    checkList.length === 0 &&
                        <p
                            className={checkListStyleVariants[1].noCollectionText}
                        >
                            There's no game collection yet.
                        </p>
                }
                {
                    checkList.length > 0 &&
                        checkList
                            .map((item, index) => (
                                <CheckBox
                                    key={index + item.caption}
                                    checked={item.checked}
                                    id={index.toString()+item.caption}
                                    labelText={item.caption}
                                    styleVariant={checkBoxStyleVariants[1]}
                                    onChange={(check) => {
                                        const updatedCheckList = [...checkList]
                                        updatedCheckList[index].checked = check
                                        
                                        setCheckList(updatedCheckList)
                                        onChange(updatedCheckList)
                                    }}
                                />
                            ))
                }
            </div>
            <div
                className="mt-2 flex justify-between items-center gap-4"
            >
                <TextInput
                    id="add-collection"
                    placeHolder="Input a collection name"
                    styleVariant={textInputStyleVariants[1]}
                    inputStyle={{ width: "100%" }}
                    value={newItemCaption}
                    minLength={2}
                    maxLength={50}
                    onChange={handleNewItemInput}
                />
                <Button
                    caption="ADD"
                    styleVariant={buttonStyleVariants[1]}
                    onClick={handleAddItemClick}
                />
            </div>
        </div>
    )
}