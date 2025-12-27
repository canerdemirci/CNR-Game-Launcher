// audio/SoundManager.ts
import { Howl, Howler } from "howler"

class SoundManager {
  private unlocked = false

  sounds: Record<string, Howl> = {}

  init() {
    if (this.unlocked) return

    if (Howler.ctx?.state === "suspended") {
      Howler.ctx.resume()
    }

    this.unlocked = true
  }

  register(name: string, sound: Howl) {
    this.sounds[name] = sound
  }

  play(name: string) {
    this.init()
    this.sounds[name]?.play()
  }

  setVolume(v: number) {
    Howler.volume(v)
  }

  mute(muted: boolean) {
    Howler.mute(muted)
  }
}

export const soundManager = new SoundManager()