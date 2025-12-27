import { MdLogout } from "react-icons/md"
import { useAppContext } from "../providers/AppContextProvider"
import { saveUserPreferencesOnExit, setWindowsBootStartOption } from "../lib"

export default function LogoutButton() {
    const appContext = useAppContext()

    return (
        <MdLogout
            size={28}
            className="text-red-600 dark:text-white/75 cursor-pointer hover:opacity-75"
            onClick={() => {
                saveUserPreferencesOnExit(
                    appContext.sideMenuCollapsed,
                    appContext.gameViewKind,
                    appContext.theme
                )
                setWindowsBootStartOption(appContext.startOnWindowsBoot)
                window.electron.app.quit()
            }}
        />
    )
}