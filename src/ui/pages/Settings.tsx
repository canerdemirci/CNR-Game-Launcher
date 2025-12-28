import clsx from "clsx"
import { useEffect, useState } from "react"
import CheckBox, { checkBoxStyleVariants } from "../form_elements/CheckBox"
import PasswordInput, { passwordInputStyleVariants } from "../form_elements/PasswordInput"
import Button, { buttonStyleVariants } from "../form_elements/Button"
import { MainLayout } from "../components/MainLayout"
import { AppbarButtons } from "../components/AppHeader"
import { useMessageModal } from "../providers/MessageModalProvider"
import { useAppContext } from "../providers/AppContextProvider"
import StickLoading from "../components/StickLoading"
import { useAppData } from "../providers/DataProvider"

function FormGroup({
    labelText, children
}: { labelText: string, children: React.ReactNode }) {
    return (
        <div
            className={clsx([
                "flex", "flex-col", "gap-4",
                "relative", "p-8", "my-4", "border", "border-gray-300", "rounded-lg",
                "dark:border-gray-700"
            ])}
        >
            <h5
                className={clsx([
                    "absolute", "-top-3.5", "left-8", "bg-white", "text-gray-600",
                    "dark:text-gray-400", "dark:bg-gray-700 dark:rounded-lg"
                ])}
            >{labelText}</h5>
            {children}
        </div>
    )
}

function PinUpdateGroup({
    loginWithPin,
    existingPinCode,
    pinCreateSuccess,
    oldPinCode,
    newPinCode,
    verifyNewPinCode,
    pinUpdateError,
    handleOldPinCodeChange,
    handleNewPinCodeChange,
    handleVerifyNewPinCodeChange,
    handleSaveNewPin
}: {
    loginWithPin: boolean,
    existingPinCode?: string,
    pinCreateSuccess: boolean,
    oldPinCode: string,
    newPinCode: string,
    verifyNewPinCode: string,
    pinUpdateError: boolean,
    handleOldPinCodeChange: (value: string) => void,
    handleNewPinCodeChange: (value: string) => void,
    handleVerifyNewPinCodeChange: (value: string) => void,
    handleSaveNewPin: () => void
}) {
    if ((loginWithPin && existingPinCode) || (loginWithPin && pinCreateSuccess)) {
        return (
            <FormGroup labelText="&nbsp;Update the pin code&nbsp;">
                <div>
                    <PasswordInput
                        id="old-pin-code"
                        styleVariant={passwordInputStyleVariants[1]}
                        labelText="Input your present pin code&nbsp;"
                        minLength={6}
                        maxLength={10}
                        value={oldPinCode}
                        onChange={handleOldPinCodeChange}
                    />
                </div>
                <div>
                    <PasswordInput
                        id="new-pin-code"
                        styleVariant={passwordInputStyleVariants[1]}
                        labelText="Input your new pin code (6-10 characters)&nbsp;"
                        minLength={6}
                        maxLength={10}
                        value={newPinCode}
                        onChange={handleNewPinCodeChange}
                    />
                </div>
                <div>
                    <PasswordInput
                        id="verify-new-pin-code"
                        styleVariant={passwordInputStyleVariants[1]}
                        labelText="Verify your new pin code&nbsp;"
                        minLength={6}
                        maxLength={10}
                        value={verifyNewPinCode}
                        onChange={handleVerifyNewPinCodeChange}
                    />
                </div>
                <div>
                    <Button
                        caption="SAVE NEW PIN"
                        styleVariant={buttonStyleVariants[1]}
                        onClick={handleSaveNewPin}
                    />
                </div>
                {pinUpdateError && <div className="text-md text-red-500">
                    (!) Incorrect password. Don't include space and make it 6-10 characters and 
                    same pin and verify pin codes.
                </div>}
            </FormGroup>
        )
    }

    return null
}

function PinCreateGroup({
    pinCreateSuccess,
    pinCreateError,
    loginWithPin,
    existingPinCode,
    pinCode,
    verifyPinCode,
    handlePinCodeChange,
    handleVerifyPinCodeChange,
    handleSavePin
}:{
    pinCreateSuccess: boolean,
    pinCreateError: boolean,
    loginWithPin: boolean,
    existingPinCode?: string,
    pinCode: string,
    verifyPinCode: string,
    handlePinCodeChange: (value: string) => void,
    handleVerifyPinCodeChange: (value: string) => void,
    handleSavePin: () => void
}) {
    if (pinCreateSuccess) return null

    if (loginWithPin && !existingPinCode) {
        return (
            <FormGroup labelText="&nbsp;Set a pin code&nbsp;">
                <div>
                    <PasswordInput
                        id="pin-code"
                        styleVariant={passwordInputStyleVariants[1]}
                        labelText="Pin Code (6-10 characters)&nbsp;"
                        minLength={6}
                        maxLength={10}
                        value={pinCode}
                        onChange={handlePinCodeChange}
                    />
                </div>
                <div>
                    <PasswordInput
                        id="verify-pin-code"
                        styleVariant={passwordInputStyleVariants[1]}
                        labelText="Verify Pin Code (6-10 characters)&nbsp;"
                        minLength={6}
                        maxLength={10}
                        value={verifyPinCode}
                        onChange={handleVerifyPinCodeChange}
                    />
                </div>
                <div>
                    <Button
                        caption="SAVE PIN"
                        styleVariant={buttonStyleVariants[1]}
                        onClick={handleSavePin}
                    />
                </div>
                {pinCreateError && <div className="text-md text-red-500">
                    (!) Incorrect password. Don't include space and make it 6-10 characters and 
                    same pin and verify pin codes.
                </div>}
            </FormGroup>
        )
    }

    return null
}

