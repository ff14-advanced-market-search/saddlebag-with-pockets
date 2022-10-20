import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import {
  getDarkModeFromLocalStorage,
  setDarkModeInLocalStorage
} from '../localStorage/darkModeHelpers'

export interface UserState {
  darkmode: boolean
}

const initialState: UserState = {
  darkmode: getDarkModeFromLocalStorage()
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
    setDarkMode: (state, action: PayloadAction<boolean>) => {
      state.darkmode = action.payload
    }
  }
})

export const { toggleDarkMode, setDarkMode } = userSlice.actions

export default userSlice.reducer
