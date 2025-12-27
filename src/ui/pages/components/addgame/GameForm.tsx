import clsx from "clsx"
import { useEffect, useState } from "react"
import { MdOutlineBrokenImage, MdUploadFile } from "react-icons/md"
import Button, { buttonStyleVariants } from "../../../form_elements/Button"
import CheckBox, { checkBoxStyleVariants } from "../../../form_elements/CheckBox"
import { CheckList, CheckListItem } from "../../../form_elements/CheckList"
import TextInput, { textInputStyleVariants } from "../../../form_elements/TextInput"
import GamePathCopyChip from "./GamePathCopyChip"
import { useMessageModal } from "../../../providers/MessageModalProvider"
import { useAppContext } from "../../../providers/AppContextProvider"

export type GameFormData = {
    name: string
    exePath?: string
    isInstalled: boolean
    selectedCollections: GameCollection[]
    iconFile?: File | null
    cardIconFile?: File | null
}

type Mode = "add" | "edit"

type Props<T extends Mode> = {
    mode: T
    collections: GameCollection[]
    onSubmit: (data: GameFormData) => void
} & (T extends "edit" ? { game: Game } : { game?: never })

export default function GameForm<T extends Mode>({
    mode,
    collections,
    game,
    onSubmit
}: Props<T>) {
    const { showMessage } = useMessageModal()
    const { isFullscreen } = useAppContext()
    
    const [formData, setFormData] = useState<GameFormData>({
        name: "",
        exePath: "",
        isInstalled: false,
        selectedCollections: []
    })
    const [internalCollections, setInternalCollections] = useState<GameCollection[]>(collections)

    useEffect(() => {
        setInternalCollections(collections)
    }, [collections])

    useEffect(() => {
        if (mode === "edit" && game) {
            setFormData({
                name: game.name,
                exePath: game.exePath,
                isInstalled: game.isInstalled,
                selectedCollections: internalCollections.filter(
                    c => game.collectionIds.includes(c.id)
                )
            })
        }
    }, [game])

    function handleGameNameChange(value: string) {
        setFormData(prev => ({ ...prev, name: value.trim() }))
    }

    function handleExecPathChange(value: string) {
        setFormData(prev => ({ ...prev, exePath: value.trim() }))
    }

    function handleGameInstalledChange(checked: boolean) {
        setFormData(prev => ({ ...prev, isInstalled: checked }))
    }

    function handleCheckListChange(items: CheckListItem<GameCollection>[]) {
        const newAddedItem = items.find(i => i.checked && i.value === null)

        if (newAddedItem) {
            window.electron.gameCollections
                .add(newAddedItem.caption)
                .then(coll => {
                    if (coll) {
                        setInternalCollections(prev => [...prev, coll])
                        setFormData(prev => ({ ...prev, selectedCollections: [
                            ...prev.selectedCollections, coll
                        ]}))
                    }
                })
        } else {
            const sColls = items.filter(sci => sci.checked === true && sci.value !== null).map(
                sci => sci.value!
            )

            setFormData(prev => ({ ...prev, selectedCollections: sColls }))
        }
    }

    function handleIconFileChange(event: React.ChangeEvent<HTMLInputElement>) {
        const file = event.target.files ? event.target.files[0] : null

        setFormData(prev => ({ ...prev, iconFile: file }))
    }

    function handleCardIconFileChange(event: React.ChangeEvent<HTMLInputElement>) {
        const file = event.target.files ? event.target.files[0] : null

        setFormData(prev => ({ ...prev, cardIconFile: file }))
    }

    function handleSaveGame() {
        if (formData.name.trim().length <= 1) {
            showMessage(
                "Invalid Game Name",
                "Please provide a valid game name with at least 2 characters.",
                "warning",
                true
            )

            return
        }

        onSubmit(formData)
    }
    
    return (
        <div className="p-4 overflow-auto h-full">
            <div
                className={clsx([
                    "flex justify-between gap-16"
                ])}
            >
                <div className="flex-3 h-full flex flex-col gap-6">
                    <TextInput
                        id="game-name"
                        styleVariant={textInputStyleVariants[1]}
                        inputStyle={{
                            width: "70%"
                        }}
                        labelText="Game Name"
                        minLength={2}
                        maxLength={100}
                        value={formData.name}
                        onChange={handleGameNameChange}
                    />
                    <TextInput
                        id="exec-path"
                        styleVariant={textInputStyleVariants[1]}
                        inputStyle={{
                            width: "70%"
                        }}
                        labelText="Executable Path"
                        minLength={2}
                        maxLength={400}
                        value={formData.exePath || ""}
                        onChange={handleExecPathChange}
                    />
                    <GamePathCopyChip />
                    <CheckBox
                        id="game-installed"
                        styleVariant={checkBoxStyleVariants[1]}
                        labelText="Game is installed?"
                        checked={formData.isInstalled}
                        onChange={handleGameInstalledChange}
                    />
                    <div className="my-1"></div>
                    <CheckList
                        className="mt-4"
                        list={internalCollections.map(coll => ({
                            caption: coll.name,
                            value: coll,
                            checked: formData.selectedCollections.includes(coll)
                        } as CheckListItem<GameCollection>))}
                        onChange={handleCheckListChange}
                    />
                    <Button
                        caption="SAVE GAME"
                        styleVariant={buttonStyleVariants[1]}
                        style={{ width: "10rem" }}
                        onClick={handleSaveGame}
                    />
                </div>
                {/* Icon Upload Section - RIGHT SIDE */}
                <div className="flex-1">
                    <div className="flex items-center gap-4">
                        <div>
                            <label
                                htmlFor="game-icon-image"
                                className="cursor-pointer"
                            >
                                <MdUploadFile size={28} className="dark:text-white" />
                            </label>
                            <input
                                type="file"
                                accept="image/png, image/jpeg, image/jpg"
                                id="game-icon-image"
                                name="game-icon-image"
                                hidden
                                onChange={handleIconFileChange}
                            />
                        </div>
                        <span className="dark:text-white">Game Icon Image (optional) 480x480px</span>
                    </div>
                    <div
                        className={clsx([
                            "w-20 h-20 my-4 border border-gray-600 rounded-md  overflow-hidden",
                            !formData.iconFile && "flex justify-center items-center",
                            "dark:border-gray-300"
                        ])}
                    >
                        {
                            !formData.iconFile &&
                                <MdOutlineBrokenImage
                                    size={42}
                                    className="text-gray-700 m-auto dark:text-white"
                                />
                        }
                        {
                            formData.iconFile &&
                            <img
                                src={URL.createObjectURL(formData.iconFile)}
                                alt="Game Icon Preview"
                                className="rounded-md max-w-full max-h-none w-auto h-auto"
                            />
                        }
                        {
                            (mode === "edit" && !formData.iconFile && game?.iconPath) &&
                            <img
                                src={game.iconPath}
                                alt="Game Icon Preview"
                                className="rounded-md max-w-full max-h-none w-auto h-auto"
                            />
                        }
                    </div>
                    <div className="flex items-center gap-4 mt-16">
                        <div>
                            <label
                                htmlFor="game-card-image"
                                className="cursor-pointer"
                            >
                                <MdUploadFile size={28} className="dark:text-white" />
                            </label>
                            <input
                                type="file"
                                accept="image/png, image/jpeg, image/jpg"
                                id="game-card-image"
                                name="game-card-image"
                                hidden
                                onChange={handleCardIconFileChange}
                            />
                        </div>
                        <span className="dark:text-white">
                            Game Card Icon Image (optional) 480x720px
                        </span>
                    </div>
                    <div
                        className={clsx([
                            "w-60 h-90 my-4 border border-gray-600 rounded-md overflow-hidden",
                            !formData.cardIconFile && "flex justify-center items-center",
                            "dark:border-gray-300"
                        ])}
                    >
                        {
                            !formData.cardIconFile &&
                            <MdOutlineBrokenImage
                                size={72}
                                className="text-gray-700 m-auto dark:text-white"
                            />
                        }
                        {
                            formData.cardIconFile &&
                            <img
                                src={
                                    formData.cardIconFile
                                        ? URL.createObjectURL(formData.cardIconFile)
                                        : ''
                                }
                                alt="Game Card Icon Preview"
                                className="rounded-md max-w-full max-h-none w-auto h-auto"
                            />
                        }
                        {
                            (mode === "edit" && !formData.cardIconFile && game?.cardIconPath) &&
                            <img
                                src={game.cardIconPath}
                                alt="Game Icon Preview"
                                className="rounded-md max-w-full max-h-none w-auto h-auto"
                            />
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}