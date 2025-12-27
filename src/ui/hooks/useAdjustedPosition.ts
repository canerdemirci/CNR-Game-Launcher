import { useEffect, useState } from "react"

export function useAdjustedPosition(
    ref: React.RefObject<HTMLElement | null>,
    position: { x: number, y: number }
) {
    const [adjustedPosition, setAdjustedPosition] = useState<{ x: number, y: number }>(
        { x: 0, y: 0 }
    )

    useEffect(() => {
        if (ref.current) {
            const rect = ref.current.getBoundingClientRect()
            
            let newPos = { x: position.x, y: position.y }

            if (newPos.x >= window.innerWidth - (rect?.width + 10)) {
                newPos.x = window.innerWidth - (rect?.width + 10)
            }

            if (newPos.y >= window.innerHeight - (rect?.height + 10)) {
                newPos.y = window.innerHeight - (rect?.height + 10)
            }

            setAdjustedPosition(newPos)
        }
    }, [position])

    return { adjustedPosition }
}