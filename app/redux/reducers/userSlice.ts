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
// import type { WoWServerRegion } from '~/requests/WOWScan'
import {
  getFFWorldDataFromLocalStorage,
  setFFWorldDataInLocalStorage
} from '../localStorage/ffxivWorldDataHelpers'
import { validateWorldAndDataCenter } from '~/utils/locations'

export interface UserState {
  darkmode: boolean
  ffScanSortOrder: Array<string>
  ffxivWorld: { data_center: string; world: string }
  // wowWorld: { server: { id: number; name: string }; region: WoWServerRegion }
}

const initialState: UserState = {
  darkmode: getDarkModeFromLocalStorage(),
  ffScanSortOrder: getFFScanSortOrderInLocalStorage(),
  ffxivWorld: getFFWorldDataFromLocalStorage()
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
    }
  }
})

export const { toggleDarkMode, setDarkMode, setFFScanOrder, setFFxivWorld } =
  userSlice.actions

export default userSlice.reducer
