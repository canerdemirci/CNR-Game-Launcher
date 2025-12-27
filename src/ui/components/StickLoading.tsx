import { motion } from "motion/react"

export default function StickLoading() {
    return (
        <div className="flex justify-center items-center gap-2">
            {[0, 1, 2].map((x, i) => <motion.div
                key={i}
                className="w-6 h-12 bg-gray-800 rounded-sm dark:bg-yellow-500"
                initial={{
                    width: 10,
                    height: 20
                }}
                animate={{
                    opacity: [0.5, 1, 0.5, 1],
                    height: [10, 30, 10, 30]
                }}
                transition={{ duration: 1, repeat: Infinity, repeatType: 'reverse', delay: x * 0.5 }}
            />)}
        </div>
    )
}