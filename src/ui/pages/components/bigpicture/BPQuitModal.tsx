import clsx from "clsx"
import Modal from "../../../components/Modal"
import Focusable from "./Focusable"
import { useEffect, useState } from "react"

interface Props {
    show: boolean
    focusIndex: string
}

export default function BPQuitModal({
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
            <Focusable
                element="div"
                index="5"
                focusIndex={focusIndex}
                className={clsx([
                    "w-150 p-8 bg-black/50 backdrop-blur-sm shadow-xl rounded-lg",
                    "flex flex-col items-center gap-4",
                    "border border-y-white/35 border-x-white/25",
                    "text-xl text-white"
                ])}
                focusClasses={clsx([
                    "w-150 p-8 bg-black/50 backdrop-blur-sm shadow-xl rounded-lg",
                    "flex flex-col items-center gap-4",
                    "border border-y-white/35 border-x-white/25",
                    "text-xl text-white"
                ])}
            >
                <h1 className="text-2xl font-bold text-center mb-4">
                    Quit from the app or back to normal mode.
                </h1>

                <Focusable
                    element="div"
                    index="5.1"
                    focusIndex={focusIndex}
                    className={clsx([
                        "w-80 p-4 rounded-lg border border-white/25 bg-black",
                        "text-white text-center"
                    ])}
                    focusClasses={clsx([
                        "w-80 p-4 rounded-lg border border-black/75 bg-white",
                        "text-black text-center",
                        "animate-pulse"
                    ])}
                >
                    CANCEL
                </Focusable>
                <Focusable
                    element="div"
                    index="5.2"
                    focusIndex={focusIndex}
                    className={clsx([
                        "w-80 p-4 rounded-lg border border-white/25 bg-black",
                        "text-white text-center"
                    ])}
                    focusClasses={clsx([
                        "w-80 p-4 rounded-lg border border-black/75 bg-white",
                        "text-black text-center",
                        "animate-pulse"
                    ])}
                >
                    HELP (CONTROLS)
                </Focusable>
                <Focusable
                    element="div"
                    index="5.3"
                    focusIndex={focusIndex}
                    className={clsx([
                        "w-80 p-4 rounded-lg border border-white/25 bg-black",
                        "text-white text-center"
                    ])}
                    focusClasses={clsx([
                        "w-80 p-4 rounded-lg border border-black/75 bg-white",
                        "text-black text-center",
                        "animate-pulse"
                    ])}
                >
                    BACK TO NORMAL MODE
                </Focusable>
                <Focusable
                    element="div"
                    index="5.4"
                    focusIndex={focusIndex}
                    className={clsx([
                        "w-80 p-4 rounded-lg border border-white/25 bg-black",
                        "text-white text-center"
                    ])}
                    focusClasses={clsx([
                        "w-80 p-4 rounded-lg border border-black/75 bg-white",
                        "text-black text-center",
                        "animate-pulse"
                    ])}
                >
                    QUIT
                </Focusable>
            </Focusable>
        </Modal>
    )
}