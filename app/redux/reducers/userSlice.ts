import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import {
  getDarkModeFromLocalStorage,
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
import type { WoWServerData, WoWServerRegion } from '~/requests/WoW/types'

export interface UserState {
  darkmode: boolean
  ffScanSortOrder: Array<string>
  ffxivWorld: { data_center: string; world: string }
  wowRealm: { server: WoWServerData; region: WoWServerRegion }
}

const initialState: UserState = {
  darkmode: getDarkModeFromLocalStorage(),
  ffScanSortOrder: getFFScanSortOrderInLocalStorage(),
  ffxivWorld: getFFWorldDataFromLocalStorage(),
  wowRealm: getWoWRealmDataFromLocalStorage()
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    toggleDarkMode: (state) => {
      const newValue = !state.darkmode
      setDarkModeInLocalStorage(newValue)

      state.darkmode = newValue
    },
    setDarkMode: (state, { payload }: PayloadAction<boolean>) => {
      setDarkModeInLocalStorage(payload)
      state.darkmode = payload
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
      setWoWRealmDataInLocalStorage(payload.server, payload.region)

      state.wowRealm = payload
    }
  }
})

export const {
  toggleDarkMode,
  setDarkMode,
  setFFScanOrder,
  setFFxivWorld,
  setWoWRealmData
} = userSlice.actions

export default userSlice.reducer
