import {
    MdAdd,
    MdArrowBack,
    MdFullscreen,
    MdFullscreenExit,
    MdOutlineMenu,
    MdSettings
} from "react-icons/md"
import { CgScreen } from "react-icons/cg"
import LogoutButton from "./LogoutButton"
import clsx from "clsx"
import ThemeSelector from "./ThemeSelector"
import { useNavigate } from "react-router-dom"
import { useAppContext } from "../providers/AppContextProvider"
import SelectBox, { Option, selectBoxStyleVariants } from "../form_elements/SelectBox"
import SearchBox, { searchBoxStyleVariants } from "./SearchBox"
import Filter, { FilterData } from "./Filter"
import ViewSelector, { ViewKind } from "./ViewSelector"

export enum AppbarButtons {
    BACK,
    LOGOUT,
    SETTINGS,
    COLLECTIONS,
    ADD,
    FULLSCREEN,
    TOOLBAR,
    BIGPICTURE,
}

export enum OrderTypes {
    ALPHABETIC,
    CREATEDAT,
    MOSTPLAYED,
    RECENTLYPLAYED
}

const orderTypes = [
    {
        key: OrderTypes.ALPHABETIC,
        caption: 'Alphabetic'
    },
    {
        key: OrderTypes.CREATEDAT,
        caption: 'Created Date'
    },
    {
        key: OrderTypes.MOSTPLAYED,
        caption: 'Most Played'
    },
    {
        key: OrderTypes.RECENTLYPLAYED,
        caption: 'Recently Played'
    }
]

export interface AppHeaderProps {
    pageTitle?: string
    excludedButtons: AppbarButtons[]
    onCollectionsClick?: () => void
    toolbarProps?: {
        defaultViewStyle: ViewKind
        defaultFilterData: FilterData
        filterData: FilterData
        onChangeView: (view: ViewKind) => void
        onChangeOrder: (option: Option) => void
        onChangeFilter: (filters: FilterData) => void
        onChangeSearch: (query: string) => void
    }
}

export function AppHeader({
    pageTitle,
    excludedButtons,
    toolbarProps,
    onCollectionsClick,
}: AppHeaderProps) {
    const navigate = useNavigate()
    const appContext = useAppContext()

    const orderDefaultOption = {
        caption: orderTypes[0].caption,
        value: orderTypes[0].key,
        direction: 'ascending'
    } as Option

    function handleSettingsClick() {
        navigate('/settings')
    }

    function handleFullscreenClick() {
        window.electron.app.toggleFullscreen()
    }

    function handleAddClick() {
        navigate('/addgame')
    }

    function handleBigPictureClick() {
        if (!appContext.isFullscreen) {
            window.electron.app.toggleFullscreen()
        }
        
        navigate('/bigpicture')
    }

    function FullscreenToggleButton() {
        const props = {
            size: 28,
            className: clsx([
                "text-sky-700", "cursor-pointer",
                "hover:opacity-75",
                "dark:text-white/75"
            ]),
            onClick: handleFullscreenClick
        }
        
        return appContext.isFullscreen ?
            <MdFullscreenExit {...props} /> :
                <MdFullscreen {...props} />
    }

    return (
        <header
            className={clsx([
                "h-15 px-4", "flex justify-between items-center gap-8",
                "bg-linear-to-r", "from-blue-200", "to-purple-200",
                "border-b-2 border-purple-300",
                "dark:from-blue-950 dark:via-pink-800 dark:to-purple-800",
                "dark:border-white/10",
            ])}
        >
            <div className="flex items-center gap-4">
                {
                    !excludedButtons.includes(AppbarButtons.BACK) &&
                        <MdArrowBack
                            size={28}
                            className={clsx([
                                "text-black", "cursor-pointer",
                                "hover:opacity-75",
                                "dark:text-white/75"
                            ])}
                            onClick={() => navigate(-1)}
                        />
                }
                {
                    !excludedButtons.includes(AppbarButtons.COLLECTIONS) &&
                        <MdOutlineMenu
                            size={28}
                            className={clsx([
                                "text-teal-700", "cursor-pointer",
                                "hover:opacity-75",
                                "dark:text-white/75"
                            ])}
                            onClick={onCollectionsClick}
                        />
                }
                {
                    !excludedButtons.includes(AppbarButtons.SETTINGS) &&
                        <MdSettings
                            size={28}
                            className={clsx([
                                "text-pink-500", "cursor-pointer",
                                "hover:opacity-75",
                                "dark:text-white/75"
                            ])}
                            onClick={handleSettingsClick}
                        />
                }
                {
                    !excludedButtons.includes(AppbarButtons.ADD) &&
                        <MdAdd
                            size={28}
                            className={clsx([
                                "text-purple-500", "cursor-pointer",
                                "hover:opacity-75",
                                "dark:text-white/75"
                            ])}
                            onClick={handleAddClick}
                        />
                }
                {
                    !excludedButtons.includes(AppbarButtons.FULLSCREEN) &&
                        <FullscreenToggleButton />
                }
                {
                    pageTitle && <h1 className="text-lg text-purple-900 dark:text-white">
                        {pageTitle}
                    </h1>
                }
            </div>
            {
                !excludedButtons.includes(AppbarButtons.TOOLBAR) &&
                <div
                    className={clsx([
                        "flex justify-between w-full items-center mx-4"
                    ])}
                >
                    <SelectBox
                        styleVariant={selectBoxStyleVariants[0]}
                        caption="Order by"
                        options={orderTypes.map(ot => ({
                            caption: ot.caption,
                            value: ot.key,
                            direction: 'ascending'
                        }))}
                        defaultOption={orderDefaultOption}
                        onChange={toolbarProps!.onChangeOrder}
                    />
                    <SearchBox
                        styleVariant={searchBoxStyleVariants[0]}
                        onChange={toolbarProps!.onChangeSearch}
                    />
                    <div className="flex items-center gap-4">
                        <Filter
                            defaultFilterData={toolbarProps!.defaultFilterData}
                            filterData={toolbarProps!.filterData}
                            onChange={toolbarProps!.onChangeFilter}
                        />
                        <ViewSelector
                            viewKind={toolbarProps!.defaultViewStyle}
                            onChange={toolbarProps!.onChangeView}
                        />
                        {!excludedButtons.includes(AppbarButtons.BIGPICTURE) && <div
                            onClick={handleBigPictureClick}
                        >
                            <CgScreen
                                size={28}
                                className={clsx([
                                    "text-teal-500", "cursor-pointer",
                                    "hover:opacity-75",
                                    "dark:text-white/75"
                                ])}
                            />
                        </div>}
                    </div>
                </div>
            }
            <div className="flex items-center gap-4">
                <ThemeSelector />
                { !excludedButtons.includes(AppbarButtons.LOGOUT) && <LogoutButton /> }
            </div>
        </header>
    )
}