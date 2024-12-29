import IconThemeAuto from '~/assets/icons/nav/theme_auto.svg'
import IconThemeDark from '~/assets/icons/nav/theme_dark.svg'
import IconThemeLight from '~/assets/icons/nav/theme_light.svg'

import type { IconType } from '~/components'
import type { ThemeTheme } from '~/contexts'

export const ThemeIconMap: Record<ThemeTheme, IconType> = {
    auto: IconThemeAuto,
    light: IconThemeLight,
    dark: IconThemeDark,
} as const

export const ThemeCycleMap: Record<ThemeTheme, ThemeTheme> = {
    auto: 'light',
    light: 'dark',
    dark: 'auto',
} as const

export const ThemeSwitchHintMap: Record<ThemeTheme, string> = {
    auto: 'Switch to your system theme',
    light: 'Switch to light theme',
    dark: 'Switch to dark theme',
} as const
