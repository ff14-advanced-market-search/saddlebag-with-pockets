import { createSlice } from '@reduxjs/toolkit'

export interface UserState {
  darkmode: boolean
}

const initialState: UserState = {
  darkmode: false
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    toggleDarkMode: (state) => {
      state.darkmode = !state.darkmode
    }
  }
})

export const { toggleDarkMode } = userSlice.actions

export default userSlice.reducer
