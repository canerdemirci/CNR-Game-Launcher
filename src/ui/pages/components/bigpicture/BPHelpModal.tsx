import clsx from "clsx"
import Modal from "../../../components/Modal"
import Focusable from "./Focusable"
import { useEffect, useState } from "react"
import KeyButtonImage from "./KeyButtonImage"

interface Props {
    show: boolean
    focusIndex: string
}

export default function BPHelpModal({
    show,
    focusIndex,
}: Props) {
    const [_show, setShow] = useState<boolean>(show)
    
    useEffect(() => {
        setShow(show)
    }, [show])
    
    if (!_show) return null
    
    return (
        <Modal>
            <div
                className={clsx([
                    "w-250 p-8 bg-black/50 backdrop-blur-sm shadow-xl rounded-lg",
                    "flex flex-col gap-8",
                    "border border-y-white/35 border-x-white/25",
                    "text-xl text-white"
                ])}
            >
                <h1 className="text-2xl font-bold">
                    Navigation
                </h1>
                <div className="flex items-center gap-3">
                    <KeyButtonImage sprite="UP" className="scale-75" />
                    <KeyButtonImage sprite="DOWN" className="scale-75" />
                    <KeyButtonImage sprite="LEFT" className="scale-75" />
                    <KeyButtonImage sprite="RIGHT" className="scale-75" />
                    <KeyButtonImage sprite="D_UP" className="scale-75" />
                    <KeyButtonImage sprite="D_DOWN" className="scale-75" />
                    <KeyButtonImage sprite="D_LEFT" className="scale-75" />
                    <KeyButtonImage sprite="D_RIGHT" className="scale-75" />
                    <KeyButtonImage sprite="LS" />
                </div>

                <div className="flex items-start justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">
                            Toggle Collections
                        </h1>
                        <div className="flex items-center gap-4">
                            <KeyButtonImage sprite="TAB" className="scale-75" />
                            <KeyButtonImage sprite="LB" className="scale-75" />
                        </div>
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold">
                            Run / Select / Accept
                        </h1>
                        <div className="flex items-center gap-4">
                            <KeyButtonImage sprite="ENTER" className="scale-75"  />
                            <KeyButtonImage sprite="XBOX_A" className="scale-75"  />
                        </div>
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold">
                            Back / Close / Cancel
                        </h1>
                        <div className="flex items-center gap-4">
                            <KeyButtonImage sprite="ESC" className="scale-75" />
                            <KeyButtonImage sprite="XBOX_B" className="scale-75" />
                        </div>
                    </div>
                </div>

                <div className="flex items-start justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">
                            Search
                        </h1>
                        <div className="flex items-center justify-start gap-2">
                            <KeyButtonImage sprite="SPACE" className="scale-75" />
                            <KeyButtonImage sprite="OPTIONS" />
                        </div>
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold">
                            Sort
                        </h1>
                        <div className="flex items-center justify-start gap-2">
                            <KeyButtonImage sprite="SHIFT" className="scale-75" />
                            <KeyButtonImage sprite="LT" className="scale-75" />
                        </div>
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold">
                            Quit Menu (Back Home, Help, Quit)
                        </h1>
                        <div className="flex items-center justify-start gap-2">
                            <KeyButtonImage sprite="ESC" className="scale-75" />
                            <KeyButtonImage sprite="START" className="scale-75" />
                        </div>
                    </div>
                </div>

                <div className="flex items-start justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">
                            Display All Games (Clear filter)
                        </h1>
                        <div className="flex items-center justify-start gap-2">
                            <KeyButtonImage sprite="A" className="scale-75" />
                            <KeyButtonImage sprite="RB" className="scale-75" />
                        </div>
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold">
                            Display Most Played Games
                        </h1>
                        <div className="flex items-center justify-start gap-2">
                            <KeyButtonImage sprite="M" className="scale-75" />
                            <KeyButtonImage sprite="XBOX_Y" className="scale-75" />
                        </div>
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold">
                            Display New Games
                        </h1>
                        <div className="flex items-center justify-start gap-2">
                            <KeyButtonImage sprite="N" className="scale-75" />
                            <KeyButtonImage sprite="XBOX_X" className="scale-75" />
                        </div>
                    </div>
                </div>

                {/* CLOSE BUTTON */}
                <Focusable
                    element="div"
                    index="4"
                    focusIndex={focusIndex}
                    className={
                        "p-4 m-auto mt-8 rounded-lg border border-white/25 bg-black text-white"
                    }
                    focusClasses={clsx([
                        "p-4 m-auto mt-8 rounded-lg border border-black/75 bg-white text-black",
                        "animate-pulse"
                    ])}
                >
                    CLOSE
                </Focusable>
            </div>
        </Modal>
    )
}