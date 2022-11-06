import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import {
  getDarkModeFromLocalStorage,
  setDarkModeInLocalStorage
} from '../localStorage/darkModeHelpers'
import { getFFScanSortOrder } from '../localStorage/ffScanOrderHelpers'

export interface UserState {
  darkmode: boolean
  ffScanSortOrder: Array<string>
}

const initialState: UserState = {
  darkmode: getDarkModeFromLocalStorage(),
  ffScanSortOrder: getFFScanSortOrder()
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
      setFFScanOrder(payload)
      state.ffScanSortOrder = payload
    }
  }
})

export const { toggleDarkMode, setDarkMode, setFFScanOrder } = userSlice.actions

export default userSlice.reducer
