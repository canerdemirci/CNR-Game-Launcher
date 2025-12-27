import clsx from "clsx"
import { motion, useAnimation } from "motion/react"
import { useEffect, useRef, useState } from "react"

interface Props {
    onLogin: () => void
}

var userInput: string[] = []

export default function PinBox({ onLogin }: Props) {
    const inputRefs = useRef<HTMLInputElement[]>([])
    const animControls = useAnimation()
    
    const [appPin, setAppPin] = useState<string[]>([])
    const [disabledList, setDisabledList] = useState<number[]>([])
    const [isPinTrue, setIsPinTrue] = useState<boolean | 'checking'>('checking')

    useEffect(() => {
        window.electron.userPreferences.get()
            .then(userPrefs => {
                if (userPrefs && userPrefs.pinCode) {
                    const pinArr = Array.from(userPrefs.pinCode)
                    setAppPin(pinArr)
                    userInput = new Array(pinArr.length).fill('')
                    setTimeout(() => inputRefs.current[0]?.focus(), 10)
                }
            })
    }, [])

    useEffect(() => {
        if (isPinTrue === true || isPinTrue === false) {
            setDisabledList([...Array(appPin.length).keys()])
            animControls.start({
                scale: [0.7, 1, 0.7, 1],
                opacity: [0.7, 1, 0.7, 1],
                transition: { duration: 0.5 }
            }).then(() => {
                if (isPinTrue) {
                    onLogin()
                }
                
                setIsPinTrue('checking')
                setDisabledList([])
                setTimeout(() => inputRefs.current[0]?.focus(), 10)
            })
        }
    }, [isPinTrue, animControls])
    
    function handleOnChange(char: string, index: number) {
        if (!char) return

        setDisabledList([...disabledList, index])
        userInput[index] = char
        
        inputRefs.current[index].value = ''
        inputRefs.current[index + 1]?.focus()

        if (index === appPin.length - 1) {
            if (userInput.join() !== appPin.join()) {
                setIsPinTrue(false)
            } else {
                setIsPinTrue(true)
            }
        }
    }

    if (appPin.length === 0) return null

    return (
        <div
            className={clsx([
                "p-4", "flex", "items-center", "justify-center", "gap-2"
            ])}
        >
            {appPin.map((_, i) => {
                return <motion.input
                    key={i}
                    ref={el => {
                        if (el) {
                            inputRefs.current[i] = el
                        }
                    }}
                    tabIndex={i}
                    type="password"
                    maxLength={1}
                    disabled={disabledList.includes(i)}
                    className={clsx([
                        "border", "border-gray-500", "rounded-lg", "font-bold", "text-xl",
                        "text-center", "w-10", "h-10",

                        "focus:outline-2",
                        "focus:outline-black",
                        
                        "focus:dark:outline-amber-200",

                        isPinTrue === true && [
                            "disabled:bg-green-500", "disabled:dark:bg-green-500",
                            "disabled:dark:border-0"
                        ],
                        isPinTrue === false && [
                            "disabled:bg-red-500", "disabled:dark:bg-red-500",
                            "disabled:dark:border-0"
                        ],
                        isPinTrue === 'checking' && [
                            "disabled:bg-yellow-500", "disabled:text-yellow-500",
                            "disabled:border-0",

                            "disabled:dark:bg-yellow-500", "disabled:dark:text-yellow-500",
                            "disabled:dark:border-yellow-700",
                        ]
                    ])}
                    animate={animControls}
                    onChange={(e) => handleOnChange(e.target.value, i)}
                />
            })}
        </div>
    )
}