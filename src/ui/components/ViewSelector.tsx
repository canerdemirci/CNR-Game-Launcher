import { useState } from "react"
import { MdGridView, MdViewList, MdViewModule } from "react-icons/md"

interface Props {
    viewKind?: ViewKind
    onChange: (view: ViewKind) => void
}

export type ViewKind = 'list' | 'icon' | 'card'

export default function ViewSelector({
    viewKind = 'card',
    onChange
}: Props) {
    const [internalViewKind, setInternalViewKind] = useState<ViewKind>(viewKind)
    
    const props = {
        size: 28,
        className: "text-blue-800 dark:text-white/75 cursor-pointer hover:opacity-75"
    }

    function handleClick() {
        const choose = (prev: ViewKind): ViewKind => {
            if (prev === 'list') {
                return 'icon'
            } else if (prev === 'icon') {
                return 'card'
            } else {
                return 'list'
            }
        }

        setInternalViewKind(prev => choose(prev))
        onChange(choose(internalViewKind))
    }
    
    switch(internalViewKind) {
        case 'list': return <MdViewList onClick={handleClick} {...props} />
        case 'icon': return <MdGridView onClick={handleClick} {...props} />
        case 'card': return <MdViewModule onClick={handleClick} {...props} />
        default: return null
    }
}