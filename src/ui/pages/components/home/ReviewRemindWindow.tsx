import { useState } from "react"
import Button, { buttonStyleVariants } from "../../../form_elements/Button"
import { useWindowModal } from "../../../providers/WindowModalProvider"

export default function ReviewRemindWindow() {
    const { hideWindow } = useWindowModal()

    const [isAnswerNo, setIsAnswerNo] = useState(false)

    if (isAnswerNo) return (
        <div>
            <p className="mb-4 italic text-lg dark:text-gray-100">
                We're sorry to hear that. If you have a moment, please let us know what we can do 
                to improve the app.
            </p>
            <div className="flex justify-end gap-4">
                <Button
                    caption="Close"
                    styleVariant={buttonStyleVariants[1]}
                    onClick={() => {
                        hideWindow('no')
                    }}
                />
                <Button
                    caption="Mail Feedback"
                    styleVariant={buttonStyleVariants[1]}
                    onClick={() => {
                        hideWindow('mailfeedback')
                    }}
                />
            </div>
        </div>
    )
    
    if (!isAnswerNo) return (
        <div>
            <p className="mb-4 italic text-lg dark:text-gray-100">
                If you like using the app, would you mind taking a moment to rate it? Your feedback 
                helps us improve and reach more users.
            </p>
            <div className="flex justify-end gap-4">
                <Button
                    caption="Yes"
                    styleVariant={buttonStyleVariants[1]}
                    onClick={() => {
                        hideWindow('yes')
                    }}
                />
                <Button
                    caption="Not now"
                    styleVariant={buttonStyleVariants[1]}
                    onClick={() => {
                        hideWindow('notnow')
                    }}
                />
                <Button
                    caption="No"
                    styleVariant={buttonStyleVariants[1]}
                    onClick={() => {
                        setIsAnswerNo(true)
                    }}
                />
            </div>
        </div>
    )
}