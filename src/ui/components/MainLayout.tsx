import clsx from "clsx"

interface Props {
    children: React.ReactNode
}

export function MainLayout({
    children
}: Props) {
    return (
        <main
            className={clsx([
                "w-full", "h-full", "overflow-hidden",
                "bg-linear-to-br", "from-gray-100", "to-white",
                "dark:bg-linear-to-br", "dark:from-gray-800", "dark:to-gray-950"
            ])}
        >
            {children}
        </main>
    )
}