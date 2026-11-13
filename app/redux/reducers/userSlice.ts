import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import {
  clearDarkModeFromLocalStorage,
  getSystemDarkMode,
  setDarkModeInLocalStorage
} from '../localStorage/darkModeHelpers'
import {
  getFFScanSortOrderInLocalStorage,
  setFFScanOrderInLocalStorage
} from '../localStorage/ffScanOrderHelpers'
import {
  getFFWorldDataFromLocalStorage,
  setFFWorldDataInLocalStorage
} from '../localStorage/ffxivWorldDataHelpers'
import { validateWorldAndDataCenter } from '~/utils/locations'
import {
  getWoWRealmDataFromLocalStorage,
  setWoWRealmDataInLocalStorage
} from '../localStorage/wowRealmHelpers'
import {
  getWoWForeverSettingsFromLocalStorage,
  setWoWForeverSettingsInLocalStorage
} from '../localStorage/wowForeverHelpers'
import type { WoWForeverSettings } from '~/utils/WoWForever'
import { validateWoWForeverSettings } from '~/utils/WoWForever'
import {
  getDefaultSearchGameFromLocalStorage,
  setDefaultSearchGameInLocalStorage
} from '../localStorage/defaultSearchGameHelpers'
import type { WoWServerData, WoWServerRegion } from '~/requests/WoW/types'
import { validateServerAndRegion } from '~/utils/WoWServers'

export interface UserState {
  darkmode: boolean
  themePreference: 'system' | 'manual'
  ffScanSortOrder: Array<string>
  ffxivWorld: { data_center: string; world: string }
  wowRealm: { server: WoWServerData; region: WoWServerRegion }
  wowForever: WoWForeverSettings
  defaultSearchGame: 'ffxiv' | 'wow' | 'gw2'
}

const initialState: UserState = {
  darkmode: false,
  themePreference: 'system',
  ffScanSortOrder: getFFScanSortOrderInLocalStorage(),
  ffxivWorld: getFFWorldDataFromLocalStorage(),
  wowRealm: getWoWRealmDataFromLocalStorage(),
  wowForever: getWoWForeverSettingsFromLocalStorage(),
  defaultSearchGame: getDefaultSearchGameFromLocalStorage()
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    toggleDarkMode: (state) => {
      const newValue = !state.darkmode
      setDarkModeInLocalStorage(newValue)

      state.darkmode = newValue
      state.themePreference = 'manual'
    },
    setDarkMode: (state, { payload }: PayloadAction<boolean>) => {
      setDarkModeInLocalStorage(payload)
      state.darkmode = payload
      state.themePreference = 'manual'
    },
    syncTheme: (
      state,
      {
        payload
      }: PayloadAction<{ darkmode: boolean; preference: 'system' | 'manual' }>
    ) => {
      state.darkmode = payload.darkmode
      state.themePreference = payload.preference
    },
    resetToSystemTheme: (state) => {
      clearDarkModeFromLocalStorage()
      state.darkmode = getSystemDarkMode()
      state.themePreference = 'system'
    },
    setFFScanOrder: (state, { payload }: PayloadAction<Array<string>>) => {
      setFFScanOrderInLocalStorage(payload)
      state.ffScanSortOrder = payload
    },
    setFFxivWorld: (
      state,
      { payload }: PayloadAction<{ data_center: string; world: string }>
    ) => {
      const { world, data_center } = validateWorldAndDataCenter(
        payload.world,
        payload.data_center
      )
      setFFWorldDataInLocalStorage(world, data_center)
      state.ffxivWorld = validateWorldAndDataCenter(world, data_center)
    },
    setWoWRealmData: (
      state,
      {
        payload
      }: PayloadAction<{ server: WoWServerData; region: WoWServerRegion }>
    ) => {
      const { server, region } = validateServerAndRegion(
        payload.region,
        payload.server.id,
        payload.server.name
      )

      setWoWRealmDataInLocalStorage(server, region)

      state.wowRealm = { server, region }
    },
    setWoWForeverSettings: (
      state,
      { payload }: PayloadAction<WoWForeverSettings>
    ) => {
      const settings = validateWoWForeverSettings(
        payload.region,
        payload.faction
      )
      setWoWForeverSettingsInLocalStorage(settings)
      state.wowForever = settings
    },
    setDefaultSearchGame: (
      state,
      { payload }: PayloadAction<'ffxiv' | 'wow' | 'gw2'>
    ) => {
      setDefaultSearchGameInLocalStorage(payload)
      state.defaultSearchGame = payload
    }
  }
})

export const {
  toggleDarkMode,
  setDarkMode,
  syncTheme,
  resetToSystemTheme,
  setFFScanOrder,
  setFFxivWorld,
  setWoWRealmData,
  setWoWForeverSettings,
  setDefaultSearchGame
} = userSlice.actions

export default userSlice.reducer
