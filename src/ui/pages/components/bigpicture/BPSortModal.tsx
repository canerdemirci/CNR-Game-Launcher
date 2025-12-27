import clsx from "clsx"
import Modal from "../../../components/Modal"
import Focusable from "./Focusable"
import { useEffect, useState } from "react"
import { MdOutlineArrowDownward, MdOutlineArrowUpward } from "react-icons/md"
import { OrderTypes } from "../../../components/AppHeader"

interface Props {
    show: boolean
    focusIndex: string
    sortData: {
        sortType: OrderTypes
        direction: "ascending" | "descending"
    }
}

export default function BPSortModal({
    show,
    focusIndex,
    sortData
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
                index="7"
                focusIndex={focusIndex}
                className={clsx([
                    "w-100 p-8 bg-black/50 backdrop-blur-sm shadow-xl rounded-lg",
                    "flex flex-col items-center gap-4",
                    "border border-y-white/35 border-x-white/25",
                    "text-xl text-white"
                ])}
                focusClasses={clsx([
                    "w-100 p-8 bg-black/50 backdrop-blur-sm shadow-xl rounded-lg",
                    "flex flex-col items-center gap-4",
                    "border border-y-white/35 border-x-white/25",
                    "text-xl text-white"
                ])}
            >
                <h1 className="text-2xl font-bold text-center mb-4">
                    Sort Games
                </h1>

                <Focusable
                    element="div"
                    index="7.1"
                    focusIndex={focusIndex}
                    className={clsx([
                        "w-80 p-4 rounded-lg border border-white/25 bg-black",
                        "text-white text-center",
                        "flex items-center justify-between"
                    ])}
                    focusClasses={clsx([
                        "w-80 p-4 rounded-lg border border-black/75 bg-white",
                        "text-black text-center",
                        "animate-pulse",
                        "flex items-center justify-between"
                    ])}
                >
                    <span>ALPHABETIC</span>
                    {
                        sortData.sortType === OrderTypes.ALPHABETIC
                            && (sortData.direction === 'ascending'
                                ? <MdOutlineArrowUpward size={20} />
                                : <MdOutlineArrowDownward size={20} />)
                    }
                </Focusable>
                <Focusable
                    element="div"
                    index="7.2"
                    focusIndex={focusIndex}
                    className={clsx([
                        "w-80 p-4 rounded-lg border border-white/25 bg-black",
                        "text-white text-center",
                        "flex items-center justify-between"
                    ])}
                    focusClasses={clsx([
                        "w-80 p-4 rounded-lg border border-black/75 bg-white",
                        "text-black text-center",
                        "animate-pulse",
                        "flex items-center justify-between"
                    ])}
                >
                    <span>CREATED DATE</span>
                    {
                        sortData.sortType === OrderTypes.CREATEDAT
                            && (sortData.direction === 'ascending'
                                ? <MdOutlineArrowUpward size={20} />
                                : <MdOutlineArrowDownward size={20} />)
                    }
                </Focusable>
                <Focusable
                    element="div"
                    index="7.3"
                    focusIndex={focusIndex}
                    className={clsx([
                        "w-80 p-4 rounded-lg border border-white/25 bg-black",
                        "text-white text-center",
                        "flex items-center justify-between"
                    ])}
                    focusClasses={clsx([
                        "w-80 p-4 rounded-lg border border-black/75 bg-white",
                        "text-black text-center",
                        "animate-pulse",
                        "flex items-center justify-between"
                    ])}
                >
                    <span>MOST PLAYED</span>
                    {
                        sortData.sortType === OrderTypes.MOSTPLAYED
                            && (sortData.direction === 'ascending'
                                ? <MdOutlineArrowUpward size={20} />
                                : <MdOutlineArrowDownward size={20} />)
                    }
                </Focusable>
                <Focusable
                    element="div"
                    index="7.4"
                    focusIndex={focusIndex}
                    className={clsx([
                        "w-80 p-4 rounded-lg border border-white/25 bg-black",
                        "text-white text-center",
                        "flex items-center justify-between"
                    ])}
                    focusClasses={clsx([
                        "w-80 p-4 rounded-lg border border-black/75 bg-white",
                        "text-black text-center",
                        "animate-pulse",
                        "flex items-center justify-between"
                    ])}
                >
                    <span>RECENTLY PLAYED</span>
                    {
                        sortData.sortType === OrderTypes.RECENTLYPLAYED
                            && (sortData.direction === 'ascending'
                                ? <MdOutlineArrowUpward size={20} />
                                : <MdOutlineArrowDownward size={20} />)
                    }
                </Focusable>
            </Focusable>
        </Modal>
    )
}