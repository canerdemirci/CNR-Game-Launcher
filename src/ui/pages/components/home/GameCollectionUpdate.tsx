import { useEffect, useMemo, useState } from "react"
import Button, { buttonStyleVariants } from "../../../form_elements/Button"
import { CheckList, CheckListItem } from "../../../form_elements/CheckList"
import { useWindowModal } from "../../../providers/WindowModalProvider"

interface Props {
    collections: GameCollection[]
    game: Game
}

export default function GameCollectionUpdate({
    collections,
    game
}: Props) {
    const { hideWindow } = useWindowModal()

    const [collectionsInternal, setCollectionsInternal] = useState<GameCollection[]>(collections)
    const [selectedItems, setSelectedItems] = useState<CheckListItem<GameCollection>[]>([])
    const [isNewCollAdding, setIsNewCollAdding] = useState<boolean>(false)

    useEffect(() => {
        setSelectedItems(
            collections
                .filter(c => game.collectionIds.includes(c.id))
                .map(c => ({
                    caption: c.name,
                    value: c,
                    checked: true
                } as CheckListItem<GameCollection>))
        )
    }, [collections])

    const itemsToCollections = useMemo(() => {
        return [...selectedItems.map(si => si.value)] as GameCollection[]
    }, [selectedItems])

    function handleSave() {
        hideWindow(itemsToCollections)
    }

    function handleCancel() {
        hideWindow(undefined)
    }
    
    return (
        <div>
            <CheckList
                list={
                    collectionsInternal.map(c => ({
                        caption: c.name,
                        value: c,
                        checked: selectedItems.map(si => si.value?.id).includes(c.id)
                    } as CheckListItem<GameCollection>))
                }
                onChange={(items) => {
                    const newAddedCollection = items.find(c => !c.value && c.checked)

                    if (newAddedCollection) {
                        setIsNewCollAdding(true)

                        window.electron.gameCollections.add(newAddedCollection.caption)
                            .then(coll => {
                                if (coll) {
                                    setCollectionsInternal(prev => [...prev, coll])
                                    setSelectedItems([
                                        ...items.filter(i => i.checked && i.caption !== coll.name),
                                        {
                                            caption: coll.name,
                                            value: coll,
                                            checked: true
                                        } as CheckListItem<GameCollection>
                                    ])
                                }
                            })
                            .finally(() => setIsNewCollAdding(false))
                    } else {
                        setIsNewCollAdding(false)
                        setSelectedItems(items.filter(i => i.checked))
                    }
                }}
            />
            {!isNewCollAdding && <div className="flex items-center justify-center gap-4 pt-4 py-2">
                <Button
                    caption="SAVE"
                    styleVariant={buttonStyleVariants[1]}
                    onClick={handleSave}
                />
                <Button
                    caption="CANCEL"
                    styleVariant={buttonStyleVariants[1]}
                    onClick={handleCancel}
                />
            </div>}
        </div>
    )
}