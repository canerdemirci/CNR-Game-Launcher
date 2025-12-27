import clsx from "clsx"
import { createPortal } from "react-dom"

export default function Modal({ children }: { children: React.ReactNode }) {
    return createPortal(
        (
            <div className={clsx([
                "fixed inset-0 z-50 flex items-center justify-center bg-black/10 backdrop-blur-lg"
            ])}>
                {children}
            </div>
        ),
        document.body
    )
}