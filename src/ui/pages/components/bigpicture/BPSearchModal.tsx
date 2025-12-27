import clsx from "clsx"
import Modal from "../../../components/Modal"
import Focusable from "./Focusable"
import { useEffect, useRef, useState } from "react"
import { MdSearch } from "react-icons/md"

interface Props {
    show: boolean
    focusIndex: string
    onSearch: (query: string) => void
}

export default function BPSearchModal({
    show,
    focusIndex,
    onSearch
}: Props) {
    const [_show, setShow] = useState<boolean>(show)

    const ref = useRef<HTMLInputElement>(null)
    
    useEffect(() => {
        setShow(show)

        if (show) {
            setTimeout(() => ref.current?.focus(), 10)
        }
    }, [show])

    function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
        e.stopPropagation()

        if (e.key === 'Enter') {
            onSearch(e.currentTarget.value)
        }

        if (e.key === 'Escape') {
            onSearch('')
        }
    }
    
    if (!_show) return null
    
    return (
        <Modal>
            <Focusable
                element="div"
                index="6"
                focusIndex={focusIndex}
                className={clsx([
                    "w-150 bg-black/50 backdrop-blur-sm shadow-xl rounded-lg text-xl",
                    "text-center",
                    "border border-y-white/35 border-x-white/25",
                ])}
                focusClasses={clsx([
                    "w-150 bg-black/50 backdrop-blur-sm shadow-xl rounded-lg text-xl",
                    "text-center",
                    "border border-y-white/35 border-x-white/25",
                ])}
            >
                <div
                    className="relative w-full h-full"
                >
                    <input
                        ref={ref}
                        type="text"
                        placeholder="Search: Type and ENTER"
                        className={clsx([
                            "text-white font-bold p-4 placeholder:text-white/50 w-full h-full",
                            "outline-none"
                        ])}
                        onKeyDown={handleKeyDown}
                    />
                    <MdSearch size={28} className="text-white/50 absolute right-3 top-3" />  
                </div>
            </Focusable>
        </Modal>
    )
}