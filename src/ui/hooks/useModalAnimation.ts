import { AnimationDefinition } from "motion"
import { useAnimation } from "motion/react"

const openAnim: AnimationDefinition = {
    opacity: [0, 1],
    y: [-100, 25, 0],
    transition: {
        duration: 0.3,
    }
}
const closeAnim: AnimationDefinition = {
    opacity: [1, 0],
    y: [0, 25, -300],
    transition: {
        duration: 0.3,
    }
}

export function useModalAnimation() {
    const animController = useAnimation()

    function start(kind: 'open' | 'close'): Promise<any> {
        return animController.start(kind === 'open' ? openAnim : closeAnim)
    }

    return { animController, start }
}