export default function Settings() {
    const appContext = useAppContext()
    const { showMessage } = useMessageModal()
    const appData = useAppData()

    useEffect(() => {
        appContext.setAppHeaderProps({
            pageTitle: "Settings",
            excludedButtons: [
                AppbarButtons.ADD, AppbarButtons.SETTINGS, AppbarButtons.COLLECTIONS,
                AppbarButtons.TOOLBAR
            ]
        })
    }, [])
    
    const [pinCreateError, setPinCreateError] = useState<boolean>(false)
    const [pinCreateSuccess, setPinCreateSuccess] = useState<boolean>(false)
    const [pinUpdateError, setPinUpdateError] = useState<boolean>(false)
    const [pinCode, setPinCode] = useState<string>('')
    const [oldPinCode, setOldPinCode] = useState<string>('')
    const [newPinCode, setNewPinCode] = useState<string>('')
    const [verifyPinCode, setVerifyPinCode] = useState<string>('')
    const [verifyNewPinCode, setVerifyNewPinCode] = useState<string>('')
    const [backupProcessing, setBackupProcessing] = useState<boolean>(false)
    
    function handleLoginWithPinChange(check: boolean) {
        appContext.setLoginWithPin(check)
    }

    function handleShowOnlyInstalledChange(check: boolean) {
        appContext.setShowOnlyInstalledGamesAsDefault(check)
    }

    function handleOpenBigPictureModeChange(check: boolean) {
        appContext.setOpenBigPictureMode(check)
    }

    function handleStartOnWindowsBootChange(check: boolean) {
        appContext.setStartOnWindowsBoot(check)
    }

    function handlePinCodeChange(value: string) {
        setPinCode(value)
    }

    function handleNewPinCodeChange(value: string) {
        setNewPinCode(value)
    }

    function handleOldPinCodeChange(value: string) {
        setOldPinCode(value)
    }

    function handleVerifyPinCodeChange(value: string) {
        setVerifyPinCode(value)
    }

    function handleVerifyNewPinCodeChange(value: string) {
        setVerifyNewPinCode(value)
    }

    // Save settings
    function handleSave() {
        window.electron.userPreferences.set({
            loginWithPin: appContext.loginWithPin,
            openBigpictureMode: appContext.openBigPictureMode,
            startOnWindowsBoot: appContext.startOnWindowsBoot,
            showOnlyInstalledGamesAsDefault: appContext.showOnlyInstalledGamesAsDefault
        })

        showMessage(
            "User Preferences",
            "Your preferences saved.",
            "info",
        )
    }

    // Save only pin code (If there's no any pin code)
    function handleSavePin() {
        if (
            !pinCode.includes(' ') &&
            pinCode === verifyPinCode &&
            pinCode.length > 5 &&
            pinCode.length < 11
        ) {
            setPinCreateError(false)
            setPinCreateSuccess(true)

            window.electron.userPreferences.set({ pinCode: pinCode, loginWithPin: true })

            showMessage(
                "Pin setting",
                "Your pin code is setted.",
                "info"
            )
        } else {
            setPinCreateError(true)
        }
    }

    // Save new pin code (updating)
    function handleSaveNewPin() {
        if (
            !newPinCode.includes(' ') &&
            oldPinCode === appContext.userPreferences?.pinCode &&
            newPinCode === verifyNewPinCode &&
            newPinCode.length > 5 &&
            newPinCode.length < 11
        ) {
            setPinUpdateError(false)

            window.electron.userPreferences.set({ pinCode: newPinCode })

            showMessage(
                "Pin Updating",
                "Your pin code is updated.",
                "info"
            )
        } else {
            setPinUpdateError(true)
        }
    }

    function handleBackup() {
        setBackupProcessing(true)
        window.electron.app.backup()
            .then(res => {
                if (res == 'completed') {
                    showMessage(
                        'Backup Process',
                        'Backup process is completed successfully.',
                        'info'
                    )
                }
            })
            .catch(_ => {
                showMessage(
                    'Backup Error',
                    'An error occured during backup process!',
                    'warning'
                )
            })
            .finally(() => setBackupProcessing(false))
    }

    function handleRestoreBackup() {
        setBackupProcessing(true)
        window.electron.app.restoreBackup()
            .then(res => {
                if (res === 'incorrect file') {
                    showMessage(
                        'Backup Restore Error',
                        'Imported json file format are not correct!',
                        'warning'
                    )
                }
            })
            .catch(_ => {
                showMessage(
                    'Backup Restore Error',
                    'An error occured during restore backup process!',
                    'warning'
                )
            })
            .finally(() => setBackupProcessing(false))
    }

    if (backupProcessing) {
        return <MainLayout>
            <div className={clsx([
                "w-full h-full flex", "justify-center", "items-center"
            ])}>
                <StickLoading />
            </div>
        </MainLayout>
    }

    return (
        <MainLayout>
            <section
                className={clsx([
                    "p-4 flex flex-col gap-4 overflow-y-auto h-full"
                ])}
            >
                {/* Login with pin checkbox */}
                <div>
                    <CheckBox
                        id="login-pin"
                        labelText="Login with PIN"
                        styleVariant={checkBoxStyleVariants[1]}
                        checked={appContext.loginWithPin}
                        onChange={handleLoginWithPinChange}
                    />
                </div>
                {/* Initial only show installed games checkbox */}
                <div>
                    <CheckBox
                        id="only-installed"
                        labelText="Display only installed games as default"
                        styleVariant={checkBoxStyleVariants[1]}
                        checked={appContext.showOnlyInstalledGamesAsDefault}
                        onChange={handleShowOnlyInstalledChange}
                    />
                </div>
                {/* Open big picture mode on opening checkbox */}
                <div>
                    <CheckBox
                        id="open-bigpicture"
                        labelText="Big picture mode on application start"
                        styleVariant={checkBoxStyleVariants[1]}
                        checked={appContext.openBigPictureMode}
                        onChange={handleOpenBigPictureModeChange}
                    />
                </div>
                {/* Start on windows boots checkbox */}
                <div>
                    <CheckBox
                        id="start-on-windows-boot"
                        labelText="Start on Windows boot"
                        styleVariant={checkBoxStyleVariants[1]}
                        checked={appContext.startOnWindowsBoot}
                        onChange={handleStartOnWindowsBootChange}
                    />
                </div>
                <PinCreateGroup
                    existingPinCode={appContext.userPreferences?.pinCode}
                    pinCode={pinCode}
                    loginWithPin={appContext.loginWithPin}
                    pinCreateError={pinCreateError}
                    pinCreateSuccess={pinCreateSuccess}
                    verifyPinCode={verifyPinCode}
                    handlePinCodeChange={handlePinCodeChange}
                    handleVerifyPinCodeChange={handleVerifyPinCodeChange}
                    handleSavePin={handleSavePin}
                />
                <PinUpdateGroup
                    existingPinCode={appContext.userPreferences?.pinCode}
                    loginWithPin={appContext.loginWithPin}
                    pinCreateSuccess={pinCreateSuccess}
                    pinUpdateError={pinUpdateError}
                    newPinCode={newPinCode}
                    oldPinCode={oldPinCode}
                    verifyNewPinCode={verifyNewPinCode}
                    handleNewPinCodeChange={handleNewPinCodeChange}
                    handleOldPinCodeChange={handleOldPinCodeChange}
                    handleSaveNewPin={handleSaveNewPin}
                    handleVerifyNewPinCodeChange={handleVerifyNewPinCodeChange}
                />
                {/* Save Settings Button */}
                <div>
                    <Button
                        caption="SAVE"
                        styleVariant={buttonStyleVariants[1]}
                        onClick={handleSave}
                    />
                </div>
                {/* Backup & Restore Section */}
                <div
                    className="w-110 my-4 rounded-2xl border border-gray-400 dark:border-gray-700 bg-gray-100 dark:bg-gray-800"
                >
                    <div
                        className="p-4 rounded-t-2xl bg-gray-300 dark:bg-gray-900 text-gray-700 dark:text-white font-bold text-xl border-b dark:border-gray-700 border-gray-400"
                    >BACKUP</div>
                    <div
                        className={clsx([
                            "flex items-center justify-center gap-8 p-4"
                        ])}
                    >
                        {appData.games.length > 0 && <Button
                            caption="BACKUP"
                            styleVariant={buttonStyleVariants[1]}
                            onClick={handleBackup}
                        />}
                        <Button
                            caption="RESTORE BACKUP"
                            styleVariant={buttonStyleVariants[1]}
                            onClick={handleRestoreBackup}
                        />
                    </div>
                    <p className="dark:text-white p-4 pt-0">
                        * A folder is created after the backup process. You can then restore the 
                        backup by referencing this folder.
                    </p>
                </div>
            </section>
        </MainLayout>
    )
}