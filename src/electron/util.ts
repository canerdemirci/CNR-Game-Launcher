import { ipcMain, WebContents, WebFrameMain } from "electron"
import { pathToFileURL } from "url"
import { getUIPath } from "./pathResolver.js"

export function isDev(): boolean {
    return process.env.NODE_ENV === 'development'
}

export function ipcMainHandle<Key extends keyof EventPayloadMapping>(
    key: Key,
    handler?: (payload: EventPayloadMapping[Key]) =>
        EventReturnMapping[Key] | Promise<EventReturnMapping[Key]>
) {
    ipcMain.handle(key, (event, payload) => {
        validateEventFrame(event.senderFrame!)
        if (handler) return handler(payload)
    })
}

export function ipcMainOn<Key extends keyof EventPayloadMapping>(
  key: Key,
  handler: (payload: EventPayloadMapping[Key]) => EventReturnMapping[Key]
) {
  ipcMain.on(key, (event, payload) => {
    validateEventFrame(event.senderFrame!)
    return handler(payload)
  })
}

export function validateEventFrame(frame: WebFrameMain) {
    const url = frame.url

    if (isDev() && new URL(url).host === 'localhost:5123') return

    const uiPath = pathToFileURL(getUIPath()).toString()

    if (!url.startsWith(uiPath)) {
        throw new Error('Malicius Event')
    }
}

export function ipcWebContentsSend<Key extends keyof EventPayloadMapping>(
    key: Key,
    webContents: WebContents,
    payload: EventPayloadMapping[Key]
) {
    webContents.send(key, payload)
}