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

export interface UserState {
  darkmode: boolean
  ffScanSortOrder: Array<string>
}

const initialState: UserState = {
  darkmode: getDarkModeFromLocalStorage(),
  ffScanSortOrder: getFFScanSortOrderInLocalStorage()
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
    }
  }
})

export const { toggleDarkMode, setDarkMode, setFFScanOrder } = userSlice.actions

export default userSlice.reducer
