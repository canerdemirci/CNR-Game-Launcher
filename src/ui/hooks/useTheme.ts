import { useEffect, useState } from 'react'
import { useAppContext } from '../providers/AppContextProvider'

const applyTheme = (theme: Omit<Theme, 'system'>) => {
  const root = document.documentElement

  if (theme === 'dark') {
    root.classList.add('dark')
  } else if (theme === 'light') {
    root.classList.remove('dark')
  }
}

const watchSystemTheme = (callback: (theme: Omit<Theme, 'system'>) => void) => {
  window.matchMedia('(prefers-color-scheme: dark)')
    .addEventListener('change', ev => {
        if (ev.matches) {
          applyTheme('dark')
          callback('dark')
        } else {
          applyTheme('light')
          callback('light')
        }
    })
}

function getSystemTheme(): Omit<Theme, 'system'> {
  const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches

  return isDark ? 'dark' : 'light'
}

export const useTheme = () => {
  const appContext = useAppContext()
  
  const [theme, setTheme] = useState<Omit<Theme, 'system'>>('light')

  useEffect(() => {
    if (!appContext.isUserPrefsFetching) {
      const themePref = appContext.theme

      if (appContext.theme === 'system' || !appContext.theme) {
        setTheme(getSystemTheme() as Theme)
      } else {
        setTheme(themePref || 'system')
      }
    }
  }, [appContext.isUserPrefsFetching])

  useEffect(() => {
    applyTheme(theme)
  }, [theme])

  useEffect(() => {
    if (appContext.theme === 'system') {
      setTheme(getSystemTheme())
      watchSystemTheme((theme) => setTheme(theme))
    } else {
      setTheme(appContext.theme)
    }
  }, [appContext.theme])

  return theme
}


