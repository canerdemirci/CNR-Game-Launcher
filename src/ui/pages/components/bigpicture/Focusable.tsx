import { createElement, JSX, ReactNode, useEffect, useRef } from "react"
import { ButtonName } from "../../../hooks/useGamepad"

export type KeyOrButton = {
    key?: string
    button?: ButtonName
    stick?: 'left' | 'right'
    direction?: 'up' | 'down' | 'left' | 'right'
}

export interface FocusableProps<T extends keyof JSX.IntrinsicElements> {
    element: T
    index: string
    focusIndex: string
    focusClasses: string
    focusOnScroll?: {
        behavior: "auto" | "smooth" | "instant",
        block: "center" | "end" | "nearest" | "start"
    }
    children?: ReactNode
    className?: string
    [key: string]: any
}

export default function Focusable<T extends keyof JSX.IntrinsicElements>({
    element,
    index,
    focusIndex,
    focusClasses,
    focusOnScroll = undefined,
    children,
    className,
    ...props
}: FocusableProps<T>) {
    const ref = useRef<JSX.IntrinsicElements[T] extends React.DetailedHTMLProps<infer P, any> 
        ? P extends React.HTMLAttributes<infer E> 
            ? E 
            : HTMLElement 
        : HTMLElement>(null)
    
    useEffect(() => {
        if (focusOnScroll && focusIndex === index && ref.current) {
            ref.current.scrollIntoView({ 
                behavior: focusOnScroll.behavior,
                block: focusOnScroll.block
            })
        }
    }, [focusOnScroll, focusIndex, index])
    
    return createElement(
        element,
        {
            ref: ref,
            key: index,
            className: focusIndex === index ? focusClasses : className,
            ...props
        },
        children
    )
}