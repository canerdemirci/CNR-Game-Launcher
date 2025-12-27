import clsx from "clsx"
import Modal from "../../../components/Modal"
import Focusable from "./Focusable"
import { useEffect, useState } from "react"

interface Props {
    show: boolean
    message: string
    focusIndex: string
    closeButton?: boolean
}

export default function BPMessageModal({
    show,
    message,
    focusIndex,
    closeButton = true
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
                    closeButton && ["flex flex-col items-center gap-8"],
                    "w-150 p-8 bg-black/50 backdrop-blur-sm shadow-xl rounded-lg text-xl",
                    "text-center",
                    "border border-y-white/35 border-x-white/25",
                ])}
            >
                <p
                    className="text-white font-bold"
                >
                    {message}
                </p>
                {
                    closeButton &&
                        <Focusable
                            element="div"
                            index="3"
                            focusIndex={focusIndex}
                            className={
                                "p-4 rounded-lg border border-white/25 bg-black text-white"
                            }
                            focusClasses={clsx([
                                "p-4 rounded-lg border border-black/75 bg-white text-black",
                                "animate-pulse"
                            ])}
                        >
                            CLOSE
                        </Focusable>
                }
            </div>
        </Modal>
    )
}